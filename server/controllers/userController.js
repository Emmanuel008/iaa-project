const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser")
const User = db.users;
const Hospital = db.hospitals
require("dotenv").config();

exports.create = async (req,res) =>{
    try {
        const {
          first_name,
          last_name,
          email,
          password,
          user_type,
          phone,
          hospital_id,
        } = req.body;

        const emailCheck = await User.findOne({ where: { email: email } });
        if (emailCheck) {
          return res
            .status(409)
            .json("User with given Email already exist" );
        }

        const salt = await bcrypt.genSalt(Number(10));


        if(user_type === "root"){
        const hashedPassword = await bcrypt.hash(password, salt);
          await User.create({
            first_name: first_name,
            last_name: last_name,
            password: hashedPassword,
            email: email,
            phone: phone,
            user_type: user_type,
          });
        }else{
        const hashedPassword = await bcrypt.hash(last_name, salt);
          await User.create({
            first_name: first_name,
            last_name: last_name,
            password: hashedPassword,
            email: email,
            phone: phone,
            user_type: user_type,
            checkNumber: req.body.checkNumber,
            hospital_id: hospital_id,
          });
        }
        
        res.status(200).json("User created Successfully")
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.login = async(req,res) =>{
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email: email },
      });
      if (!user) {
        return res.status(401).json("Invalid User Name or password");
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json("Invalid User Name or password");
      }
        if(user){
            const email = user.email;
            const token = jwt.sign({email}, process.env.SECRETE, {expiresIn: "1d"});
            res.cookie('token', token)
            return res.json({message:"Success", user})
        }
    } catch (error) {
       res.status(500).json(error); 
    }
}

exports.updateUser = async(req, res) =>{
    try {
         const id = req.params.id;
         console.log(req.body)
         await User.update(req.body, { where: { user_id: id } });
         res.status(200).json("Employee updated successfully");
    } catch (error) {
       res.status(500).json(error); 
    }
}

exports.changePassword = async (req, res) =>{
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword } = req.body;

        // Find the user by ID
        const user = await User.findOne({ where: { user_id: userId } });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Check if the old password provided is valid
        const isPasswordValid = await bcrypt.compare(
          oldPassword,
          user.password
        );

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid old password" });
        }

        // Generate a new hash for the new password
        const newSalt = await bcrypt.genSalt(Number(10));
        const newHashedPassword = await bcrypt.hash(newPassword, newSalt);

        // Update the user's password in the database
        await User.update(
          { password: newHashedPassword },
          { where: { user_id: userId } }
        );

        res.status(200).json("Password changed successfully");
    } catch (error) {
       res.status(500).json(error);  
    }
}

exports.deleteUser = async (req, res) =>{
    try {
        const id = req.params.id;
        await User.destroy({ where: { user_id: id } });
        res.status(200).json("Employee deteled successfully");
    } catch (error) {
       res.status(500).json(error); 
    }
}

exports.verifyUser = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ status: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.SECRETE, (err, decode) => {
    if (err) {
      return res
        .status(401)
        .json({ status: false, message: "Failed to authenticate token" });
    } else {
      req.email = decode.email;
      return res.status(200).json({ status: true, email: decode.email });
    }
  });
};



exports.getAll = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const maxPageSize = 10;

    // Fetch the total number of users in the database
    const totalCount = await User.count();

    // Calculate the dynamic pageSize based on total users
    const pageSize = Math.min(maxPageSize, totalCount);

    // Calculate the offset based on the requested page and dynamic pageSize
    const offset = (page - 1) * pageSize;

    // Fetch the paginated users
    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit: pageSize,
      offset,
      include: [
        {
          model: Hospital,
          attributes: ["hospital_name"], // Include only the 'area_name' attribute of the Area model
          required: true, // Use left join to include users without an associated area
        },
      ],
    });

    const totalPages = Math.ceil(count / pageSize);

    // Send the response once
    res.status(200).json({
      users,
      meta: {
        totalUsers: count,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message }); // Ensure to send an error response if an exception occurs
  }
};

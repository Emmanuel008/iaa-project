const generateCustomId = async (model, userType) => {
  const currentYear = new Date().getFullYear();
  let typeCode;
  switch (userType) {
    case "root":
      typeCode = "01";
      break;
    case "admin":
      typeCode = "02";
      break;
    case "user":
      typeCode = "03";
      break;
    default:
      throw new Error("Invalid user type");
  }

  const prefix = `${currentYear}-${typeCode}-`;

  // Find the maximum current sequence number
  const lastRecord = await model.findOne({
    order: [["user_id", "DESC"]],
  });
  let nextSequenceNumber = "00001";
  if (lastRecord && lastRecord.user_id) {
    const lastId = lastRecord.user_id;
    const lastSequenceNumber = parseInt(lastId.split("-")[2], 10);
    nextSequenceNumber = (lastSequenceNumber + 1).toString().padStart(5, "0");
  }

  return `${prefix}${nextSequenceNumber}`;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      user_id: {
        type: DataTypes.STRING, // Change to STRING to accommodate custom format
        primaryKey: true,
        // allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_type: {
        type: DataTypes.ENUM("root", "admin", "user"),
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user, options) => {
          user.user_id = await generateCustomId(User, user.user_type);
        },
      },
    }
  );

  return User;
};

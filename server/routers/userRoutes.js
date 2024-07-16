const router = require("express").Router();

const {create, login, verifyUser, getAll,deleteUser, updateUser, changePassword} = require("../controllers/userController");

router.post("/", create);
router.post("/login", login);

router.get("/", verifyUser);
router.get("/all", getAll)

router.put("/:id", updateUser)
router.put("/changepassword/:id", changePassword)

router.delete("/:id", deleteUser)

module.exports = router;
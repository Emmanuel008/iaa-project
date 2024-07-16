const router = require("express").Router();


const {create, updateInfo, deleteInfo, getAll} = require("../controllers/admitingController")

router.post("/", create);

router.get("/:id", getAll)

router.put("/:id", updateInfo)

router.delete("/:id", deleteInfo)

module.exports = router;
const express = require("express");
const router = express.Router();
const { verifyUser, listUsers, deleteUser, exportUsersPdf } = require("../controllers/adminController");

router.put("/verify/:id", verifyUser);
router.get("/users", listUsers);
router.delete("/delete/:id", deleteUser);
router.get("/export/pdf", exportUsersPdf);

module.exports = router;

const express = require("express");
const {addTransaction, deleteTransaction, getAllTransaction, editTransaction} = require("../controllers/transactionCtrl");
const router = express.Router();

router.post("/add", addTransaction);
router.get("/getAll", getAllTransaction);
router.delete("/:id", deleteTransaction);
router.post("/edit/:id", editTransaction);

module.exports=router;
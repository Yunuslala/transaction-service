const { CreateTransaction, GetCompletedTable, GetPendingTable } = require("../controllers/Pending.controller");
const { Authentication } = require("../middleware/Authentication");
const express=require("express");
const transactionRouter=express.Router();

transactionRouter.route("/transactions").post(Authentication,CreateTransaction);
transactionRouter.route("/completed-Transactions").get(Authentication,GetCompletedTable);
transactionRouter.route("/Pending-Transactions").get(Authentication,GetPendingTable);



module.exports={
    transactionRouter
}
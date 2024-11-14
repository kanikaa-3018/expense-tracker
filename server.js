const express = require("express");
const cors = require("cors");
const morgan= require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const connectDB= require("./config/connectDB");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();
connectDB();
const app= express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.get("/", (req,res)=>{
    res.send("hello from server")
});
app.use("/api/v1/users" , userRoutes);
app.use("/api/v1/transactions" , transactionRoutes);

//port
const PORT = process.env.PORT || 8000;

//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
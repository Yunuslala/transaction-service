const express=require("express");
const app=express();
const cors=require("cors");
const {connection}=require("./config/db");
const { UserRouter } = require("./routers/User.router");
const { transactionRouter } = require("./routers/transactions.router");
const { sequelize } = require('./models/model');
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down server due to Uncaught Exception");
    process.exit(1);
})


// Sync all models that aren't already in the database
sequelize.sync({ force: false }) // Set force: true to drop existing tables and recreate them
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });


app.use(express.json());
app.use(cors());
app.use('/api/v1',UserRouter);
app.use('/api/v1',transactionRouter);










const server=app.listen(4500,async()=>{
    console.log(`http://localhost:4500`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("shutting down server due to unhandled promise rejection")

    server.close(()=>{
        process.exit(1)
    })
})
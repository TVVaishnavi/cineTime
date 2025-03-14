const express = require("express")
const cors = require("cors")
const app=express()
require("dotenv").config();
require("../src/config/database")
app.use(express.json())
const userRouter = require("./routes/user")
const movieRoute = require("../src/routes/movie")
const ticketRoute = require("./routes/ticket")
const theatreRoute = require("./routes/theatre")
const selectRoute = require("./routes/selectedtheatre")
const createAdminAccount = require("../src/admin")
const bodyparam=require('body-parser')
const PORT = process.env.PORT||3800
app.use(bodyparam.urlencoded({ extended: false }))
app.use(bodyparam.json())
app.get("/",(req,res)=>{
    res.status(200).json({message: "server is running"})
})

if(require.main === module){
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`)
    })
}
app.use(cors())
app.use("/", userRouter)
app.use("/api", movieRoute,ticketRoute,theatreRoute,selectRoute)
createAdminAccount()

module.exports = app
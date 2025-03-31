const express = require("express")
const cors = require("cors")
const app=express()
require("dotenv").config();
require("../src/config/database")
app.use(express.json())
const userRouter = require("./routes/user")
const movieRoute = require("../src/routes/movies/movie")
const ticketRoute = require("./routes/movies/ticket")
const theatreRoute = require("./routes/movies/theatre")
const selectRoute = require("./routes/movies/selectedtheatre")
const eventRoute = require("./routes/movies/event")
const sportRoute = require("./routes/movies/sport")
const activityRoute = require("./routes/movies/activity")
const busRoute = require("./routes/travels/bus")
const trainRoute = require("./routes/travels/train")
const flightRoute = require("./routes/travels/flight")
const createAdminAccount = require("../src/admin")
const bodyparam=require('body-parser')
const PORT = process.env.PORT||3800
app.use(bodyparam.urlencoded({ extended: false }))
app.use(bodyparam.json())
app.get("/",(req,res)=>{
    res.status(200).json({message: "server is running"})
})

app.use(cors())
app.use("/", userRouter)
app.use("/api", movieRoute,ticketRoute,theatreRoute,selectRoute,eventRoute,sportRoute,activityRoute, busRoute, trainRoute, flightRoute)

if(require.main === module){
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`)
    })
}

createAdminAccount()

module.exports = app
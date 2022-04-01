const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const userRoute = require("./routes/users")
const pinRoute = require("./routes/pins")
dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(()=>{
    console.log("MongoDB connected")

}).catch(err=>console.log(err));

app.use("/api/pins", pinRoute);
app.use("/api/users", userRoute);

app.listen(8800, ()=>{
    console.log("Server is running")
})
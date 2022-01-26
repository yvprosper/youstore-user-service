// import mongoose from "mongoose";
// import config from "config";
// import logger from "./logger";

const mongoose = require ('mongoose')

const connect = async () => {
    try {
    await mongoose.connect(process.env.DB_URI ,
    { useNewUrlParser: true, 
    useUnifiedTopology: true } );
    console.log ('connected to database')
    } catch (error) {
    console.log(error)
    }
}
    


export default connect;
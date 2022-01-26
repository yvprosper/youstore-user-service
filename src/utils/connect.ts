 import mongoose from "mongoose";
 import config from "config";
 import logger from "./logger";



const connect = async () => {
    try {
    const dbUri = config.get<string>("dbUri");
    await mongoose.connect(dbUri);
    logger.info("connected to Database");
    } catch (error) {
        logger.error("Could not connect to db");
        process.exit(1);
    }
}
    


export default connect;
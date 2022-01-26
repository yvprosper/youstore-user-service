import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";


const port = config.get<number>("port");
connect()



app.use(express.json());

app.listen(port, async () => {
    logger.info(`App is running at http://localhost:${port}`);
});
import express from "express";
import http from "http";
import Config from "config"
import log from "./utils/logger";
import cors from 'cors'



class Server {
    config: typeof Config;
    router: any;
    logger: typeof log;
    express: any;
    
    constructor({ config, router, logger }: {config: typeof Config, router: any, logger: typeof log;}) {
        this.config = config;
        this.logger = logger;
        this.express = express();
        this.express.disable("x-powered-by");
        this.express.use(router);
        this.express.use(express.json())
        this.express.app = http.createServer(this.express);
        
       
      }
    
      start() {
        return new Promise((resolve) => {
          const app = this.express
          app.use(cors)
          const server = this.express.app.listen(this.config.get("httpPort"), () => {
            const { port } = server.address();
            this.logger.info(`[pid ${process.pid}] REST server Listening on port ${port}`);
            return resolve(this.express.server);
          });
        });
      }
}

export default Server
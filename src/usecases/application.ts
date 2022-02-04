class Application {
    restServer: any;
    database: any;
    logger: any;
    config: any;
    shutdown: any;


    constructor({ restServer, database, logger, config}: any) {
        this.restServer = restServer;
        this.database = database;
        this.logger = logger;
        this.config = config;
    }

    async start() {
        if (this.database) {
            await this.database.connect();
            //this.logger.info("Connected to MongoDB");

          }

        await this.restServer.start();
    }

}

export default Application;

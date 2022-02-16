class Application {
    restServer: any;
    database: any;
    logger: any;
    config: any;
    shutdown: any;
    messenger: any


    constructor({ restServer, database, logger, config, messenger}: any) {
        this.restServer = restServer;
        this.database = database;
        this.logger = logger;
        this.config = config;
        this.messenger = messenger
    }

    async start() {
        if (this.database) {
            await this.database.connect();
            //this.logger.info("Connected to MongoDB");

        }
        this.logger.info('connecting to rabbitMq...')
        await this.messenger.createChannel()
        this.logger.info('connected to rabbitMq')
        await this.restServer.start();
    }

}

export default Application;

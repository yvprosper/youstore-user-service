import restServer from "../interface/http/server"
import database from "../infra/database/mongoose"
import log from "../interface/http/utils/logger";
import Config from "config"
import Messenger from "../infra/libs/rabbitmq";
class Application {
    restServer: restServer;
    database: database;
    logger: typeof log;
    config: typeof Config;
    messenger: Messenger;
    shutdown: any


    constructor({ restServer, database, logger, config, messenger}: {
        restServer: restServer ,database: database, logger: typeof log, config: typeof Config, messenger: Messenger
    }) {
        this.restServer = restServer;
        this.database = database;
        this.logger = logger;
        this.config = config;
        this.messenger = messenger
    }

    async start() {
        if (this.database) {
            await this.database.connect();

        }
        
        this.logger.info('connecting to rabbitMq...')
        await this.messenger.createChannel()
        
        await this.restServer.start();
    }

}

export default Application;

import amqp, { Channel, Connection, Message } from "amqplib";
import dotenv from "dotenv"
dotenv.config()
import log from "../../interface/http/utils/logger";
import MerchantModel from "../database/models/mongoose/merchantModel";


export interface IMessenger {
  createChannel(): Promise<void>;
  sendToQueue(queue: string, content: Object): Promise<void>;
  assertQueue(queue: string): Promise<void>;
  logger: typeof log
}

export class Messenger implements IMessenger {
   channel!: Channel;
   logger: typeof log
  

  constructor({ logger }: { logger: typeof log }) {
    this.logger = logger;
  }

  async createChannel(): Promise<void> {
    const amqp_url = process.env.AMQP_URL || "";
    const connection: Connection = await amqp.connect(amqp_url);

    this.channel = await connection.createChannel();
    this.logger.info('connected to rabbitMq')
    await this.channel.assertExchange('orderEvents', 'topic')
    await this.assertQueue('update_account_balance')
    await this.channel.bindQueue('update_account_balance', 'orderEvents', 'orders.status.success')
    this.consumeOrderComplete()
  }
  async assertQueue(queue: string): Promise<void> {
    await this.channel.assertQueue(queue, {
      durable: true,
    });
  }
  async sendToQueue(queue: string, content: Object): Promise<void> {
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));
  }

  async publish(exchange: string, queue: string, content: Object): Promise<void> {
    await this.channel.publish(exchange, queue , Buffer.from(JSON.stringify(content)));
  }

  // async assertExchange(exchange: string): Promise<void> {
  //   await this.channel.assertExchange(exchange, 'fanout', {
  //     durable: false  });
  // }
 
   consumeOrderComplete(){
    
    this.channel.consume(`update_account_balance`, async (messageBuffer: Message | null) => {
      const msg = messageBuffer;
      const routingKey = msg?.fields.routingKey
      if (routingKey !== 'orders.status.success') return

      const message = JSON.parse(msg!.content.toString());
      
      message.order.products.map(async (item: any)=> {
          const merchantId = item.merchantId
          let merchant = await MerchantModel.findOne({_id: merchantId})
          let funds = Number(merchant!.accountBalance) + Number(item.price)
          merchant!.accountBalance = funds
          merchant!.save()
          console.log(`Merchant Account Balance updated \n ${merchant}`)
          
      })    
  
}, {noAck: true})
}

  

}

export default Messenger;
import amqp, { Channel, Connection, Message } from "amqplib";
import dotenv from "dotenv"
dotenv.config()
//import OrderUseCase from "../../usecases/OrderUseCase";

export interface IMessenger {
  createChannel(): Promise<void>;
  sendToQueue(queue: string, content: Object): Promise<void>;
  assertQueue(queue: string): Promise<void>;
//   consumePaymentSuccess(): Promise<void>;
//   consumePaymentFailure(): Promise<void>;
}

export class Messenger implements IMessenger {
  private channel!: Channel;
  //private orderUseCase: OrderUseCase;

//   constructor({ orderUseCase }: { orderUseCase: OrderUseCase }) {
//     this.orderUseCase = orderUseCase;
//   }

  async createChannel(): Promise<void> {
    const amqp_url = process.env.AMQP_URL || "";
    const connection: Connection = await amqp.connect(amqp_url);

    this.channel = await connection.createChannel();
  }
  async assertQueue(queue: string): Promise<void> {
    await this.channel.assertQueue(queue, {
      durable: false,
    });
  }
  async sendToQueue(queue: string, content: Object): Promise<void> {
    await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(content)));
  }

//   async consumePaymentSuccess() {
//     this.channel.consume("payment_success", (msg: Message | null) => {
//       if (msg) {
//         const id = JSON.parse(msg.content.toString());
//         this.orderUseCase.findByIdAndUpdateStatus(id, true);
//       }
//     });
//   }

//   async consumePaymentFailure() {
//     this.channel.consume("payment_failure", (msg: Message | null) => {
//       if (msg) {
//         const id = JSON.parse(msg.content.toString());
//         this.orderUseCase.findByIdAndUpdateStatus(id, false);
//       }
//     });
//   }
}

export default Messenger;
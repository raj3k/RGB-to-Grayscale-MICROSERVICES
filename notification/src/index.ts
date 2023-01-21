import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import amqplib, { Channel, Connection } from 'amqplib'

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let channel: Channel, connection: Connection

connect()

async function connect() {
  try {
    const amqpServer = 'amqp://rabbitmq'
    connection = await amqplib.connect(amqpServer)
    channel = await connection.createChannel()

    // consume all the orders that are not acknowledged
    await channel.consume('converted', (data) => {
      console.log(`Received ${Buffer.from(data!.content)}`)
      addConvertedImgURL(data!.content.toString());
      channel.ack(data!);
    })
  } catch (error) {
    console.log(error)
  }
}

const PORT = 3001;

let clients: any = [];
// TODO: if notification service will restart this will be empty
let images: any = [];


const sendEventsToAll = (newMessage: any) => {
    clients.forEach((client: any) => client.response.write(`data: ${JSON.stringify(newMessage)}\n\n`))
}

const addConvertedImgURL = (newMessage: string) => {
    const m = JSON.parse(newMessage);
    const converted_fid = m['converted_fid'];
    images.push(converted_fid);
    return sendEventsToAll(converted_fid);
}

const eventsHandler = (request: Request, response: Response, next: NextFunction) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Cache-Control': 'no-cache',
    };
    response.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(images)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter((client: any) => client.id !== clientId);
    });
}
  
app.get('/events', eventsHandler);

app.listen(PORT, () => {
    console.log(`Notification service listening at http://localhost:${PORT}`)
});
import * as dotenv from "dotenv";
import * as mongoDB from "mongodb";

export async function connectToDatabase () {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

    await client.connect();

    console.log(`Successfully connected`);
}
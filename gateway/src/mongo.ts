import * as dotenv from "dotenv";
import * as mongoDB from "mongodb";

let dbConnection: mongoDB.MongoClient;
export async function connectToDatabase () {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);

    dbConnection = await client.connect();

    console.log(`Successfully connected`);
}

export function getDB() {
    return dbConnection;
}
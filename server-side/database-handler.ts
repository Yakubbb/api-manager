'use server'
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri);

export default async function GetAllUsers() {

    client.connect()
    const database = client.db("api-manager");
    const collection = database.collection("users");
    const allData = await collection.find({}).toArray();
    console.log(allData)

}
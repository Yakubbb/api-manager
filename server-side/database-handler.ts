'use server'
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI as string

const client = new MongoClient(uri);

export default async function GetAllUsers() {
    try {
        client.connect()
        const database = client.db("telegrafDB");
        const movies = database.collection("stats");
        const query = { title: "paint green" };
        const movie = await movies.findOne(query);

        console.log(movie);
    } finally {
        await client.close();
    }
}
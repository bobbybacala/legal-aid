
// to connect with pinecone client
// Initialize a client
import { Pinecone } from "@pinecone-database/pinecone";

// create the pinecone db object
const pc = new Pinecone({
    apiKey: process.env.PDB_KEY,
    // environment: process.env.PDB_ENV
})

export default pc
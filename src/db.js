import mongoose from 'mongoose';
import 'dotenv/config'

// function to connect to mongo db
async function connectDB() {
    if (mongoose.connections[0].readyState) {
        // If a connection is already established, reuse it
        console.log('existing connection available')
        return;
    }

    // the connection string
    // const MONGO_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rmf4y1k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    const MONGO_URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.iwtq4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

    // connect in a try and catch block
    try {
        await mongoose.connect(MONGO_URI, {
            // Replace 'mydatabase' with your actual database name
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the Node.js process on connection error
    }
}

// function to disconnect from mongo db
async function disconnectDB() {
    if (mongoose.connections[0].readyState) {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

export { connectDB, disconnectDB };
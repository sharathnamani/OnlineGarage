import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        // Set connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };
        
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
        
    } catch (error) {
        console.error("Error in connecting to the database: ", error);
        
        // Provide more helpful error message
        if (error.name === 'MongooseServerSelectionError') {
            console.error(`
                Could not connect to MongoDB Atlas. Common reasons:
                1. Your IP address is not whitelisted in MongoDB Atlas
                2. Your connection string is incorrect
                3. Your network is blocking the connection
                
                Please check:
                - Your MongoDB Atlas Network Access settings
                - Your connection string in .env file
                - Your network/firewall settings
            `);
        }
        
        // Exit process with failure
        process.exit(1);
    }
}
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/user.routes.js";
import { connectDB } from "./db/connectDB.js";

const app = express();

// Load environment variables
dotenv.config();

// Enable CORS with specific origin and credentials
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        
        // Allow requests from various local development servers
        const allowedOrigins = [
            'http://127.0.0.1:5500', 
            'http://localhost:5500',
            'http://127.0.0.1:3000', 
            'http://localhost:3000',
            'http://127.0.0.1:5000',
            'http://localhost:5000',
            'http://127.0.0.1:3002',
            'http://localhost:3002'
        ];
        
        if(allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        console.log('Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to database
await connectDB();

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Online Garage API' });
});

// Set port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
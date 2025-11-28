import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import profileRoutes from "./routes/profile.routes.js";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.handler.js";
import cardioRoutes from './routes/cardio.routes.js';
import goalRoutes from './routes/goal.routes.js';
import strengthRoutes from './routes/strength.routes.js';


dotenv.config();

const app = express();

// Connect to MongoDB
await connectDB();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',           // URL Frontend Local
    'http://127.0.0.1:5173',           // Alternatif Local
    'https://ta-ppb-2025-3cs7.vercel.app'  // Ganti dengan domain Production Anda nanti
  ],
  credentials: true, // Izinkan cookie/token jika perlu
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes); 
app.use('/api/cardio', cardioRoutes);
app.use('/api/goals', goalRoutes);   
app.use('/api/strength', strengthRoutes);
app.use('/api/profile', profileRoutes);


app.get("/", (req, res) => {
  res.send("Backend server is running on Vercel");
});

// Error handler
app.use(errorHandler);

// Unhandled error middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

export default app;
import userRoutes from './routes/userRoutes.js';
import annonceRoutes from './routes/annonceRoutes.js';
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use('/api/', userRoutes);
app.use('/api/', annonceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




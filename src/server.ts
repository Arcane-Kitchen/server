import express from "express";
import userRoutes from "./routes/userRoutes.ts";

import cors from "cors";
const app = express();


const PORT = process.env.PORT;
const frontendUrl = process.env.FRONTEND_URL;

app.use(express.json());
app.use(cors({
	origin: frontendUrl,
  	credentials: true,
}));

// API Routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
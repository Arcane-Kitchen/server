import express from "express";
import userRoutes from "./routes/userRoutes";

const cors = require("cors");
const app = express();


const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

// API Routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
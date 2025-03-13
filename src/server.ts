import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import imageRoutes from "./routes/imageRoutes.js"; // Import the new image routes
import schedule from "node-schedule";
import { petStatsCalc } from "./utils/petStatsCalc.js";

const PORT = process.env.PORT;
const frontendUrl = process.env.FRONTEND_URL;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

// updates users pet stats every day at midnight
schedule.scheduleJob("0 0 * * *", async () => {
  petStatsCalc();
});

// API Routes
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/image", imageRoutes); // Use the new image routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

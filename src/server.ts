import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import schedule from "node-schedule";
import { petStatsCalc } from "./utils/petStatsCalc.js";

const PORT = process.env.PORT;
const frontendUrl = process.env.FRONTEND_URL;

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  if (req.hostname.startsWith("www.")) {
    res.redirect(301, `https://${req.hostname.replace("www.", "")}${req.url}`);
  } else {
    next();
  }
});
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

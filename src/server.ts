import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import enemyRoutes from "./routes/enemyRoutes.js";

import schedule from "node-schedule";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin && allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// updates users pet stats every day at midnight
// schedule.scheduleJob("0 0 * * *", async () => {
//   petStatsCalc();
// });

// API Routes
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);
app.use("/activity", activityRoutes);
app.use("/enemy", enemyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

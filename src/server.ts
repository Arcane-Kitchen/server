import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import schedule from "node-schedule";
import { getSupabaseAdminClient } from "./utils/supabase.js";
import { getAllUserData } from "./models/userModel.js";

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

// schedule.scheduleJob("*/10 * * * * *", async () => {
//   const newSupabase = await getSupabaseAdminClient();
//   const data = await getAllUserData(newSupabase);
//   console.log(data);
// });

// API Routes
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

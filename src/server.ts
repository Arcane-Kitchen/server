import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

const PORT = process.env.PORT || 8080;
const frontendUrl = process.env.FRONTEND_URL;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

// API Routes
app.use("/users", userRoutes);
app.use("/recipes", recipeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

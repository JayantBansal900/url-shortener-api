import express from "express";
import urlRoutes from "./routes/url.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "URL Shortener API is running...",
  });
});

app.use("/api/v1/urls", urlRoutes);

export default app;

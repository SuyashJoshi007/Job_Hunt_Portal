import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.get("/", (_req, res) => res.send("API working ✅"));

// ---------- APIs ----------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ---------- start server (bind IPv4), then connect DB ----------
const PORT = Number(process.env.PORT) || 8080; // use 8080 to avoid local conflicts

connectDB()
  .then(() => {
    const server = app.listen(PORT, "127.0.0.1", () => {
      const addr = server.address();
      console.log("Server listening:", addr); // should show { address:'127.0.0.1', family:'IPv4', port:8080 }
    });
  })
  .catch((e) => console.error("DB connect failed:", e));

// helpful: surface any hidden crashes
process.on("unhandledRejection", (e) =>
  console.error("UNHANDLED REJECTION:", e)
);
process.on("uncaughtException", (e) => console.error("UNCAUGHT EXCEPTION:", e));

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

app.use(express.json()); // req.body can be used now 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (_req, res) => res.send("API working ✅"));

// ---------- APIs ----------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      const addr = server.address();
      console.log("Server listening on PORT ::", PORT); 
    });
  })
  .catch((e) => console.error("DB connect failed:", e));

// helpful: surface any hidden crashes
process.on("unhandledRejection", (e) =>
  console.error("UNHANDLED REJECTION:", e)
);
process.on("uncaughtException", (e) => console.error("UNCAUGHT EXCEPTION:", e));

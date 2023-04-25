import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import notesRouter from "./routers/notesRouter.js";
import userRouter from "./routers/userRouter.js";

const app = express();
// var corsOptions = {
//   origin: true,
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(cors());
app.use(express.json());
app.use(cookieParser());
dotenv.config({ path: "./config.env" });

// SetUp DataBase

const db = process.env.DATABASE;
const main = async () => {
  const con = await mongoose.connect(db);
  console.log("scc connect to db");
};
main().catch((err) => console.log(err));

app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/user", userRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

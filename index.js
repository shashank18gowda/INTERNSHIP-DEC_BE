import express from "express";
const app = express();

import dotenv from "dotenv";
import { connectDB } from "./src/helper/dbConnection.js";
import routes from "./router.js";
// import path from "path";
dotenv.config();
// const __dirname = path.resolve();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "public")));
connectDB();

routes(app);

app.listen(PORT, () => {
  console.log("server listing on PORT:", PORT);
});

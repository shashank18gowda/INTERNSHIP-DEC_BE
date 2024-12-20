import express from "express";
const app = express();

import dotenv from "dotenv";
import { connectDB } from "./src/helper/dbConnection.js";
import routes from "./router.js";
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

routes(app);

app.listen(PORT, () => {
  console.log("server listing on PORT:", PORT);
});

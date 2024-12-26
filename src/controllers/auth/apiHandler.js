import { Router } from "express";
const router = Router();
import register from "./register.js";

router.use("/register", register);

export default router;

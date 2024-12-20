import { Router } from "express";
const router = Router();
import addStudent from "./addStudent.js";
import listStudent from "./listStudent.js";


router.use("/add", addStudent);
router.use("/list", listStudent);


export default router;

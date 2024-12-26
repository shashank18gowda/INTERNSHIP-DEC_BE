import { Router } from "express";
const router = Router();

import studentAPiHandler from "./src/controllers/manageStudents/apiHandler.js";
// import std from "./src/controllers/manageStudents/addStudent.js";
import teacherApiHandler from "./src/controllers/auth/apiHandler.js"


const routes = (app) => {
  app.use("/api/student", studentAPiHandler);
  app.use("/api/auth", teacherApiHandler);


  //   app.use("api/student/add", std);
};

export default routes;

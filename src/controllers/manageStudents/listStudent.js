import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import { authenticate } from "../../middlewares/authenticate.js";

router.get("/", authenticate, async (req, res) => {
  try {
    let student_id = req.query.id;
    let rollno = req.query.rollno;
    let query = {};
    let teacher_id = req.user.id;
    // query.teacher_id = teacher_id; // req.user.id
    query.$expr = { $eq: ["$teacher_id", { $toObjectId: teacher_id }] };

    query.isactive = STATE.ACTIVE;
    rollno != undefined ? (query.rollno = rollno) : "";

    student_id != undefined
      ? (query.$expr = { $eq: ["$_id", { $toObjectId: student_id }] })
      : "";

    console.log(query);

    let studentData = await studentModel.aggregate([
      {
        $match: query,
      },
      // {
      //   $match: { $expr: { $eq: ["$_id", { $toObjectId: student_id }] } },
      // },
      {
        $project: {
          isactive: 0,
          __v: 0,
        },
      },
    ]);

    // console.log(studentData);

    if (studentData.length === 0) {
      return send(res, setErrorRes(RESPONSE.NOT_FOUND, "Student data"));
    }

    return send(res, RESPONSE.SUCCESS, studentData);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;

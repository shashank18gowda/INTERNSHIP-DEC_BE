import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
  try {
    let student_id = req.query.student_id;

    let { name, email, rollno } = req.body;
    let updates = {};

    if (!student_id || student_id == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "student_id"));
    }

    let studentData = await studentModel.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: student_id }] },
          isactive: STATE.ACTIVE,
        },
      },
    ]);

    if (studentData.length === 0) {
      return send(res, setErrorRes(RESPONSE.NOT_FOUND, "Student data"));
    }

    if (name && name != undefined) {
      updates.name = name;
    }
    if (rollno && rollno != undefined) {
      let isExist = await studentModel.aggregate([
        {
          $match: {
            rollno: rollno,
            isactive: STATE.ACTIVE,
          },
        },
      ]);

      if (isExist.length > 0) {
        return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS, "rollno"));
      }
      updates.rollno = rollno;
    }

    if (email && email != undefined) {
      let isEmail = validator.isEmail(email);

      if (!isEmail) {
        return send(res, setErrorRes(RESPONSE.INVALID, "email"));
      }
      updates.email = email;
    }

    await studentModel.updateMany(
      {
        _id: student_id,
      },
      {
        $set: updates,
      }
    );

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;

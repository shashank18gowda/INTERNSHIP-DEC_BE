import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.post("/", async (req, res) => {
  try {
    const { name, rollno, email } = req.body;
    if (!name || name == undefined) {
      // const response = RESPONSE.REQUIRED;
      // res.json({
      //   code: response.code,
      //   message: "name" + response.message,
      // });

      return send(res, setErrorRes(RESPONSE.REQUIRED, "name"));
    }

    if (!rollno || rollno == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "rollno"));
    }

    if (!email || email == undefined) {
      // const response = RESPONSE.REQUIRED;
      // res.json({
      //   code: response.code,
      //   message: "email" + response.message,
      // });

      return send(res, setErrorRes(RESPONSE.REQUIRED, "email"));
    }

    // let isExist = await studentModel.find({
    //   rollno: rollno,
    // });

    let isEmail = validator.isEmail(email);

    if (!isEmail) {
      return send(res, setErrorRes(RESPONSE.INVALID, "email"));
    }

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

    // console.log(isExist.length);

    studentModel.create({
      name: name,
      rollno: rollno,
      email: email,
    });

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;

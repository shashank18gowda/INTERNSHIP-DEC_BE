import { Router } from "express";
const router = Router();
import teacherModel from "../../models/teacherModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import validator from "validator";
import bcrypt from "bcrypt";

router.post("/", async (req, res) => {
  try {
    const { teacher_name, phone, email, password } = req.body;

    if (!teacher_name || teacher_name == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "teacher_name"));
    }

    if (!phone || phone == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "phone"));
    }

    if (!email || email == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "email"));
    }

    if (!password || password == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "password"));
    }
    let isEmail = validator.isEmail(email);

    if (!isEmail) {
      return send(res, setErrorRes(RESPONSE.INVALID, "email"));
    }

    let isExist = await teacherModel.aggregate([
      {
        $match: {
          phone: phone,
          isactive: STATE.ACTIVE,
        },
      },
    ]);

    if (isExist.length > 0) {
      return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS, "phone"));
    }

    let isValidPhone = phone.toString().match(/^\+91\d{10}$/);

    if (!isValidPhone) {
      return send(res, setErrorRes(RESPONSE.INVALID, "Phone"));
    }

    let isValidPassword = password
      .toString()
      .match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      );

    if (!isValidPassword) {
      return send(res, setErrorRes(RESPONSE.INVALID, "Password pattern"));
    }

    let encryptedPass = await bcrypt.hash(
      password,
      Number(process.env.SALTROUND)
    );

    teacherModel.create(
      {
        teacher_name: teacher_name,
        phone: phone,
        email: email,
        password: encryptedPass,
        role: ROLE.TEACHER,
      }
      // req.body
    );

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log(error);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;

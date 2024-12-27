import { Router } from "express";
const router = Router();
import teacherModel from "../../models/teacherModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || username == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "username"));
    }

    if (!password || password == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "password"));
    }

    let userData = await teacherModel.findOne({
      isactive: STATE.ACTIVE,
      // phone: username,
      // email: username,
      $or: [{ phone: username }, { email: username }],
    });

    if (userData && (await bcrypt.compare(password, userData.password))) {
      let token = jwt.sign(
        {
          id: userData._id,
          teacher_name: userData.teacher_name,
          phone: userData.phone,
          email: userData.email,
        },
        process.env.SECRETKEY
      );

      return send(res, RESPONSE.SUCCESS, token);
    } else {
      return send(res, setErrorRes(RESPONSE.INVALID, "Login Creadential"));
    }
  } catch (error) {
    console.log(error);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;

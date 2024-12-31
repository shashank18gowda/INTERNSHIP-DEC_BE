import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import validator from "validator";
import { authenticate } from "../../middlewares/authenticate.js";
//
import image from "../../middlewares/uploads.js";
import multer from "multer";
const upload = image.array("image");

router.post("/", authenticate, async (req, res) => {
  try {
    // if (req.user.role != ROLE.TEACHER) {
    //   return send(res, RESPONSE.UNAUTHORIZED);
    // } //for role based access

    upload(req, res, async (err) => {
      if (!req.files || req.files.length < 1) {
        return send(res, setErrorRes(RESPONSE.REQUIRED, "image"));
      }

      if (err instanceof multer.MulterError) {
        console.log(err);

        return send(res, RESPONSE.MULTER_ERR);
      } else if (err) {
        console.log("Inside Multer:", err);
        return send(res, RESPONSE.UNKNOWN_ERR);
      }

      let fileName = [];
      if (req.files != null) {
        req.files.forEach((ele) => {
          fileName.push(ele.filename);
        });
      }
    

      const { name, rollno, email } = req.body;
      let teacher_id = req.user.id;

      if (!name || name == undefined) {
        return send(res, setErrorRes(RESPONSE.REQUIRED, "name"));
      }

      if (!rollno || rollno == undefined) {
        return send(res, setErrorRes(RESPONSE.REQUIRED, "rollno"));
      }

      if (!email || email == undefined) {
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
      // console.log(fileName);

      studentModel.create({
        name: name,
        rollno: rollno,
        email: email,
        teacher_id: teacher_id,
        image: fileName,
      });

      return send(res, RESPONSE.SUCCESS);

      // Everything went fine.
    });
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;

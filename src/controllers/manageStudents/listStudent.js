import { Router } from "express";
const router = Router();
import studentModel from "../../models/studentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";

router.get("/", async (req, res) => {
  try {
    let studentData = await studentModel.aggregate([
      {
        $match: {
          isactive: STATE.ACTIVE,
        },
      },
      {
        $project: {
          isactive: 0,
          __v: 0,
        },
      },
    ]);

    return send(res, RESPONSE.SUCCESS, studentData);
  } catch (error) {
    console.log(error.message);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;

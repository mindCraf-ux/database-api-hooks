import {Router} from"express";
import {registerUser} from"../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";

const router= Router()

router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1 //number of files to be uploaded /allowed
  },
  {
    name: "coverImage",
    maxCount: 2
  }

]),
 registerUser);


export default router;
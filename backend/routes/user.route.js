import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

import { upload } from "../middlewares/multer.js";
 
const router = express.Router();

router.route("/register").post(upload.single('photo'), register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, upload.any(),updateProfile);

export default router;

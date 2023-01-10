import express, {Router} from "express";
import {login} from "../controllers/login.controller";
import {uploadFile} from "../controllers/upload.controller";
import {downloadFile} from "../controllers/download.controller";
import {authenticated} from "../middlewares/authenticated.middleware";


const router: Router = express.Router();


router.post("/login", login);
router.post("/upload", authenticated, uploadFile);
router.get("/download",authenticated, downloadFile);

export default router;
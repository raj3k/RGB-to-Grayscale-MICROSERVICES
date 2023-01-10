import express, {Router} from "express";
import {login, validateToken} from "../controllers/authController";

const router: Router = express.Router();

router.post("/login", login);
router.get("/validate", validateToken);

export default router;
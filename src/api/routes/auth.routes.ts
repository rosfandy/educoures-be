console.log("📦 Loading auth.routes.ts");

import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.get("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.post("/register", authController.register);

console.log("✅ auth.routes.ts loaded & routes registered");

export default router;

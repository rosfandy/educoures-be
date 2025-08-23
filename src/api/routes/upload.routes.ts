console.log("📦 Loading upload.routes.ts");

import { Router } from "express";
import * as uploadController from "../controllers/upload.controller";

const router = Router();

router.get("/", uploadController.imageUpload);

console.log("✅ upload.routes.ts loaded & routes registered");

export default router;

console.log("📦 Loading course.routes.ts");

import { Router } from "express";
import * as courseController from "../controllers/course.controller";

const router = Router();

router.get("/", courseController.getAll);
router.get("/:id", courseController.getById);
router.post("/", courseController.create);
router.put("/:id", courseController.update);
router.delete("/:id", courseController.destroy);

console.log("✅ course.routes.ts loaded & routes registered");

export default router;

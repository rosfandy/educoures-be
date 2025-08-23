import { Router } from "express";
import courseRoutes from "./course.routes";
import uploadRoutes from "./upload.routes";
import authRoutes from "./auth.routes";
import * as authMiddleware from "../middleware/auth.middleware";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/courses", authMiddleware.verifyToken, courseRoutes);
routes.use("/upload", authMiddleware.verifyToken, uploadRoutes);

export default routes;

import { Router } from "express";
import courseRoutes from "./course.routes";

const routes = Router();

routes.use("/course", courseRoutes);

export default routes;

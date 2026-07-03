import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ghostArchiveRouter from "./ghost-archive";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ghostArchiveRouter);

export default router;

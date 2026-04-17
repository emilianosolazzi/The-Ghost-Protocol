import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ghostArchiveRouter from "./ghost-archive";
import ghostRouter from "./ghost";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ghostArchiveRouter);
router.use(ghostRouter);

export default router;

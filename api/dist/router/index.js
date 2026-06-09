import { Router } from "express";
import userRouter from "./user.js";
const v1Router = Router();
const routes = [
    {
        path: "/users", router: userRouter
    }
];
routes.forEach(({ path, router }) => v1Router.use(path, router));
export default v1Router;
//# sourceMappingURL=index.js.map
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

const Index = lazy(() => import("../pages/Index"));
const Clock = lazy(() => import("../pages/000/Clock"));

const routes: RouteObject[] = [
  {
    id: "Index",
    path: "/",
    element: <Index />,
  },
  {
    id: "Clock",
    path: "/000",
    element: <Clock />,
  },
];
const router = createBrowserRouter(routes);

export default router;
export { routes };

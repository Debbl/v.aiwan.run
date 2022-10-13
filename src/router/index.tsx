import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

const App = lazy(() => import("../App"));
const Clock = lazy(() => import("../pages/000/Clock"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/000",
    element: <Clock />,
  },
];
const router = createBrowserRouter(routes);

export default router;

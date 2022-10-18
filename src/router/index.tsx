import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

const Index = lazy(() => import("~/pages/Index"));
const Clock = lazy(() => import("~/pages/000/Clock"));
const SolarSystem = lazy(() => import("~/pages/001/SolarSystem"));
const MouseFollowing = lazy(() => import("~/pages/002/MouseFollowing"));

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
  {
    id: "Solar System",
    path: "/001",
    element: <SolarSystem />,
  },
  {
    id: "Mouse Following",
    path: "/002",
    element: <MouseFollowing />,
  },
];
const router = createBrowserRouter(routes);

export default router;
export { routes };

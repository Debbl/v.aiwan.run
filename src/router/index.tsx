import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";

const Index = lazy(() => import("~/pages/Index"));
const Clock = lazy(() => import("~/pages/000/Clock"));
const SolarSystem = lazy(() => import("~/pages/001/SolarSystem"));
const MouseFollowing = lazy(() => import("~/pages/002/MouseFollowing"));
const Triangle = lazy(() => import("~/pages/003/Triangle"));
const WaterSky = lazy(() => import("~/pages/004/WaterSky"));

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
  {
    id: "Triangle",
    path: "/003",
    element: <Triangle />,
  },
  {
    id: "Water Sky",
    path: "/004",
    element: <WaterSky />,
  },
];
const router = createBrowserRouter(routes);

export default router;
export { routes };

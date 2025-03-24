//import pages
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Customers from "../pages/Customers";
import RFM from "../pages/MicroSegmentation/RFM";
import Lifecycle from "../pages/MicroSegmentation/Lifecycle";
import Settings from "../pages/Settings";
import Sync from "../pages/Sync";
import Segmentation from "../pages/Segmentation";
import DataModeling from "../pages/DataModeling";
import MicroSegmentation from "@/pages/MicroSegmentation";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";

const publicRoutes = [
    { path: "/", component: Login},
    { path: "/register", component: Register}
]

const privateRoutes = [
    { path: "/", component: Index},
    { path: "/customers", component: Customers},
    { path: "/micro-segmentation", component: MicroSegmentation},
    { path: "/sync", component: Sync},
    { path: "/settings", component: Settings},
    { path: "/segmentation", component: Segmentation},
    { path: "/data-modeling", component:  DataModeling},
    { path: "*", component: NotFound}
]

const microSegmentRoutes = [
    {path: "rfm", component: RFM},
    {path: "lifecycle", component: Lifecycle},
]

export { privateRoutes, microSegmentRoutes, publicRoutes }
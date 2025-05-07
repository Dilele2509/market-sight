//import pages
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import RFM from "../pages/MicroSegmentation/RFM";
import Lifecycle from "../pages/MicroSegmentation/Lifecycle";
import ImportData from "../pages/Sync";
import UserCreate from "../pages/CreateSegmentation/UserCreate";
import AiCreate from "../pages/CreateSegmentation/AiCreate";
import DataModeling from "../pages/DataModeling";
import MicroSegmentation from "@/pages/MicroSegmentation";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import CreateSegmentation from "@/pages/CreateSegmentation";

const publicRoutes = [
    { path: "/", component: Login},
    { path: "/register", component: Register}
]

const privateRoutes = [
    { path: "/", component: Index},
    { path: "/micro-segmentation", component: MicroSegmentation},
    { path: "/create-segmentation", component: CreateSegmentation},
    { path: "/connect-data", component: ImportData},
    { path: "/data-modeling", component:  DataModeling},
    { path: "*", component: NotFound}
]

const CreateSegmentationRoutes = [
    { path: "user-create", component: UserCreate},
    { path: "ai-create", component: AiCreate},
]

const microSegmentRoutes = [
    {path: "rfm", component: RFM},
    {path: "lifecycle", component: Lifecycle},
]

export { privateRoutes, microSegmentRoutes, CreateSegmentationRoutes, publicRoutes }
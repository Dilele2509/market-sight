//import pages
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Customers from "../pages/Customers";
import RFM from "../pages/RFM";
import Lifecycle from "../pages/Lifecycle";
import Settings from "../pages/Settings";
import Sync from "../pages/Sync";
import Segmentation from "../pages/Segmentation";
import DataModeling from "../pages/DataModeling";

const privateRoutes = [
    { path: "/", component: Index},
    { path: "/customers", component: Customers},
    { path: "/rfm", component: RFM},
    { path: "/lifecycle", component: Lifecycle},
    { path: "/sync", component: Sync},
    { path: "/settings", component: Settings},
    { path: "/segmentation", component: Segmentation},
    { path: "/data-modeling", component:  DataModeling},
    { path: "*", component: NotFound}
]

const microSegmentRoutes = [

]

export { privateRoutes, microSegmentRoutes }
import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { privateRoutes, publicRoutes, microSegmentRoutes, CreateSegmentationRoutes } from "../../routes";
import MicroSegmentation from "../../pages/MicroSegmentation";
import CreateSegmentation from "@/pages/CreateSegmentation";

const ProtectedRoutes = () => {
  const { token, users } = useContext(AuthContext);

  return (
    <Routes>
      {token && users !== null
        ? privateRoutes.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })
        : publicRoutes.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}

      {/* Nếu đã đăng nhập, thiết lập route cho MicroSegmentation */}
      {token && users !== null && (
        <>
          <Route path="/micro-segmentation" element={<MicroSegmentation />}>
            <Route index element={<Navigate to="rfm" replace />} />
            {microSegmentRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}

          </Route>
          <Route path="/create-segmentation" element={<CreateSegmentation />}>
            <Route index element={<Navigate to="user-create" replace />} />
            {CreateSegmentationRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Route>
        </>
      )}

      {/* Chuyển hướng về trang chủ nếu đường dẫn không hợp lệ */}
      <Route path="*" element={<Navigate to={token ? "/" : "/"} replace />} />
    </Routes>
  );
};

export default ProtectedRoutes;

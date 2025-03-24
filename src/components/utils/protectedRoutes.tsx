import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import { privateRoutes, publicRoutes, microSegmentRoutes } from "../../routes";
import MicroSegmentation from "../../pages/MicroSegmentation";

const ProtectedRoutes = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      {token
        ? privateRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })
        : publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}

      {/* Nếu đã đăng nhập, thiết lập route cho MicroSegmentation */}
      {token && (
        <Route path="/micro-segmentation" element={<MicroSegmentation />}>
          <Route index element={<Navigate to="rfm" replace />} />
          {microSegmentRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Route>
      )}

      {/* Chuyển hướng về trang chủ nếu đường dẫn không hợp lệ */}
      <Route path="*" element={<Navigate to={token ? "/" : "/"} replace />} />
    </Routes>
  );
};

export default ProtectedRoutes;

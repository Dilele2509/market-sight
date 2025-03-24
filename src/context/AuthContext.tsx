import { axiosAuth, axiosPrivate } from "@/API/axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     fetchUserProfile();
  //   }
  // }, [token]);

  // const fetchUserProfile = async () => {
  //   try {
  //     console.log('token: ', token);
  //     const res = await axiosPrivate.get("/user-profile", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (res.status === 200) {
  //       setUser(res.data);
  //     } else {
  //       logout();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //     logout();
  //   }
  // };

  const login = async (email: string, password: string) => {
    try {
      //console.log("Submitting login with:", email, password);
      await axiosAuth.post("/login", { email: email, password_hash: password })
        .then(response => {
          //console.log("Response Data:", response.data); // Kiểm tra response.data
          localStorage.setItem("token", response.data.accessToken);
          //console.log('response token:', response.data.accessToken);
          setToken(response.data.accessToken);
          //fetchUserProfile();
          navigate("/");
        })
        .catch(error => {
          console.error("Error logging in:", error);
          if (error.response) {
            console.error("Server Response:", error.response); // Log chi tiết lỗi từ server
          }
        }); 

    } catch (error) {
      console.error("Login error:", error);
      alert("Fail to login");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/"); // Quay về trang login
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

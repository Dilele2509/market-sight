import { axiosAuth, axiosPrivate } from "@/API/axios";
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSegmentToggle } from "./SegmentToggleContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { setLogged, logged } = useSegmentToggle();
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || null));
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

  // Tải lại user từ localStorage nếu có
  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        setUser(storedUser);
      } else {
        fetchUserProfile();
      }
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await axiosPrivate.get("/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setLogged(!logged)
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      //console.log("Submitting login with:", email, password);
      await axiosAuth.post("/login", { email: email, password_hash: password })
        .then(async (response) => {
          if (response.data.accessToken) {
            localStorage.setItem("token", response.data.accessToken);

            try {
              const userProfile = await axiosPrivate.get("/user-profile", {
                headers: { Authorization: `Bearer ${response.data.accessToken}` }
              });

              if (userProfile.data.status === 200) {
                //console.log("User Profile:", userProfile.data.data);
                setUser(userProfile.data.data);
                localStorage.setItem("user", JSON.stringify(userProfile.data.data));
              } else {
                console.error('can not get user profile')
              }

              setToken(response.data.accessToken);
              navigate("/");
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          }
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
    setLogged(false);
    localStorage.clear();
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

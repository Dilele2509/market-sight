import { axiosAuth } from "@/API/axios"
import { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowing, setIsShowing] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenVerify = searchParams.get("token");
    if (tokenVerify) {
      console.log("Token:", tokenVerify);
      axiosAuth.post(`/verify-email?token=${tokenVerify}`)
        .then((res) => {
          console.log(res.data);
          toast.success('This account was verified')
        })
        .catch((err) => {
          console.error("Error verifying email", err.response?.data);
        });
    } else {
      console.log("Token not found");
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    login(email, password);
  };


  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 bg-login">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-primary">Chào mừng trở lại</CardTitle>
              <CardDescription>Đăng nhập bằng tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  {/* <div className="flex flex-col gap-4">
                    <Button variant="outline" className="w-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Đăng nhập bằng Google
                    </Button>
                  </div> */}
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">Tiến hành đăng nhập với</span>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                          Quên mật khẩu?
                        </a>
                      </div>
                      <Input id="password" type={isShowing ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} required />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" onClick={() => { setIsShowing(!isShowing) }} />
                        <label
                          htmlFor="terms"
                          className="text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Hiển thị mật khẩu
                        </label>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Đăng nhập
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Bạn chưa có tài khoản?{" "}
                    <Link to={'/register'} className="underline underline-offset-4">
                      Đăng ký
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            Bằng cách nhấp vào tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a> của chúng tôi.
          </div>
        </div >
      </div>
    </div>
  )
}
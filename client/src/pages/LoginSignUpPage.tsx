import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "preact/hooks";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Navigate } from "react-router-dom";

const LoginSignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { signup, isSigningUp, isLoggingIn, login, authUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };
  const validateForm = () => {
    if (!name?.trim()) return toast.error("Full name is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    if (!password) return toast.error("Password is required");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup({ name, email, password });
  };
  const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };
  if (authUser) return <Navigate to="/" />;
  return (
    <div className="h-screen flex justify-center items-center fixed top-1/2 left-1/2 w-[50vw] -translate-x-1/2 -translate-y-1/2 ">
      <Tabs defaultValue="login" className="w-[400px] ">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">SignUp</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login To Your Account</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      setEmail((e.target as HTMLInputElement).value || "")
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative w-full">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        setPassword((e.target as HTMLInputElement).value || "")
                      }
                      className="pr-10" // Add padding to the right to prevent text overlap with the icon
                    />
                    <Button
                      variant="ghost"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={handleShowPassword}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      } // Accessibility label
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader />
                      Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>SignUp</CardTitle>
              <CardDescription>Create An Account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                      setName((e.target as HTMLInputElement).value || "")
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      setEmail((e.target as HTMLInputElement).value || "")
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative w-full">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        setPassword((e.target as HTMLInputElement).value || "")
                      }
                      className="pr-10" // Add padding to the right to prevent text overlap with the icon
                    />
                    <Button
                      variant="ghost"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={handleShowPassword}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      } // Accessibility label
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <>
                      <Loader />
                      Loading...
                    </>
                  ) : (
                    "SignUp"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginSignUpPage;

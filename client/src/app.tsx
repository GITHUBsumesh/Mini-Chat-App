import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./Layout/MainLayout.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginSignUpPage from "./pages/LoginSignUpPage.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore.tsx";
import { useEffect } from "preact/hooks";
import { Loader } from "lucide-react";
import ProfilePage from "./pages/ProfilePage.tsx";
const app = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  // console.log(onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log("authUser :", authUser);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-800">
        <Loader className="size-10 animate-spin" />
      </div>
    );
    
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/auth" element={<LoginSignUpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default app;

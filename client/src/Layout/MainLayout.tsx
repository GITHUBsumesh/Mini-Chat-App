import Navbar from "@/components/Navbar.tsx";
import { AppSidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden bg-zinc-900">
        {/* Navbar at the top */}

        <Navbar />

        {/* 
        <div className="overflow-x-hidden min-h-screen">
          
          <AppSidebar />

          
        </div> */}
        {/* Main Content */}
        <main className="flex overflow-hidden">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default MainLayout;

import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { NavbarIcon } from "./features";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/");
  };
  const profileHandler=()=>{
    navigate("/profile")
  }
  const { logout, authUser } = useAuthStore();
  return (
    <div className="w-screen h-16 flex items-center justify-between p-2 bg-zinc-950">
      <div className="flex justify-start text-2xl ">
        <button>
          <div
            className="flex flex-row items-center px-3"
            onClick={() => handleHome()}
          >
            <MessageSquare />
            <h1 className="text-4xl font-bold ml-2 ">Mini Chat </h1>
          </div>
        </button>
      </div>
      {authUser && (
        <div className="flex justify-end items-center gap-5">
          <NavbarIcon
            Icon={<Settings strokeWidth={3} size={5} />}
            Content="Settings"
            EventHandler={() => console.log("Settings")}
          />
          <NavbarIcon
            Icon={<User strokeWidth={3} size={5} />}
            Content="Profile"
            EventHandler={()=>profileHandler()}
          />
          <NavbarIcon
            Icon={<LogOut strokeWidth={3} size={5} />}
            Content="Logout"
            EventHandler={logout}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;


import { ResizableDemo } from "@/components/resizable";
import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const {authUser} = useAuthStore();

  if(!authUser) return <Navigate to="/auth" />;
  return (
    <div className="h-screen flex justify-center items-center relative top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 overflow-hidden">
      <div className="flex items-center justify-center">
        <div className="bg-base-100 rounded-lg shadow-cl">
          <div className="flex h-full rounded-lg overflow-hidden">
            <ResizableDemo/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import { axiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { io } from "socket.io-client";
import { UserType } from "@/constants/models";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";
export interface AuthState {
  authUser: UserType | null; // Define a 'User' type/interface to match the structure of your auth user object.
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: UserType[]; // Assuming 'onlineUsers' is an array of 'User'.
  socket: any; // Add the socket property to the AuthState interface.
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  profilePic: string;
}

// export interface User {
//   _id: string; // Replace with the actual structure of the user object.
//   name: string;
//   email: string;
//   profilePic: string | undefined;
//   createdAt: string;
// }
export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      // console.log(res.data.user);
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data: { name: string; email: string; password: string }) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },
  login: async (data: { email: string; password: string }) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error: any) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },
  updateProfile: async (data: { profilePic: string }) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/profile/update", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      transports: ["websocket"],
    });

    socket.connect();

    socket.on("connect", () => {
      // console.log("Socket.IO connection established");
    });

    // Update onlineUsers with full user data
    socket.on("getOnlineUsers", (users) => {
      // console.log("Online users:", users); // Debugging
      set({ onlineUsers: users }); // Now stores full user objects
    });

    set({ socket: socket });
  },
  // connectSocket: () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.connected) return;

  //   const socket = io(BASE_URL, {
  //     query: {
  //       userId: authUser._id,
  //     },
  //     transports: ["websocket"],
  //   });
  //   socket.connect();

  //   socket.on("connect", () => {
  //     console.log("Socket.IO connection established");
  //   });

  //   set({ socket: socket });
  //   // console.log(authUser._id);

  //   socket.on("getOnlineUsers", (users) => {
  //     set({ onlineUsers: users });
  //   });
  // },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));

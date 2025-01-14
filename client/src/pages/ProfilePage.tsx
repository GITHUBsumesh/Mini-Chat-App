import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuthStore } from "@/store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import { useState } from "preact/hooks";
import { Navigate } from "react-router-dom";
import moment from "moment";
const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      if (typeof base64Image === "string") {
        await updateProfile({ profilePic: base64Image });
      }
    };
  };
  if (!authUser) return <Navigate to="/auth" />;
  return (
    <div className="h-[40rem] flex justify-center items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem]">
      <Card className="w-[30rem] h-[37rem]">
        <CardHeader className="text-center">
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your Profile Information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center  gap-1">
          <div className="profile_picture flex flex-col justify-center items-center gap-2">
            <Avatar className="w-48 h-48  border-[0.25rem] border-white">
              <AvatarImage
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
              />
              <AvatarFallback>{authUser.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute translate-x-[4rem] translate-y-[4rem]">
              <Label
                className="bg-yellow-300 rounded-full w-8 h-8 flex items-center justify-center"
              >
                <Camera className="text-black" />
                <Input type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                >
                </Input>
              </Label>
            </div>
            <h2 className="text-sm text-muted-foreground">
            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </h2>
          </div>
          <div className="profile_details flex flex-col gap-2">
            <div className="space-y-1">
              <Label htmlFor="name">
                <div className="flex flex-row items-center gap-1 pl-0.5">
                  <User size={20} /> Name
                </div>
              </Label>
              <Input
                id="name"
                placeholder="Name"
                value={authUser?.name}
                disabled
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">
                <div className="flex flex-row items-center gap-1 pl-1">
                  <Mail size={18} /> Email
                </div>
              </Label>
              <Input
                id="email"
                placeholder="Email"
                value={authUser?.email}
                disabled
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-1 text-muted-foreground">
          <div className="Account_Information flex flex-col gap-1 w-full px-3">
            <h1 className="text-start ">Account Information</h1>
            <div className="flex flex-row justify-between border-b-2 border-zinc-700 py-2 text-sm">
              <span>Member Since</span>
              <span>{moment(authUser?.createdAt).fromNow()}
              </span>
            </div>
            <div className="flex flex-row justify-between text-sm">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;

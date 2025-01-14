import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";

const MessageHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="bg-base-300">
      <div className="flex flex-row items-center justify-between w-full min-h-[55px]">
        <Avatar className="ml-2 mr-3">
          <AvatarImage src={selectedUser?.profilePic} alt={selectedUser?.name}/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 items-start">
          <div className="name overflow-hidden text-ellipsis whitespace-pre-wrap line-clamp-1">
            {selectedUser?.name}
          </div>
          <div className="onlineStatus text-sm text-gray-500">{selectedUser && onlineUsers.map(user => user._id).includes(selectedUser._id) ? "Online" : "Offline"}</div>
        </div>
        <Button variant="ghost" className="mr-1" onClick={() => setSelectedUser(null)}>
          <X />
        </Button>
      </div>
    </div>
  );
};

export default MessageHeader;

import { Dot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { MessageType, UserType } from "@/constants/models";
import { formatMessageTime } from "@/lib/utils";


interface SidebarUsersProps {
  user: UserType;
  onlineUsers: UserType[];
  setSelectedUser: (user: UserType) => void;
  lastMessage: MessageType | undefined;
}

const SidebarUsers: React.FC<SidebarUsersProps> = ({
  user,
  onlineUsers,
  setSelectedUser,
  lastMessage
}) => {

  return (
    <div className="" onClick={() => setSelectedUser(user)}>
      <Card className="w-full bg-base-300 hover:bg-base-100  border-none">
        <div className="flex flex-row my-1 mx-2 max-h-[55px] min-h-[55px] items-center ">
          <div className="flex flex-row justify-center items-center">
            <Avatar className="ml-2 mr-3 ">
              <AvatarImage src={user.profilePic} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            {onlineUsers.some((onlineUser) => onlineUser._id === user._id) && (
              <div className="onlineStatus absolute translate-x-3 translate-y-[1rem] ">
                <Dot size={50} className="text-green-500" />
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 items-start">
  <div className="name overflow-hidden text-ellipsis whitespace-pre-wrap line-clamp-1">
    {user.name}
  </div>
  <div
    className="last-message text-sm text-gray-600 overflow-hidden text-ellipsis whitespace-pre-wrap line-clamp-1"
    style={{ minHeight: "1.25rem" }} // Ensure consistent height
  >
    {lastMessage?.text || <span className="invisible">Placeholder</span>}
  </div>
</div>

          <div className="flex flex-col flex-shrink-0 items-end ml-2">
            <div className="last seen text-sm text-gray-500 ">
              {lastMessage?.createdAt ? formatMessageTime(new Date(lastMessage.createdAt)) : ""}
            </div>
            <div className="unread msg bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-2 flex justify-center">
              <span className="">1</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SidebarUsers;

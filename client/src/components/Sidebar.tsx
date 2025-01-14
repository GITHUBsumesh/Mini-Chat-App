import { useChatStore } from "@/store/useChatStore";
import SidebarUsers from "./SidebarUsers";
import { ScrollArea } from "./ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "preact/hooks";

const Sidebar = () => {
  const {
    getUsers,
    users = [],
    setSelectedUser,
    isUsersLoading,
    messagesByUser,
    getMessages,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    users.forEach((user) => {
      getMessages(user._id); // Fetch messages for each user
    });
  }, [users, getMessages]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.map((u) => u._id).includes(user._id))
    : users;

  const getLastMessage = (userId: string) => {
    const userMessages = messagesByUser[userId] || [];
    return userMessages[userMessages.length - 1];
  };

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <h1 className="text-3xl">Chats</h1>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showOnlineOnly}
          onChange={(e) =>
            setShowOnlineOnly((e.target as HTMLInputElement).checked)
          }
          className="checkbox checkbox-sm"
        />
        <label
          htmlFor="onlineUsers"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <h2>
            <span>Online Only </span>
            <span className="text-gray-500 text-nowrap">
              ({onlineUsers.length - 1} online)
            </span>
          </h2>
        </label>
      </div>
      <ScrollArea className="rounded-md h-screen">
        <div className="flex flex-col mr-2 gap-2 mb-1">
          {filteredUsers.map((user) => (
            <SidebarUsers
              setSelectedUser={setSelectedUser}
              user={user}
              key={user._id}
              onlineUsers={onlineUsers}
              lastMessage={getLastMessage(user._id)}
            />
          ))}
        </div>
      </ScrollArea>
      {filteredUsers.length === 0 && (
        <div className="text-center text-zinc-500 py-4">No online users</div>
      )}
    </div>
  );
};

export default Sidebar;

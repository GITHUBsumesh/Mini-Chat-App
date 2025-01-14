import { MessageType, UserType } from "@/constants/models";
import { formatMessageTime, useMessageVisibility } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { Check, CheckCheck, Clock } from "lucide-react";

interface MainMessageProps {
  message: MessageType;
  authUser: UserType;
  selectedUser: UserType;
  messageEndRef: React.RefObject<HTMLDivElement>;
  messageRef: React.RefObject<HTMLDivElement>;
}

const MainMessage: React.FC<MainMessageProps> = ({
  message,
  authUser,
  selectedUser,
  messageEndRef,
  messageRef,
}) => {
  // const { markMessageAsSeen } = useChatStore();

  // Function to handle visibility of message
  // const handleVisibility = (messageId: string) => {
  //   markMessageAsSeen(selectedUser._id, [messageId]);
  // };

  // Use the custom hook to track visibility
  // const messageRef = useMessageVisibility(message._id, handleVisibility) as React.RefObject<HTMLDivElement>;

  return (
    <div
      className={`chat ${
        message.senderId === authUser._id ? "chat-end" : "chat-start"
      }`}
      ref={messageRef}
       // Attach the ref here for visibility detection
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="User profile"
            src={
              message.senderId === authUser._id
                ? authUser.profilePic || "/avatar.png"
                : selectedUser.profilePic || "/avatar.png"
            }
          />
        </div>
      </div>
      <div className="chat-header">
        <time className="text-xs opacity-50">
          {formatMessageTime(new Date(message.createdAt))}
        </time>
      </div>
      <div className="chat-bubble">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2"
          />
        )}
        {message.text && <p>{message.text}</p>}
      </div>
      <div className="chat-footer opacity-50" >
      { `${message.senderId === authUser._id ? message.status : ""}`}

        {/* {message.senderId === authUser._id && message.status === "seen" ? (
          <CheckCheck size={16} className="text-cyan-500" />
        ) : message.status === "delivered" ? (
          <CheckCheck size={16} />
        ) : message.status === "sent" ? (
          <Check size={16} />
        ) : message.status === "sending" ? (
          <Clock size={16} className="" />
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
};

export default MainMessage;

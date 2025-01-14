import { useEffect, useRef } from "preact/hooks";
import MainMessage from "./MainMessage";
import MessageHeader from "./MessageHeader";
import MessageInput from "./MessageInput";
import { ScrollArea } from "./ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMessageVisibility } from "@/lib/utils"; // Import the updated hook

const ChatContainer = () => {
  const {
    getMessages,
    isMessagesLoading,
    selectedUser,
    messagesByUser,
    setMessageStatus,
    subscribeToMessages,
    unsubscribeFromMessages,
    markMessageAsSeen, // Add markMessageAsSeen function from the store
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const socket = useAuthStore.getState().socket; // Assuming socket is available in auth store

  useEffect(() => {
    // Listen for the socket event to update the message status
    const handleMessageStatusUpdate = ({ messageId, status }: { messageId: string; status: string }) => {
      // Update the status of the message in the state
      setMessageStatus(messageId, status);
    };

    socket.on("messageStatusUpdated", handleMessageStatusUpdate);

    return () => {
      socket.off("messageStatusUpdated", handleMessageStatusUpdate); // Proper cleanup
    };
  }, [socket, setMessageStatus]);

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messagesByUser, selectedUser?._id]);

  // Fetch messages and set up subscriptions when selectedUser changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // Get messages for the currently selected user
  const messages = selectedUser ? messagesByUser[selectedUser._id] || [] : [];

  // Handle visibility of the message to mark it as seen
  const handleVisibility = (messageId: string) => {
    if (selectedUser) {
      markMessageAsSeen(selectedUser._id, [messageId]); // Mark the message as seen when it becomes visible
    }
  };

  return (
    <div className="flex flex-col gap-0 h-full w-full">
      {/* Header Section */}
      <div className="flex-shrink-0">
        <MessageHeader />
      </div>

      {/* Main Message Section */}
      <ScrollArea className="flex-1 overflow-y-auto rounded-md">
        <div className="flex flex-col gap-0 px-2 min-h-[77vh] justify-end">
          {authUser &&
            selectedUser &&
            messages.map((message: any) => {
              // Use the useMessageVisibility hook to handle message visibility
              const messageRef = useMessageVisibility(message._id, handleVisibility);

              return (
                <MainMessage
                  message={message}
                  key={message._id}
                  authUser={authUser}
                  selectedUser={selectedUser}
                  messageEndRef={messageEndRef}
                  messageRef={messageRef} // Pass the messageRef to MainMessage component
                />
              );
            })}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="flex-shrink-0">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;

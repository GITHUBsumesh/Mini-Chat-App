import { axiosInstance } from "@/lib/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { MessageType, UserType } from "@/constants/models";

type ChatState = {
  messagesByUser: Record<string, MessageType[]>; // messages indexed by user ID
  users: UserType[];
  selectedUser: UserType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: { text: string; image?: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (user: UserType | null) => void;
  markMessageAsSeen: (userId: string, messageIds: string[]) => Promise<void>;
  setMessageStatus: (messageId: string, status: string) => void; // To update the status in the store
};

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByUser: {},
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data.filteredUsers });
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // markMessageAsSeen: async (userId: string, messageIds: string[]) => {
  //   console.log("Sending messageIds:", messageIds);
  
  //   // Ensure `messageIds` is an array
  //   const validMessageIds = Array.isArray(messageIds) ? messageIds : [messageIds];
  
  //   if (!userId || validMessageIds.length === 0) {
  //     console.warn("Invalid userId or messageIds:", { userId, messageIds });
  //     return; // Exit early if input is invalid
  //   }
  
  //   try {
  //     const response = await axiosInstance.post(`/messages/${userId}/seen`, {
  //       messageIds: validMessageIds,
  //     });
  
  //     // Validate and handle the response structure
  //     const { updatedMessages } = response.data;
  
  //     if (
  //       !updatedMessages ||
  //       typeof updatedMessages !== "object" ||
  //       !updatedMessages.acknowledged
  //     ) {
  //       console.error(
  //         "Unexpected response structure from mark-seen API:",
  //         response.data
  //       );
  //       return;
  //     }
  
  //     // Check if messages were successfully updated
  //     if (updatedMessages.modifiedCount > 0) {
  //       set((state) => ({
  //         messagesByUser: {
  //           ...state.messagesByUser,
  //           [userId]: state.messagesByUser[userId].map((msg) =>
  //             validMessageIds.includes(msg._id)
  //               ? { ...msg, status: "seen" }
  //               : msg
  //           ),
  //         },
  //       }));
  
  //       console.log(
  //         `Messages marked as seen. Updated ${updatedMessages.modifiedCount} messages.`,
  //         validMessageIds
  //       );
  //     } else {
  //       console.warn("No messages were updated as seen.", response.data);
  //     }
  //   } catch (error) {
  //     if (isAxiosError(error) && error.response) {
  //       console.error(
  //         "Failed to mark messages as seen - Server Response:",
  //         error.response.data
  //       );
  //     } else {
  //       console.error(
  //         "Failed to mark messages as seen - Error:",
  //         (error as Error).message
  //       );
  //     }
  //   }
  // },  
  // markMessageAsSeen: (() => {
  //   let debounceTimeout: NodeJS.Timeout | null = null; // Timeout for debouncing
  //   let pendingMessageIds: string[] = []; // Store pending message IDs
  
  //   return async (userId: string, messageIds: string[]) => {
  //     if (!userId || !messageIds || messageIds.length === 0) {
  //       console.error("Invalid userId or messageIds:", { userId, messageIds });
  //       return;
  //     }
  
  //     // Add the messageIds to the pending queue
  //     pendingMessageIds = [...new Set([...pendingMessageIds, ...messageIds])];
  
  //     // Optimistically update the status in the store
  //     set((state) => ({
  //       messagesByUser: {
  //         ...state.messagesByUser,
  //         [userId]: state.messagesByUser[userId].map((msg) =>
  //           pendingMessageIds.includes(msg._id)
  //             ? { ...msg, status: "seen" }
  //             : msg
  //         ),
  //       },
  //     }));
  
  //     // Debounce API calls
  //     if (debounceTimeout) clearTimeout(debounceTimeout);
  
  //     debounceTimeout = setTimeout(async () => {
  //       try {
  //         // Send API request with all pending message IDs
  //         const response = await axiosInstance.post(`/messages/${userId}/seen`, {
  //           messageIds: pendingMessageIds,
  //         });
  
  //         if (response.data.success) {
  //           console.log("Messages successfully marked as seen:", response.data);
  
  //           const { updatedMessages } = response.data;
  
  //           // Confirm the optimistic update
  //           set((state) => ({
  //             messagesByUser: {
  //               ...state.messagesByUser,
  //               [userId]: state.messagesByUser[userId].map((msg) =>
  //                 updatedMessages.some((updated: any) => updated._id === msg._id)
  //                   ? { ...msg, status: "seen" }
  //                   : msg
  //               ),
  //             },
  //           }));
  //         } else {
  //           console.error("Failed to mark messages as seen:", response.data.message);
  
  //           // Rollback the optimistic update if API fails
  //           set((state) => ({
  //             messagesByUser: {
  //               ...state.messagesByUser,
  //               [userId]: state.messagesByUser[userId].map((msg) =>
  //                 pendingMessageIds.includes(msg._id)
  //                   ? { ...msg, status: "delivered" } // Rollback to "delivered"
  //                   : msg
  //               ),
  //             },
  //           }));
  //         }
  //       } catch (error) {
  //         console.error("Failed to mark messages as seen - Error:", error);
  
  //         // Rollback the optimistic update if an error occurs
  //         set((state) => ({
  //           messagesByUser: {
  //             ...state.messagesByUser,
  //             [userId]: state.messagesByUser[userId].map((msg) =>
  //               pendingMessageIds.includes(msg._id)
  //                 ? { ...msg, status: "delivered" } // Rollback to "delivered"
  //                 : msg
  //             ),
  //           },
  //         }));
  //       } finally {
  //         // Clear pending messages after processing
  //         pendingMessageIds = [];
  //         debounceTimeout = null;
  //       }
  //     }, 300); // Adjust debounce time as needed
  //   };
  // })(),  
  markMessageAsSeen: (() => {
    let debounceTimeout: NodeJS.Timeout | null = null; // Timeout for debouncing
    let pendingMessageIds: string[] = []; // Store pending message IDs
  
    return async (userId: string, messageIds: string[]) => {
      if (!userId || !messageIds || messageIds.length === 0) {
        console.error("Invalid userId or messageIds:", { userId, messageIds });
        return;
      }
  
      // Add the messageIds to the pending queue
      pendingMessageIds = [...new Set([...pendingMessageIds, ...messageIds])];
  
      // Optimistically update the status in the store
      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [userId]: state.messagesByUser[userId].map((msg) =>
            pendingMessageIds.includes(msg._id)
              ? { ...msg, status: "seen" }
              : msg
          ),
        },
      }));
  
      // Debounce API calls
      if (debounceTimeout) clearTimeout(debounceTimeout);
  
      debounceTimeout = setTimeout(async () => {
        try {
          // Send API request with all pending message IDs
          const response = await axiosInstance.post(`/messages/${userId}/seen`, {
            messageIds: pendingMessageIds,
          });
  
          if (response.data.success) {
            console.log("Messages successfully marked as seen:", response.data);
  
            // Extract updatedMessages from the response
            const { updatedMessages } = response.data;
  
            // Validate if updatedMessages is an array
            if (
              updatedMessages &&
              Array.isArray(updatedMessages.modifiedIds) // Ensure modifiedIds is an array
            ) {
              // Confirm the optimistic update
              set((state) => ({
                messagesByUser: {
                  ...state.messagesByUser,
                  [userId]: state.messagesByUser[userId].map((msg) =>
                    updatedMessages.modifiedIds.includes(msg._id)
                      ? { ...msg, status: "seen" }
                      : msg
                  ),
                },
              }));
            } else {
              console.warn(
                "Unexpected response structure for updatedMessages:",
                updatedMessages
              );
            }
          } else {
            console.error("Failed to mark messages as seen:", response.data.message);
  
            // Rollback the optimistic update if API fails
            set((state) => ({
              messagesByUser: {
                ...state.messagesByUser,
                [userId]: state.messagesByUser[userId].map((msg) =>
                  pendingMessageIds.includes(msg._id)
                    ? { ...msg, status: "delivered" } // Rollback to "delivered"
                    : msg
                ),
              },
            }));
          }
        } catch (error) {
          console.error("Failed to mark messages as seen - Error:", error);
  
          // Rollback the optimistic update if an error occurs
          set((state) => ({
            messagesByUser: {
              ...state.messagesByUser,
              [userId]: state.messagesByUser[userId].map((msg) =>
                pendingMessageIds.includes(msg._id)
                  ? { ...msg, status: "delivered" } // Rollback to "delivered"
                  : msg
              ),
            },
          }));
        } finally {
          // Clear pending messages after processing
          pendingMessageIds = [];
          debounceTimeout = null;
        }
      }, 300); // Adjust debounce time as needed
    };
  })()  
  ,getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [userId]: res.data.messages,
        },
      }));
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: { text: string; image?: string }) => {
    const { selectedUser, messagesByUser } = get();
    try {
      if (!selectedUser) {
        toast.error("No user selected");
        return;
      }
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [selectedUser._id]: [
            ...(messagesByUser[selectedUser._id] || []),
            res.data.newMessage,
          ],
        },
      }));
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  },

  // subscribeToMessages: () => {
  //   const socket = useAuthStore.getState().socket;

  //   socket.on("newMessage", (newMessage: MessageType) => {
  //     set((state) => ({
  //       messagesByUser: {
  //         ...state.messagesByUser,
  //         [newMessage.senderId]: [
  //           ...(state.messagesByUser[newMessage.senderId] || []),
  //           newMessage,
  //         ],
  //       },
  //     }));
  //   });

  //   socket.on(
  //     "messageStatusUpdated",
  //     ({ messageId, status }: { messageId: string; status: string }) => {
  //       set((state) => ({
  //         messagesByUser: {
  //           ...state.messagesByUser,
  //           [state.selectedUser?._id || ""]: state.messagesByUser[
  //             state.selectedUser?._id || ""
  //           ].map((message) =>
  //             message._id === messageId ? { ...message, status } : message
  //           ),
  //         },
  //       }));
  //     }
  //   );
  // },
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
  
    socket.on("newMessage", (newMessage: MessageType) => {
      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [newMessage.senderId]: [
            ...(state.messagesByUser[newMessage.senderId] || []),
            newMessage,
          ],
        },
      }));
    });
  
    socket.on(
      "messageStatusUpdated",
      ({ messageId, status }: { messageId: string; status: string }) => {
        set((state) => {
          const userId = Object.keys(state.messagesByUser).find((userId) =>
            state.messagesByUser[userId].some((msg) => msg._id === messageId)
          );
  
          if (userId) {
            return {
              messagesByUser: {
                ...state.messagesByUser,
                [userId]: state.messagesByUser[userId].map((message) =>
                  message._id === messageId ? { ...message, status } : message
                ),
              },
            };
          }
  
          return state;
        });
      }
    );
  },  
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageStatusUpdated");
  },

  setSelectedUser: (user: UserType | null) => set({ selectedUser: user }),

  setMessageStatus: (messageId: string, status: string) => {
    set((state) => ({
      messagesByUser: {
        ...state.messagesByUser,
        [state.selectedUser?._id || ""]: state.messagesByUser[
          state.selectedUser?._id || ""
        ].map((message) =>
          message._id === messageId ? { ...message, status } : message
        ),
      },
    }));
  },
}));

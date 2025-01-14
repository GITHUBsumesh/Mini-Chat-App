interface MessageType{
    text: string;
    image?: string | undefined;
    _id: string;
    createdAt: string;
    updatedAt : string;
    senderId: string;
    receiverId: string;
    status: string | MessageStatus;
}
enum MessageStatus{
    SENDING = "sending",
    SENT = "sent",
    DELIVERED = "delivered",
    SEEN = "seen"
}

interface UserType{
    _id: string;
    name: string;
    email: string;
    profilePic: string | undefined;
    createdAt: string;
    updatedAt : string;
}

export type { MessageType, UserType }
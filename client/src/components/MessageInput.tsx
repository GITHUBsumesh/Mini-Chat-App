import { Paperclip, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "preact/hooks";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";

import ImagePreview from "./ImagePreview";
import { useChatStore } from "@/store/useChatStore";
import React from "preact/compat";

const MessageInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1); // Start with 1 row
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const { sendMessage } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isWantingToSend = () => {
    if (message.trim().length != 0) return true;
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.rows = 1;
      // console.log(rows);
      // Adjust rows based on content length
      const currentRows = Math.min(
        Math.max(1, textareaRef.current.scrollHeight / 34),
        5
      ); // Max 5 rows
      // console.log(textareaRef.current.scrollHeight);
      // console.log(currentRows);
      setRows(currentRows);
      textareaRef.current.rows = currentRows;
    }
  }, [message]);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      sendHandler(e);
    }
  };
  const sendHandler = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage({
        text: message.trim(),
      });

      // Clear form
      setMessage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  const attachmentHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className=" bg-base-300 p-1 ">
      <ImagePreview
        imagePreview={imagePreview}
        fileInputRef={fileInputRef}
        setImagePreview={setImagePreview}
      />
      <form className="flex gap-1 flex-row items-end">
        <div className="dropdown dropdown-top bg-base-300">
          <div className="tooltip bg-base-300" data-tip="Attach">
            <Button
              variant="ghost"
              // className={`hidden sm:flex btn btn-circle
              //          ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
              onClick={(e) => attachmentHandler(e)}
              className="transition-transform duration-300 ease-in-out transform hover:scale-110"
            >
              <Paperclip size={20} />
            </Button>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li>
              <h2 onClick={() => fileInputRef.current?.click()}>Photo</h2>
            </li>
            {/* <li>
              <h2></h2>
            </li> */}
          </ul>
        </div>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleImageChange(e)}
        />

        <Textarea
          ref={textareaRef}
          id="message"
          placeholder="Type a message..."
          rows={rows}
          value={message}
          onChange={(e) => setMessage((e.target as HTMLInputElement).value)}
          className="transition-all duration-300 ease-in-out text-sm resize-none border-none "
          onKeyDown={handleKeyDown} 
          style={{ minHeight: "30px", lineHeight: "26px" }}
        />
        <div className="tooltip bg-base-300" data-tip="Send">
          <Button
            variant="ghost"
            className={`${
              isWantingToSend() ? "block" : "hidden"
            } transition-opacity duration-3000 ease-in-out opacity-100`}
            onClick={(e) => sendHandler(e)}
          >
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;

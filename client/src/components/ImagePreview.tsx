import { Plus, Send, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "preact/hooks";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useChatStore } from "@/store/useChatStore";
interface ImagePreviewProps {
  imagePreview: string | ArrayBuffer | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  setImagePreview: (value: string | null) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imagePreview,
  fileInputRef,
  setImagePreview,
}) => {
  const { sendMessage } = useChatStore();
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [caption, setCaption] = useState("");
  const [captionRows, setCaptionRows] = useState(1); // Start with 1 row
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline
      sendAttachmentHandler(e);
    }
  };
  const sendAttachmentHandler = async (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (!caption.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: caption.trim(),
        image: typeof imagePreview === "string" ? imagePreview : undefined,
      });

      // Clear form
      setCaption("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  useEffect(() => {
    if (captionRef.current) {
      // Temporarily set rows to 1 to correctly calculate scrollHeight
      captionRef.current.rows = 1;
      console.log(captionRows);
      // Calculate the new number of rows based on scrollHeight
      const currentRows = Math.min(
        Math.max(1, Math.ceil(captionRef.current.scrollHeight / 34)), // Adjust 24 based on line-height or textarea styling
        5 // Max rows
      );
      // console.log(captionRef.current.scrollHeight);
      // console.log(currentRows);
      setCaptionRows(currentRows);

      // Restore the calculated rows
      captionRef.current.rows = currentRows;
    }
  }, [caption]);
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  // console.log(imagePreview);

  const handleClickOutside = (event: MouseEvent) => {
    if (divRef.current && !divRef.current.contains(event.target as Node)) {
      // console.log("Clicked outside the div!")
      setIsAlertOpen(true);
    }
  };

  useEffect(() => {
    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="img_preview">
      {imagePreview && (
        <>
          <div
            ref={divRef}
            className="absolute bg-zinc-900 bottom-[3rem] min-h-[22rem] min-w-[27rem] z-30 flex"
          >
            <div className="relative flex flex-col m-1 gap-2">
              <div className="top_section flex flex-row justify-end">
                <Button variant="ghost" onClick={removeImage}>
                  <Trash2 />
                </Button>
              </div>
              <div className="mid_section">
                <img
                  // src={typeof imagePreview === 'string' ? imagePreview : undefined}
                  src={
                    typeof imagePreview === "string" ? imagePreview : undefined
                  }
                  alt="Preview"
                  className="w-[27rem] h-[15rem] object-fit-cover rounded-lg border border-zinc-700"
                />
              </div>
              <div className="1st_lowerSection flex flex-row items-end">
                <Textarea
                  ref={captionRef}
                  id="message"
                  placeholder="Caption(optional)"
                  rows={captionRows}
                  value={caption}
                  onChange={(e) =>
                    setCaption((e.target as HTMLInputElement).value)
                  }
                  onKeyDown={handleKeyDown}
                  className="transition-all duration-300 ease-in-out resize-none border-none text-sm leading-6 px-2 py-[0.3rem] "
                  style={{
                    minHeight: "24px",
                  }}
                />
              </div>
              <div className="2nd_lowerSection flex flex-row justify-between ">
                <Button
                  variant="ghost"
                  className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                >
                  <Plus />
                </Button>
                <Button
                  variant="ghost"
                  className="bg-green-500 transition-transform duration-300 ease-in-out transform hover:bg-green-600 hover:scale-110"
                  onClick={(e) => sendAttachmentHandler(e)}
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <div className="hidden" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard unsent message?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your message, including attached media, will not be sent if
                  you leave this screen{" "}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    removeImage();
                    setIsAlertOpen(false);
                  }}
                >
                  Discard
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
                  Return To Media
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default ImagePreview;

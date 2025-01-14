import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { RefObject, useEffect, useRef } from "react";
import { useChatStore } from "@/store/useChatStore";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMessageTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}


 // Assuming the store is managing chat data
export function useMessageVisibility(messageId: string, onVisible: (id: string) => void) {
  const ref = useRef<HTMLElement | null>(null); // Ref for each message element
  const isSeenRef = useRef(false); // Track if this message has already been marked as seen

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only mark as seen if the message is fully visible and not already marked
        if (entry.isIntersecting && !isSeenRef.current && ref.current) {
          isSeenRef.current = true; // Mark as seen
          onVisible(messageId); // Notify the parent to mark this message as seen
        }
      },
      { threshold: 1.0 } // Only trigger when fully visible
    );

    if (ref.current) {
      observer.observe(ref.current); // Observe the current message element
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current); // Cleanup observer on unmount
      }
    };
  }, [messageId, onVisible]);

  return ref;
}

 

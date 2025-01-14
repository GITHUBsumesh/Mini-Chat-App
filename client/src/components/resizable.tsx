import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import NoChatSelected from "./NoChatSelected";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import { useChatStore } from "@/store/useChatStore";

export function ResizableDemo() {
  const { selectedUser } = useChatStore();
  // const toggleChatContainer = () => {
  //   setIsChatContainerOpen((prev) => !prev);
  // };
  return (
    <div className="flex flex-row justify-center items-center h-[90vh] w-[90vw] overflow-hidden">
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border flex flex-row items-center justify-center"
      >
        <ResizablePanel defaultSize={30} maxSize={50} minSize={20}>
          <div className="flex h-screen py-10 px-3 bg-base-300">
            {/* <span className="font-semibold">Sidebar</span> */}
            <Sidebar />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        {/* <PanelResizeHandle hitAreaMargins={{ coarse : 15, fine : 5} }/> */}
        <ResizablePanel defaultSize={70} maxSize={90} minSize={50}>
          {/* <div className="h-full items-center justify-center p-6">
            <span className="font-semibold">Two</span>
            
          </div> */}
          {/* <div className="flex h-screen border-amber-500">
          
            <ChatContainer />
          </div> */}
          {selectedUser ? (
            <div className="h-screen py-9 ">
              <ChatContainer />
            </div>
          ) : (
            <div className="h-full items-center justify-center p-6">
              <NoChatSelected />
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

import { useState } from "preact/hooks";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { MouseEventHandler, RefAttributes } from "preact/compat";
type NavIcon = {
  Icon?: RefAttributes<SVGSVGElement>;
  Content?: string;
  EventHandler: MouseEventHandler<HTMLButtonElement>;
};

const NavbarIcon = ({ Icon, Content, EventHandler }: NavIcon) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false); // For smooth closing animations

  const handleOpen = () => {
    setIsClosing(false); // Cancel any closing animations
    setIsOpen(true); // Open the tooltip
  };

  const handleClose = () => {
    setIsClosing(true); // Start closing animation
    setTimeout(() => setIsOpen(false), 1800); // Delay actual closing
  };

  return (
    <TooltipProvider delayDuration={2000}>
      <Tooltip
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)} // Manage tooltip state
      >
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Icon Button"
            className="cursor-pointer"
            onMouseEnter={handleOpen} // Open on hover
            onMouseLeave={handleClose} // Close with timeout
            onClick={EventHandler}
          >
            {Icon}
          </Button>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="center"
          onMouseEnter={handleOpen} // Keep open when hovering content
          onMouseLeave={handleClose} // Close with timeout
          className={`bg-black text-white rounded px-2 py-1 shadow-lg transition-opacity duration-200 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
        >
          <p>{Content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { NavbarIcon };

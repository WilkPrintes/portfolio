import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Desktop-window chrome used by the terminal and the code snippet. */
function WindowRoot({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("overflow-hidden border border-line bg-panel/90 backdrop-blur", className)} {...props} />;
}

function WindowBar({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-2 border-b border-line px-4 py-3 text-xs text-muted", className)}
      {...props}
    >
      <span aria-hidden="true" className="size-3 rounded-full bg-alert/80" />
      <span aria-hidden="true" className="size-3 rounded-full bg-accent/80" />
      <span aria-hidden="true" className="size-3 rounded-full bg-ok/80" />
      {children}
    </div>
  );
}

function WindowTitle({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("ml-3 font-mono", className)} {...props} />;
}

function WindowBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5 font-mono text-sm", className)} {...props} />;
}

export const Window = Object.assign(WindowRoot, {
  Bar: WindowBar,
  Title: WindowTitle,
  Body: WindowBody,
});

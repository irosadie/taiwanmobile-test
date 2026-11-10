"use client";
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;
export const SheetPortal = SheetPrimitive.Portal;
export const SheetOverlay = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Overlay>,React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>>(({className,...props},ref) => <SheetPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-40 bg-black/35 backdrop-blur-sm data-[state=open]:animate-[overlay-in_.2s_ease-out]",className)} {...props}/>);
SheetOverlay.displayName="SheetOverlay";
export const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & { side?: "left" | "right"; showCloseButton?: boolean; overlayClassName?: string }>(({className,children,side="right",showCloseButton=true,overlayClassName,...props},ref) => <SheetPortal><SheetOverlay className={overlayClassName}/><SheetPrimitive.Content ref={ref} className={cn("fixed inset-y-0 z-50 flex h-dvh w-full max-w-md flex-col gap-4 border bg-background p-6 shadow-xl data-[state=open]:animate-[sheet-in_.25s_ease-out]",side==="right" ? "right-0" : "left-0",className)} {...props}>{children}{showCloseButton && <SheetPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 opacity-60 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"><X className="size-5"/><span className="sr-only">關閉購物車</span></SheetPrimitive.Close>}</SheetPrimitive.Content></SheetPortal>);
SheetContent.displayName="SheetContent";
export function SheetHeader({className,...props}:React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col gap-2 text-left",className)} {...props}/>; }
export function SheetFooter({className,...props}:React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("mt-auto flex flex-col gap-3",className)} {...props}/>; }
export const SheetTitle = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Title>,React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>>(({className,...props},ref) => <SheetPrimitive.Title ref={ref} className={cn("text-xl font-semibold",className)} {...props}/>);
SheetTitle.displayName="SheetTitle";
export const SheetDescription = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Description>,React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>>(({className,...props},ref) => <SheetPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground",className)} {...props}/>);
SheetDescription.displayName="SheetDescription";

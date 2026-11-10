"use client";

import type { CartItem } from "@repo/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface RemoveItemDialogProps {
  item: CartItem | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RemoveItemDialog({ item, onOpenChange, onConfirm }: RemoveItemDialogProps) {
  return (
    <AlertDialog open={item !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>移除這件商品？</AlertDialogTitle>
          <AlertDialogDescription>確定要將「{item?.product.name}」從購物車移除嗎？取消將保留目前數量。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>確認移除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

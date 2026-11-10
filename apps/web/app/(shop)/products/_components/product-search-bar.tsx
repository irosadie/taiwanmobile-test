"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/providers/language-provider";

type ProductSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export function ProductSearchBar({ value, onChange, onClear }: ProductSearchBarProps) {
  const { t } = useLanguage();
  return (
    <div className="relative w-full sm:max-w-[320px]" role="search">
      <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label={t("searchProducts")}
        type="search"
        placeholder={t("searchPlaceholder")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={200}
        className="h-10 rounded border-[#ddd] bg-white pl-10 pr-11 text-sm text-[#333] shadow-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <Button type="button" variant="ghost" size="icon" aria-label={t("clearSearch")} onClick={onClear} className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded">
          <X aria-hidden="true" className="size-4" />
        </Button>
      )}
    </div>
  );
}

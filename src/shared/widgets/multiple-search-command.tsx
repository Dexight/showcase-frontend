import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Spinner } from "@/shared/ui/spinner";

interface Entity {
  id: number;
  name: string;
  mail?: string;
}

interface MultipleSearchCommandProps {
  entities: Entity[] | undefined;
  value: number[];
  onValueChange: (value: number) => void;
  triggerClassName?: string;
  placeholder: string;
  searchPlaceholder: string;
  isPending: boolean;
  isError: boolean;
}

export function MultipleSearchCommand({
  entities,
  value,
  onValueChange,
  triggerClassName,
  placeholder,
  searchPlaceholder,
  isPending,
  isError,
}: MultipleSearchCommandProps) {
  const [open, setOpen] = useState(false);

  const getButtonText = () => {
    if (value.length === 0) {
      return placeholder;
    }

    if (value.length === 1) {
      const selected = entities?.find(
        (entity) => entity.id === value[0]
      );

      return selected?.name ?? placeholder;
    }

    return `Выбрано: ${value.length}`;
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "font-normal min-w-56 text-left justify-between ",
            triggerClassName,
            { "text-muted-foreground": value.length === 0 }
          )}
        >
          <span className="truncate">{getButtonText()}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty className="flex justify-center items-center text-center py-6 w-full">
              {isPending && <Spinner />}
              {isError && (
                <span className="text-sm text-center">
                  Ошибка загрузки данных
                </span>
              )}
            </CommandEmpty>
            <CommandGroup>
              {entities?.map((entity) => (
                <CommandItem
                  key={entity.id}
                  value={`${entity.name}-${entity.id}`}
                  onSelect={() => onValueChange(entity.id)}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4 opacity-0", {
                      "opacity-100": value.includes(entity.id),
                    })}
                  />

                  <div className="flex w-full items-center justify-between">
                    <span>{entity.name}</span>

                    {entity.mail && (
                      <div className="relative group">
                      <span className="text-muted-foreground text-xs cursor-help">
                        @
                      </span>

                      <div
                        className="
                          absolute right-0 top-full z-50 mt-1
                          rounded-md border bg-popover px-2 py-1
                          text-xs whitespace-nowrap shadow-md
                          opacity-0 invisible
                          transition-opacity
                          group-hover:opacity-100
                          group-hover:visible
                        "
                      >
                        {entity.mail}
                      </div>
                    </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

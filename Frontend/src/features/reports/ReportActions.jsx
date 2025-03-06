// ReportActions.jsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";

export default function ReportActions({ onEdit, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-3">
        <Ellipsis color="#222222" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded-lg shadow-xl border border-slate-300">
        <DropdownMenuItem>
          <Button
            variant="link"
            onClick={onEdit}
            className="w-full flex items-center justify-evenly px-4 py-2 hover:bg-gray-100"
          >
            <Pencil className="size-4" />
            Editar
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            variant="link"
            onClick={onDelete}
            className="flex items-center gap-1 px-4 py-2 text-[#F53434] hover:text-white hover:bg-[#F53434]"
          >
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

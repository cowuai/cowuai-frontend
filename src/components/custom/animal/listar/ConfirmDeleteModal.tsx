"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  tsukimiClassName: string; // Para manter o estilo da fonte
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  setIsOpen,
  onConfirm,
  isLoading,
  tsukimiClassName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl p-0 shadow-2xl border-none [&>button]:hidden">
        <DialogHeader className="p-6 pb-4 border-b border-red-900/10">
          <DialogTitle
            className={`${tsukimiClassName} text-xl font-semibold text-red-800`}
          >
            Confirmar Exclusão
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 opacity-100 transition-opacity hover:opacity-70 disabled:pointer-events-none p-2 rounded-md">
            <X className="h-5 w-5 text-red-900" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-6">
          <p className="text-gray-700 text-base">
            Você tem certeza que deseja excluir permanentemente este animal?
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <DialogFooter className="flex justify-end p-6 pt-4 border-t border-red-900/10">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="px-4 py-2 rounded-md text-red-900 border-3 border-red-900 bg-transparent hover:bg-stone-300 dark:hover:bg-stone-800 dark:text-white"
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md bg-red-900 text-white hover:bg-red-800"
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

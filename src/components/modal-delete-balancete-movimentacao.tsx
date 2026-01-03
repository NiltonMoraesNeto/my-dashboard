import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface ModalDeleteBalanceteMovimentacaoProps {
  movimentacaoToDelete: string | null;
  closeDeleteDialog: () => void;
  onDelete: (id: string) => void;
}

export function ModalDeleteBalanceteMovimentacao({
  movimentacaoToDelete,
  closeDeleteDialog,
  onDelete,
}: ModalDeleteBalanceteMovimentacaoProps) {
  const handleDelete = () => {
    if (movimentacaoToDelete) {
      onDelete(movimentacaoToDelete);
    }
  };

  return (
    <Dialog open={!!movimentacaoToDelete} onOpenChange={closeDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Movimentação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteDialog}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


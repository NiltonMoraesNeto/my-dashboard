import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ModalDeleteEntregaProps {
  entregaToDelete: string | null;
  closeDeleteDialog: () => void;
  onDelete: (id: string) => void;
}

export function ModalDeleteEntrega({
  entregaToDelete,
  closeDeleteDialog,
  onDelete,
}: ModalDeleteEntregaProps) {
  return (
    <AlertDialog open={entregaToDelete !== null} onOpenChange={closeDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta entrega? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDeleteDialog}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (entregaToDelete) {
                onDelete(entregaToDelete);
              }
            }}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

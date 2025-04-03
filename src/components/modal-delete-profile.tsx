import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ModalDeleteProfileProps {
  profileToDelete: number | null;
  closeDeleteDialog: () => void;
  onDelete(id: number): Promise<void>;
}

export function ModalDeleteProfile({
  profileToDelete,
  closeDeleteDialog,
  onDelete,
}: ModalDeleteProfileProps) {
  return (
    <Dialog
      open={profileToDelete !== null}
      onOpenChange={(open) => !open && closeDeleteDialog()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Perfil</DialogTitle>
          <DialogDescription asChild>
            <div className="w-full mx-auto">
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="relative px-6 pt-12 pb-6">
                  <div className="relative shrink-0 mb-2 text-red-500">
                    Essa ação não pode ser desfeita.
                  </div>
                  <div className="relative shrink-0 mb-2 text-red-500">
                    Tem certeza que deseja deletar o perfil?
                  </div>
                  <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
                  <Button
                    variant="destructive"
                    onClick={() => profileToDelete && onDelete(profileToDelete)}
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

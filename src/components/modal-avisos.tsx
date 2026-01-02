import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { AvisoList } from "../model/aviso-model";
import { fetchAvisosList, marcarAvisoComoLido } from "../services/avisos";

interface ModalAvisosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead?: () => void;
}

export function ModalAvisos({ open, onOpenChange, onMarkAsRead }: ModalAvisosProps) {
  const [avisos, setAvisos] = useState<AvisoList[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAvisos = async () => {
    setIsLoading(true);
    try {
      const response = await fetchAvisosList(1, 100);
      if (response && response.data) {
        setAvisos(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar avisos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadAvisos();
    }
  }, [open]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await marcarAvisoComoLido(id);
      await loadAvisos();
      if (onMarkAsRead) {
        onMarkAsRead();
      }
    } catch (error) {
      console.error("Erro ao marcar aviso como lido:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Avisos</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando avisos...</div>
          ) : avisos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum aviso disponível.
            </div>
          ) : (
            <div className="space-y-4">
              {avisos.map((aviso) => (
                <div
                  key={aviso.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    !aviso.lido
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => {
                    if (!aviso.lido) {
                      handleMarkAsRead(aviso.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{aviso.titulo}</h3>
                        {aviso.destaque && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded">
                            Destaque
                          </span>
                        )}
                        {!aviso.lido && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                            Novo
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{aviso.descricao}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        {aviso.tipo && <span>Tipo: {aviso.tipo}</span>}
                        <span>Data: {formatDate(aviso.dataInicio)}</span>
                        {aviso.dataFim && <span>Até: {formatDate(aviso.dataFim)}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {aviso.lido ? (
                        <span className="text-green-500 text-sm">✓ Lido</span>
                      ) : (
                        <span className="text-blue-500 text-sm font-bold">● Não lido</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { TableProfile } from "../../components/table-profile";
import type { ProfileList } from "../../model/profile-model";
import { schemaAddProfile } from "../../schemas/profile-schema";
import { fetchProfileList, newProfile } from "../../services/profile";
import { isSuccessRequest } from "../../utils/response-request";

export function Profile() {
  const [profileList, setProfileList] = useState<ProfileList[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [openModal, setOpenModal] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schemaAddProfile>>({
    resolver: zodResolver(schemaAddProfile),
    defaultValues: {
      descricao: "",
    },
  });

  useEffect(() => {
    const loadProfileData = async () => {
      const response = await fetchProfileList(page, limit, debouncedSearch);
      if (response) {
        // Se a API retorna um objeto com data e total
        if (response.data && response.total !== undefined) {
          setProfileList(response.data);
          setTotalPages(response.totalPages || Math.ceil(response.total / limit));
        }
        // Fallback: Se a API retorna um array direto
        else if (Array.isArray(response)) {
          setProfileList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadProfileData();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleListData = () => {
    const loadProfileData = async () => {
      const response = await fetchProfileList(page, limit, debouncedSearch);
      if (response) {
        // Se a API retorna um objeto com data e total
        if (response.data && response.total !== undefined) {
          setProfileList(response.data);
          setTotalPages(response.totalPages || Math.ceil(response.total / limit));
        }
        // Fallback: Se a API retorna um array direto
        else if (Array.isArray(response)) {
          setProfileList(response);
          setTotalPages(Math.ceil(response.length / limit));
        }
      }
    };
    loadProfileData();
  };

  async function onSubmit(values: z.infer<typeof schemaAddProfile>) {
    try {
      const response = await newProfile(values.descricao);
      if (response && isSuccessRequest(response.status)) {
        toast.error("Sucesso", {
          description: "Perfil adicionado com sucesso",
        });
        setOpenModal(false);
        handleListData();
      } else {
        toast.error("Error", {
          description: "Erro ao adicionar o Perfil",
        });
      }
    } catch (error) {
      console.error("Erro ao criar perfil:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-indigo-900 p-8">
      <div className="max-w-full bg-white rounded-lg shadow-md p-6 dark:bg-indigo-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            Lista de Perfis
          </h1>
        </div>
        <TableProfile
          openModal={openModal}
          setOpenModal={setOpenModal}
          search={search}
          setSearch={setSearch}
          profileList={profileList}
          page={page}
          totalPages={totalPages}
          setPage={setPage}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          control={control}
          errors={errors}
          handleListData={handleListData}
        />
      </div>
    </div>
  );
}

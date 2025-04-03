import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProfileList } from "../../model/profile-model";
import { fetchProfileList, newProfile } from "../../services/profile";
import { schemaAddProfile } from "../../schemas/profile-schema";
import { z } from "zod";
import { isSuccessRequest } from "../../utils/response-request";
import { toast } from "sonner";
import { TableProfile } from "../../components/table-profile";

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
      const data = await fetchProfileList(page, limit, debouncedSearch);
      setProfileList(data.perfil);
      setTotalPages(Math.ceil(data.total / limit));
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
      const data = await fetchProfileList(page, limit, debouncedSearch);
      setProfileList(data.perfil);
      setTotalPages(Math.ceil(data.total / limit));
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

import { useEffect, useState, useCallback } from "react";
import { ProfileList } from "../model/profile-model";
import { fetchProfileList } from "../services/profile";

interface UseProfilesOptions {
  enabled?: boolean;
}

export function useProfiles({ enabled = true }: UseProfilesOptions = {}) {
  const [profiles, setProfiles] = useState<ProfileList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchProfileList(1, 200, "");
      if (response && response.data) {
        setProfiles(response.data);
      } else if (Array.isArray(response)) {
        setProfiles(response);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      console.error("Erro ao carregar perfis:", err);
      setError("Não foi possível carregar os perfis");
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  return {
    profiles,
    isLoading,
    error,
    refresh: loadProfiles,
  };
}


import { useState, useEffect, useCallback } from 'react';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '../ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Notificacoes.js';

export const useGroupNotificationSettings = (groupId) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationSettings(groupId);
      setSettings(data);
    } catch (err) {
      setError(err.message || 'Erro ao buscar configurações.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback(async (updatedSettings) => {
    if (!groupId || !updatedSettings) return;

    setIsSaving(true);
    setError(null);

    try {
      const newSettings = await updateNotificationSettings(groupId, updatedSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
    } catch (err) {
      setError(err.message || 'Erro ao salvar as alterações.');
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [groupId]);

  return {
    settings,
    loading,
    isSaving,
    error,
    refetchSettings: fetchSettings,
    updateSettings,
  };
};

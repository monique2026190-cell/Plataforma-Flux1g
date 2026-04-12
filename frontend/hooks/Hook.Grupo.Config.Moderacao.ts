
import { useState, useEffect, useCallback } from 'react';
import {
  getModerationSettings,
  updateModerationSettings,
} from '../../ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Grupo.Moderacao.js';

export const useGroupModeration = (groupId) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getModerationSettings(groupId);
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

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = useCallback(async () => {
    if (!groupId || !settings) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateModerationSettings(groupId, settings);
    } catch (err) {
      setError(err.message || 'Erro ao salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  }, [groupId, settings]);

  return {
    settings,
    loading,
    isSaving,
    error,
    updateSetting,
    saveChanges,
    retryFetch: fetchSettings,
  };
};

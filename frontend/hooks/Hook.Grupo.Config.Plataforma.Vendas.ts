
import { useState, useEffect, useCallback } from 'react';
import {
  getSalesPlatformSettings,
  updateSalesPlatformSettings,
} from '../../ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.PlataformaVendas.js';

export const useSalesPlatformSettings = (groupId) => {
  const [settings, setSettings] = useState({ isHubMode: false });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSalesPlatformSettings(groupId);
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

  const toggleHubMode = useCallback(async () => {
    if (!groupId) return;

    setIsSaving(true);
    setError(null);

    const newHubModeState = !settings.isHubMode;

    try {
      await updateSalesPlatformSettings(groupId, { isHubMode: newHubModeState });
      setSettings({ isHubMode: newHubModeState });
    } catch (err) {
      setError(err.message || 'Erro ao salvar a alteração.');
      // Reverte a alteração em caso de erro
      setSettings({ isHubMode: !newHubModeState });
    } finally {
      setIsSaving(false);
    }
  }, [groupId, settings]);

  return {
    isHubMode: settings.isHubMode,
    loading,
    isSaving,
    error,
    toggleHubMode,
    retryFetch: fetchSettings,
  };
};


import { useState, useEffect, useCallback } from 'react';
import { updateGroupGuidelines } from '../../ServiçosFrontend/ServiçoDeGrupos/Servico.Sistema.Grupo.Diretrizes.js';

/**
 * @typedef {object} SlowModeSettings
 * @property {boolean} enabled
 * @property {number} interval
 */

export const useGroupGuidelines = (groupData, onSaveSuccess) => {
  const [guidelines, setGuidelines] = useState('');
  const [slowMode, setSlowMode] = useState({ enabled: false, interval: 5 });
  const [slowModeEntry, setSlowModeEntry] = useState({ enabled: false, interval: 60 });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (groupData) {
      setGuidelines(groupData.guidelines || '');
      if (groupData.slowMode) setSlowMode(groupData.slowMode);
      if (groupData.slowModeEntry) setSlowModeEntry(groupData.slowModeEntry);
    }
  }, [groupData]);

  const handleSave = useCallback(async () => {
    if (!groupData?.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const settingsToSave = { guidelines, slowMode, slowModeEntry };
      await updateGroupGuidelines(groupData.id, settingsToSave);
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao salvar as configurações.');
    } finally {
      setIsSaving(false);
    }
  }, [groupData?.id, guidelines, slowMode, slowModeEntry, onSaveSuccess]);

  return {
    guidelines,
    setGuidelines,
    slowMode,
    setSlowMode,
    slowModeEntry,
    setSlowModeEntry,
    handleSave,
    isSaving,
    error,
  };
};

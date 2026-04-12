
import { useState, useEffect } from 'react';

// Mock de dados inicial
const mockInitialActions = [
  { id: 1, action: 'Banir usuário', timestamp: new Date().toISOString() },
  { id: 2, action: 'Silenciar usuário', timestamp: new Date().toISOString() },
];

export const useGroupAdminActions = (groupId) => {
  const [actions, setActions] = useState(mockInitialActions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        // Simulação de chamada de API
        setTimeout(() => {
          setActions(mockInitialActions);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (groupId) {
      fetchActions();
    }
  }, [groupId]);

  return { actions, loading, error };
};

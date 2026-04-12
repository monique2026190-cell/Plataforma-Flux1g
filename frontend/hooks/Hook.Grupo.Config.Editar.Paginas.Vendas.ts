
import { useState, useEffect } from 'react';

// Mock de dados inicial
const mockInitialData = {
  title: 'Página de Vendas',
  description: 'Descrição inicial da página de vendas.',
  products: [],
};

export const useGroupSalesPageSettings = (groupId) => {
  const [settings, setSettings] = useState(mockInitialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simula a busca de dados
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Em uma aplicação real, você faria uma chamada de API aqui
        // const response = await api.get(`/groups/${groupId}/sales-page-settings`);
        // setSettings(response.data);
        setTimeout(() => {
          setSettings(mockInitialData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (groupId) {
      fetchSettings();
    }
  }, [groupId]);

  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      // Em uma aplicação real, você faria uma chamada de API aqui
      // const response = await api.put(`/groups/${groupId}/sales-page-settings`, newSettings);
      // setSettings(response.data);
      setTimeout(() => {
        setSettings(newSettings);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { settings, loading, error, updateSettings };
};

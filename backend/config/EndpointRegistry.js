// backend/config/EndpointRegistry.js
const endpoints = new Map();

export function registrar(servico, listaEndpoints) {
  if (!endpoints.has(servico)) endpoints.set(servico, new Set());
  const set = endpoints.get(servico);
  listaEndpoints.forEach(ep => set.add(ep));
}

export function obterTodos() {
  return Array.from(endpoints.entries()).map(([servico, set]) => ({
    servico,
    endpoints: [...set].sort()
  }));
}

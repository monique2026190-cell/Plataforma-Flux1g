const endpoints = new Map();

export function registrar(servico, listaEndpoints) {
  if (!endpoints.has(servico)) {
    endpoints.set(servico, new Set());
  }
  const serviceEndpoints = endpoints.get(servico);
  listaEndpoints.forEach(ep => serviceEndpoints.add(ep));
}

export function obterTodos() {
  return Array.from(endpoints.entries()).map(([servico, serviceEndpoints]) => ({
    servico,
    endpoints: [...serviceEndpoints].sort(),
  }));
}


import LogProvider from './Sistema.Mensageiro.Cliente.Backend.ts';

// Placeholder para o futuro módulo de Snapshots de Estado
class SnapshotEstado {
    public capturar(motivo: string, estado: any, traceId?: string) {
        LogProvider.info('Snapshot.Estado', `Snapshot: ${motivo}`, estado, traceId);
    }
}

export default new SnapshotEstado();

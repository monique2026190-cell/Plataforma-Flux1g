import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

// Interfaces
interface GroupData {
    name: string;
    description: string;
    coverImageBlob?: Blob;
}

interface Payload {
    name: string;
    description: string;
    coverImage: string;
}

class ServiçoCriaçãoGrupoPrivado {
    async criar(groupData: GroupData): Promise<any> {
        try {
            let coverImageUrl = '';
            if (groupData.coverImageBlob) {
                console.warn("fileService.upload removido. A imagem de capa não será enviada.");
            }

            const payload: Payload = {
                name: groupData.name,
                description: groupData.description,
                coverImage: coverImageUrl,
            };

            return await dadosProviderGrupo.criarGrupo({ ...payload, type: 'private' });

        } catch (error: any) {
            const errorMessage = error.message || 'Falha ao criar o grupo privado.';
            throw new Error(errorMessage);
        }
    }
}

export default new ServiçoCriaçãoGrupoPrivado();

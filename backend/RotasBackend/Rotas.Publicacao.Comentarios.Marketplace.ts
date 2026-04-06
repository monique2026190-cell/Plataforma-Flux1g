
import { Router } from 'express';
import comentariosMarketplaceControle from '../controles/Controle.Comentarios.Marketplace.js';

const rotasComentariosMarketplace = Router();

rotasComentariosMarketplace.post('/', comentariosMarketplaceControle.adicionarComentario);
rotasComentariosMarketplace.get('/:publicacaoId', comentariosMarketplaceControle.obterComentarios);

export default rotasComentariosMarketplace;

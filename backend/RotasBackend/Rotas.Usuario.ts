
import express from 'express';
import multer from 'multer';
import controleUsuario from '../controles/Controle.Usuario.js';
import createRotaLogger from '../config/Log.Rotas.Backend.js';

const logger = createRotaLogger('Rotas.Usuario.js');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

logger.info('Configurando rotas de usuário...');

// Rota pública para obter o perfil de um usuário
router.get('/:id', controleUsuario.obterPerfil);

// Rota para completar o perfil do usuário
router.post('/complete-profile', upload.single('avatar'), controleUsuario.completarPerfil);

// Rota protegida para atualizar o próprio perfil
router.put('/perfil', controleUsuario.atualizarPerfil);

logger.info('Rotas de usuário configuradas.');

export default router;

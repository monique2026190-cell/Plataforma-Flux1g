
import express from 'express';
import createServerLogger from '../config/Log.Servidor.js';

const router = express.Router();
const logger = createServerLogger(import.meta.url);

/**
 * @route GET /api/v1/config/boot
 * @description Fornece as variáveis de configuração públicas necessárias para o frontend.
 * @access Público
 */
router.get('/boot', (req, res) => {
    try {
        // Objeto para armazenar as configurações públicas
        const publicConfig = {
            // O frontend precisa do Google Client ID para o botão de login do Google.
            // Esta variável é segura para ser exposta publicamente.
            googleClientId: process.env.GOOGLE_CLIENT_ID,

            // Adicione outras chaves públicas aqui no futuro, se necessário.
            // Ex: stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        };

        // Validação: Garante que o googleClientId não seja undefined.
        if (!publicConfig.googleClientId) {
            logger.error('CONFIG_BOOT_VALIDATION_FAILURE', {
                reason: 'A variável de ambiente GOOGLE_CLIENT_ID não está definida no servidor.'
            });
            // Responde com um erro 503 (Serviço Indisponível) porque o servidor está mal configurado.
            return res.status(503).json({ 
                error: 'Serviço temporariamente indisponível devido a erro de configuração.' 
            });
        }

        logger.info('CONFIG_BOOT_SUCCESS', { path: req.path });
        res.json(publicConfig);

    } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        logger.error('CONFIG_BOOT_UNEXPECTED_ERROR', { error });
        res.status(500).json({ error: 'Erro inesperado ao buscar as configurações do servidor.' });
    }
});

export default router;

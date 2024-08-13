// src/routes/logger.routes.js
import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/loggerTest', (req, res) => {
    // Probar todos los niveles de log
    logger.debug('Este es un mensaje de debug');
    logger.http('Este es un mensaje HTTP');
    logger.info('Este es un mensaje de info');
    logger.warning('Este es un mensaje de warning');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje fatal');

    res.status(200).json({ message: 'Logs generados correctamente' });
});

export default router;

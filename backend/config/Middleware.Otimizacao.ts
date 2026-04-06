
import express, { Express } from 'express';
import compression from 'compression';

export const configurarOtimizacao = (app: Express): void => {
    // Otimização e parsing
    app.use(compression());
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
};

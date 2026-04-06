
import { Server } from 'socket.io';
import { Request, Response, NextFunction } from 'express';

// Estendendo a interface Request para incluir a propriedade 'io'
interface RequestWithSocket extends Request {
    io: Server;
}

export const configurarSocket = (io: Server) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Usamos uma asserção de tipo para adicionar a propriedade io ao objeto req
        (req as RequestWithSocket).io = io;
        next();
    };
};

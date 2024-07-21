import jwt from 'jsonwebtoken';
const secretJWT = 'SecretWord';

const { verify } = jwt;

const verifyJWT = (socket: any, next: any) => {
    try {
        const token = socket.handshake.auth.token;
        verify(token, secretJWT, (err: any, decode:any) => {
            if (err) {
                next(err);
            }
            next();
        });
    } catch (error) {  
        next(error);
    }
}

export { verifyJWT as socketioAuthMiddleware }
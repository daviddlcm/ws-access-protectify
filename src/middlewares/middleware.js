"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketioAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretJWT = 'SecretWord';
const { verify } = jsonwebtoken_1.default;
const verifyJWT = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        verify(token, secretJWT, (err, decode) => {
            if (err) {
                next(err);
            }
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.socketioAuthMiddleware = verifyJWT;

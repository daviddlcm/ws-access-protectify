import { Request, Response } from 'express';

export const sendAccess = {
  handleRequest: (req: Request, res: Response) => {
    res.sendStatus(200); 
  }
};
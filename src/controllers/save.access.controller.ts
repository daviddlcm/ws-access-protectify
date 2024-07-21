import { Request,Response } from "express";

import { Server } from "socket.io";

import saveAccessService from "../services/save.access.service";

export const saveAccess = (io:Server) => async(req:Request,res:Response) => {
    try{
        await saveAccessService(req.body,io)
        res.status(200).send("Access saved successfully");
    }catch(err: any){
        res.status(500).send("Erro saving access");
    }
}
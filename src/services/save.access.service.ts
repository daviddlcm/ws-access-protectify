import connection from "../configs/db.config";

import { Access } from "../models/access.model";

import { Server } from "socket.io";

const saveAccessService = async (access: Access, io: Server) => {
    const {member_id, room_id, access_at, exit_at} = access;
    const conn = await connection;
    try{
        await conn.execute("INSERT INTO access (member_id, room_id, access_at, exit_at) VALUES (?,?,?,?)",[member_id, room_id, access_at, exit_at]);
        io.to(String(member_id)).emit("event-access", access);
    } finally {
        await conn.end()
    }
}
export default saveAccessService;
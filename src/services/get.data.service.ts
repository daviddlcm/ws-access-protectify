import connection from "../configs/db.config";
import { Access } from "../models/access.model";

const getAccessService = async (created_by: number): Promise<Access[] | null> => {    
    const rows = await (await connection).execute('SELECT * FROM access JOIN access_keys ON access.key_id = access_keys.key_id WHERE access_keys.created_by = ?', [created_by]);
    const data = rows as any;
    return data.length > 0 ? data : [];
};

export default getAccessService;
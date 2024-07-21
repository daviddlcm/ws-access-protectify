import { Request, Response } from 'express';
import getAccessService from '../services/get.data.service';

export const getData = async (req: Request, res: Response): Promise<void> => {
    try {
        const created_by = parseInt(req.params.id, 10);
        const data = await getAccessService(created_by)
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }    
    } catch (error) {
        res.status(500).json({ message: 'Error getting data', error });
    }
};
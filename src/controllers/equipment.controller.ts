import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipment.service';

const service = new EquipmentService();

export const EquipmentController = {
    async create(req: Request, res: Response) {
        try {
            const result = await service.createEquipment(req.body);
            return res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            console.error('[Create Equipment Controller]', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async findAll(_req: Request, res: Response) {
        try {
            const result = await service.getAllEquipment();
            return res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            console.error('[Get All Equipment Controller]', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    async findById(req: Request, res: Response) {
    try {
        const idParam = req.params['id'];

        if (!idParam) {
            return res.status(400).json({ success: false, message: 'ID is required' });
        }

        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        const result = await service.getEquipmentById(id);
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error('[Get Equipment By ID]', error.message);
        return res.status(404).json({ success: false, message: error.message });
    }
},

    async update(req: Request, res: Response) {
    try {
        const idParam = req.params['id'];

        if (!idParam) {
            return res.status(400).json({ success: false, message: 'ID is required' });
        }

        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        const result = await service.updateEquipment(id, req.body);
        return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        console.error('[Update Equipment]', error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
},

    async delete(req: Request, res: Response) {
    try {
        const idParam = req.params['id'];

        if (!idParam) {
            return res.status(400).json({ success: false, message: 'ID is required' });
        }

        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        await service.deleteEquipment(id);
        return res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('[Delete Equipment]', error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
}

};

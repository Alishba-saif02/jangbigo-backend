import { z } from 'zod';

export const createEquipmentDto = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
});

export const updateEquipmentDto = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    available: z.boolean().optional(),
});

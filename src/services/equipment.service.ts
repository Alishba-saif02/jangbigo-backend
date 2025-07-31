import { PrismaClient } from '@prisma/client';
import { redis } from '../utils/redis.utils'; // Custom redis instance export
const prisma = new PrismaClient();

export class EquipmentService {
    async createEquipment(data: any) {
        try {
            const equipment = await prisma.equipment.create({ data });
            await redis.del('equipment:all'); // Invalidate list cache
            return {
                status: 'success',
                message: 'Equipment created successfully',
                data: equipment
            }
        } catch (error: any) {
            console.error('[Create Equipment Service]', error.message);
            throw new Error('Failed to create equipment');
        }
    }

    async getAllEquipment() {
        try {
            const cacheKey = 'equipment:all';
            const cached = await redis.get(cacheKey);

            if (cached) {
                return {
                    status: 'success',
                    message: 'Equipment list retrieved from cache',
                    data: {
                        equipments: JSON.parse(cached),
                    },
                }
            }
            const equipments = await prisma.equipment.findMany({
                include: { images: true, owner: true },
            });

            await redis.set(cacheKey, JSON.stringify(equipments), { EX: 300 });
            return {
                status: 'success',
                message: 'Equipment list retrieved from DB',
                data: {
                    equipments,
                },
            }
        }
        catch (error: any) {
            console.error('[Get All Equipment Service]', error.message);
            throw new Error('Failed to fetch equipment list');
        }
    }

    async getEquipmentById(id: number) {
        try {
            const cacheKey = `equipment:${id}`;
            const cached = await redis.get(cacheKey);

            if (cached) {
                return {
                    status: 'success',
                    message: 'Equipment retrieved from cache',
                    data: JSON.parse(cached),
                }
            }

            const equipment = await prisma.equipment.findUnique({
                where: { id },
                include: { images: true, owner: true },
            });

            if (!equipment) {
                throw new Error('Equipment not found');
            }

            await redis.set(cacheKey, JSON.stringify(equipment), { EX: 300 });
            return {
                status: 'success',
                message: 'Equipment retrieved successfully',
                data: equipment,
            };
        } catch (error: any) {
            console.error('[Get Equipment By ID Service]', error.message);
            throw new Error(error.message || 'Failed to get equipment');
        }
    }

    async updateEquipment(id: number, data: any) {
        try {
            const equipment = await prisma.equipment.update({
                where: { id },
                data,
            });

            // Invalidate both detail and list cache
            await Promise.all([
                redis.del(`equipment:${id}`),
                redis.del('equipment:all'),
            ]);

            return {
                status: 'success',
                message: 'Equipment updated successfully',
                data: equipment,
            };
        } catch (error: any) {
            console.error('[Update Equipment Service]', error.message);
            throw new Error('Failed to update equipment');
        }
    }

    async deleteEquipment(id: number) {
        try {
            await prisma.equipment.delete({ where: { id } });

            await Promise.all([
                redis.del(`equipment:${id}`),
                redis.del('equipment:all'),
            ]);
            return {
                status: 'success',
                message: 'Equipment deleted successfully',
                data: {},
            };
        } catch (error: any) {
            console.error('[Delete Equipment Service]', error.message);
            throw new Error('Failed to delete equipment');
        }
    }
}

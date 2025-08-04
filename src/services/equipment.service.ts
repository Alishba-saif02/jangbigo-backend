import { PrismaClient } from '@prisma/client';
import { redis } from '../utils/redis.utils';
import { CreateEquipmentdto } from '../dto/CreateEquipmentdto.dto';

const prisma = new PrismaClient();

export class EquipmentService {
    async createEquipment(data: CreateEquipmentdto, userId: number) {
        try {
            const { images = [], ...rest } = data;

            const equipment = await prisma.equipment.create({
                data: {
                    ...rest,
                    owner: { connect: { id: userId } },
                    images: {
                        create: images.map((url) => ({ url })),
                    },
                },
                include: {
                    images: true,
                },
            });

            await redis.del('equipment:all');

            return {

                equipment
                };
            }
            catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
                throw new Error('Equipment with this title already exists');
            }

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
                    message: 'Equipment list from cache',
                    equipments: JSON.parse(cached),
                };
            }

            const equipments = await prisma.equipment.findMany({
                include: { images: { select: { url: true } } },
                orderBy: { createdAt: 'desc' },
            });

            const trimmed = equipments.map(e => ({
                id: e.id,
                title: e.title,
                description: e.description,
                category: e.category,
                available: e.available,
                createdAt: e.createdAt,
                updatedAt: e.updatedAt,
                images: e.images,
            }));

            await redis.set(cacheKey, JSON.stringify(trimmed), { EX: 300 });

            return {
                message: 'Equipment list from DB',
                equipments: trimmed,
            };
        } catch (error: any) {
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
                    message: 'Equipment from cache',
                    equipment: JSON.parse(cached),
                };
            }

            const equipment = await prisma.equipment.findUnique({
                where: { id },
                include: { images: { select: { url: true } } },
            });

            if (!equipment) throw new Error('Equipment not found');

            const trimmed = {
                id: equipment.id,
                title: equipment.title,
                description: equipment.description,
                category: equipment.category,
                available: equipment.available,
                createdAt: equipment.createdAt,
                updatedAt: equipment.updatedAt,
                images: equipment.images,
            };

            await redis.set(cacheKey, JSON.stringify(trimmed), { EX: 300 });

            return {
                message: 'Equipment found',
                equipment: trimmed,
            };
        } catch (error: any) {
            console.error('[Get Equipment By ID Service]', error.message);
            throw new Error(error.message || 'Failed to get equipment');
        }
    }

    async updateEquipment(id: number, data: Partial<CreateEquipmentdto>) {
        try {
            // Extract images separately
            const { images, ...equipmentData } = data;

            // Prepare image update object
            const imageUpdate: any = images
                ? {
                    deleteMany: {}, // Delete old images
                    create: images.map((url) => ({ url })),
                }
                : undefined;

            const updated = await prisma.equipment.update({
                where: { id },
                data: {
                    ...equipmentData,
                    ...(imageUpdate && { images: imageUpdate }), // only include if images is provided
                },
                include: { images: { select: { url: true } } },
            });

            const trimmed = {
                id: updated.id,
                title: updated.title,
                description: updated.description,
                category: updated.category,
                available: updated.available,
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt,
                images: updated.images,
            };

            await Promise.all([
                redis.del(`equipment:${id}`),
                redis.del('equipment:all'),
            ]);

            return {
                message: 'Equipment updated',
                equipment: trimmed,
            };
        } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('title')) {
                throw new Error('Equipment with this title already exists');
            }

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
                message: 'Equipment deleted',
                equipment: {},
            };
        } catch (error: any) {
            console.error('[Delete Equipment Service]', error.message);
            throw new Error('Failed to delete equipment');
        }
    }
}

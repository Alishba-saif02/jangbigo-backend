import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { createEquipmentDto, updateEquipmentDto } from '../dto/equipment.dto';
import { validate } from '../middleware/validate.middleware';


const router = Router();

// Create new equipment
router.post('/create', authenticateToken, authorizeRoles('ADMIN'), validate(createEquipmentDto), EquipmentController.create);

// Get all equipment
router.get('/findAll', authenticateToken, EquipmentController.findAll);

// Get a specific equipment by ID
router.get('/findById/:id',authenticateToken, EquipmentController.findById);

// Update equipment by ID
router.patch('/update/:id',authenticateToken,authorizeRoles('ADMIN'), validate(updateEquipmentDto),  EquipmentController.update);

// Delete equipment by ID
router.delete('/delete/:id', authenticateToken,authorizeRoles('ADMIN'), EquipmentController.delete);

export default router;

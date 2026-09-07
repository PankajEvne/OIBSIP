import express from 'express';
import { getPizzas, createPizza, deletePizza } from '../controllers/pizzaController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPizzas);
router.post('/', protect, adminOnly, createPizza);
router.delete('/:id', protect, adminOnly, deletePizza);

export default router;

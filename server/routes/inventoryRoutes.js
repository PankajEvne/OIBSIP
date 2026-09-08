import express from "express";
import {
    createItem,
     getInventory,
     updateStock,
    } from "../controllers/inventoryController.js";
import { adminOnly, protect } from "../middleware/auth.js";



const router = express.Router();


router.get("/", getInventory);
router.post("/", protect, adminOnly, createItem);
router.put("/:id", protect, adminOnly, updateStock);


export default router;
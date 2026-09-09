import cron from 'node-cron';
import Pizza from '../models/Pizza.js';
import Inventory from '../models/Inventory.js';
import { sendEmail } from './sendEmail.js';

// Schedule a cron job to check for low stock every hour
cron.schedule('0 * * * *', async () => {
  try {
    console.log("⏰ Running scheduled low stock check...");
    const lowPizzas = await Pizza.find({ $expr: { $lte: ["$stock", "$threshold"] } });
    const lowIngredients = await Inventory.find({ $expr: { $lte: ["$stock", "$threshold"] } });

    if (lowPizzas.length > 0 || lowIngredients.length > 0) {
      let emailHtml = "<h3>⚠️ Low Stock Alerts</h3>";
      if (lowPizzas.length > 0) {
        emailHtml += "<h4>Pizzas:</h4><ul>";
        lowPizzas.forEach(p => {
          emailHtml += `<li>${p.name} (Stock: ${p.stock}, Threshold: ${p.threshold})</li>`;
        });
        emailHtml += "</ul>";
      }
      if (lowIngredients.length > 0) {
        emailHtml += "<h4>Ingredients:</h4><ul>";
        lowIngredients.forEach(i => {
          emailHtml += `<li>${i.name} (${i.category}) - (Stock: ${i.stock}, Threshold: ${i.threshold})</li>`;
        });
        emailHtml += "</ul>";
      }

      await sendEmail({
        to: process.env.ADMIN_EMAIL || "pankajevne53@gmail.com",
        subject: "🚨 PizzaHub Alert: Low Stock Items Detected",
        html: emailHtml
      });
      console.log("✉️ Low stock email alert sent to admin.");
    }
  } catch (err) {
    console.error("Cron Job Error:", err);
  }
});

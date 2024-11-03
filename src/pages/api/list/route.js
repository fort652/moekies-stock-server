import connectMongoDB from "@/libs/mongodb";
import Stock from "@/models/Stock";
import Sales from "@/models/Sales";

export default async function handler(req, res) {
  const { method, query } = req;

  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const fabricType = decodeURIComponent(query.fabricType || '');
        const size = decodeURIComponent(query.size || '');
        const filter = {};

        if (fabricType) filter.fabric_type = fabricType;
        if (size) filter.size = size;

        const stockList = await Stock.find(filter);
        res.status(200).json({ stockList });
      } catch (error) {
        console.error("Error fetching stockList:", error);
        res.status(500).json({ error: "Failed to fetch stockList" });
      }
      break;
      
    case 'POST':
      try {
        console.log('Request body:', req.body);
        const { title, price, amount, fabric_type, size } = req.body;
        await Stock.create({ title, price, amount, fabric_type, size });
        res.status(201).json({ message: "Stock List Created" });
      } catch (error) {
        console.error("Error creating Stock:", error.message, error.stack);
        res.status(500).json({ error: "Failed to create Stock" });
      }
      break;
      
    case 'PATCH':
      try {
        console.log('PATCH Request Body:', req.body);
        const { id, amount } = req.body;
        if (!id || amount === undefined) {
          return res.status(400).json({ error: 'Invalid data' });
        }

        const stockItem = await Stock.findById(id);

        if (!stockItem) {
          return res.status(404).json({ error: 'Stock not found' });
        }

        // Only add to sales if the amount is decremented
        if (amount < stockItem.amount) {
          await Sales.create({
            stockItemId: stockItem._id,
            title: stockItem.title,
            amount: stockItem.amount - amount,
            fabric_type: stockItem.fabric_type,  // Include fabric_type
            size: stockItem.size,  // Include size
            sold_date: new Date(),
          });
        }

        stockItem.amount = amount;
        await stockItem.save();

        console.log('Update Result:', stockItem);
        res.status(200).json(stockItem);
      } catch (error) {
        console.error("Error updating Stock amount:", error);
        res.status(500).json({ error: "Failed to update Stock amount" });
      }
      break;


    case 'DELETE':
      try {
        const id = req.query.id;
        await Stock.findByIdAndDelete(id);
        res.status(200).json({ message: "Stock deleted" });
      } catch (error) {
        console.error("Error deleting Stock:", error);
        res.status(500).json({ error: "Failed to delete Stock" });
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}

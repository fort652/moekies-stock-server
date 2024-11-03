import connectMongoDB from "@/libs/mongodb";
import Sales from "@/models/Sales";
import Stock from "@/models/Stock";

export default async function handler(req, res) {
  await connectMongoDB();

  switch (req.method) {
    case 'GET':
      try {
        const { date, fabricType } = req.query;

        // Build query object
        const query = {};
        if (date) {
          const startOfDay = new Date(date);
          startOfDay.setUTCHours(0, 0, 0, 0);
          const endOfDay = new Date(startOfDay);
          endOfDay.setUTCHours(23, 59, 59, 999);
          query.sold_date = { $gte: startOfDay, $lte: endOfDay };
        }
        if (fabricType) {
          query.fabric_type = fabricType; // Corrected field name
        }

        // Fetch sales list and populate stockItemId to get the stock details
        const salesList = await Sales.find(query)
          .populate({
            path: 'stockItemId',
            select: 'title price' // Include title and price from the Stock schema
          });

        // Compute total price for each sale
        const salesWithTotalPrice = salesList.map(sale => {
          const totalPrice = sale.amount * (sale.stockItemId?.price || 0);
          return {
            ...sale._doc,
            totalPrice
          };
        });

        res.status(200).json({ salesList: salesWithTotalPrice });

      } catch (error) {
        console.error("Error fetching salesList:", error);
        res.status(500).json({ error: "Failed to fetch salesList" });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.body;
        console.log('Reverting sale with ID:', id);

        const saleItem = await Sales.findById(id);
        if (!saleItem) {
          console.log('Sale not found');
          return res.status(404).json({ error: 'Sale not found' });
        }

        const stockItem = await Stock.findById(saleItem.stockItemId);
        if (!stockItem) {
          console.log('Stock item not found');
          return res.status(404).json({ error: 'Stock item not found' });
        }

        stockItem.amount += saleItem.amount;
        await stockItem.save();
        await Sales.findByIdAndDelete(id);

        console.log('Stock reverted and sale deleted');
        res.status(200).json({ message: 'Stock reverted and sale deleted' });
      } catch (error) {
        console.error("Error reverting stock:", error);
        res.status(500).json({ error: "Failed to revert stock" });
      }
      break;
    
    case 'DELETE':
      try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'ID is required' });

        const saleItem = await Sales.findById(id);
        if (!saleItem) {
          return res.status(404).json({ error: 'Sale not found' });
        }

        // Optionally, revert stock if needed
        const stockItem = await Stock.findById(saleItem.stockItemId);
        if (stockItem) {
          stockItem.amount += saleItem.amount;
          await stockItem.save();
        }

        await Sales.findByIdAndDelete(id);
        res.status(200).json({ message: 'Sale deleted' });
      } catch (error) {
        console.error("Error deleting sale:", error);
        res.status(500).json({ error: "Failed to delete sale" });
      }
      break;


    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}

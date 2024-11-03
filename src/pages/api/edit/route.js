import connectMongoDB from "@/libs/mongodb";
import Stock from "@/models/Stock";

export default async function handler(req, res) {
  const { method, query, body } = req;

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
        const { title, price, amount, fabric_type, size } = body;
        await Stock.create({ title, price, amount, fabric_type, size });
        res.status(201).json({ message: "Stock List Created" });
      } catch (error) {
        console.error("Error creating Stock:", error.message, error.stack);
        res.status(500).json({ error: "Failed to create Stock" });
      }
      break;

    case 'PATCH':
      try {
        const { id, title, amount, price } = body;
        if (!id || (amount === undefined && title === undefined && price === undefined)) {
          return res.status(400).json({ error: 'Invalid data' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (amount !== undefined) updateData.amount = Number(amount);
        if (price !== undefined) updateData.price = price;

        const result = await Stock.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        );

        if (!result) {
          return res.status(404).json({ error: 'Stock not found' });
        }

        res.status(200).json(result);
      } catch (error) {
        console.error("Error updating Stock:", error);
        res.status(500).json({ error: "Failed to update Stock" });
      }
      break;

    case 'DELETE':
      try {
        const { id } = query;
        if (!id) {
          return res.status(400).json({ error: 'Invalid data' });
        }

        const result = await Stock.findByIdAndDelete(id);
        if (!result) {
          return res.status(404).json({ error: 'Stock not found' });
        }

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

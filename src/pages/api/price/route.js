import connectMongoDB from "@/libs/mongodb";
import Stock from "@/models/Stock";

export default async function handler(req, res) {
  const { method, query } = req;

  await connectMongoDB();

  switch (method) {
    case 'PATCH':
      try {
        console.log('PATCH Request Body:', req.body); // Debugging line
        const { fabric_type, size, price } = req.body;
        if (!fabric_type || !size || price === undefined) {
          return res.status(400).json({ error: 'Invalid data' });
        }

        // Find and update all matching documents
        const result = await Stock.updateMany(
          { fabric_type, size },
          { $set: { price: Number(price) } },
          { new: true } // Return the updated document
        );

        if (result.nModified === 0) {
          return res.status(404).json({ error: 'Stock not found' });
        }

        console.log('Update Result:', result); // Debugging line
        res.status(200).json(result);
      } catch (error) {
        console.error("Error updating Stock price:", error);
        res.status(500).json({ error: "Failed to update Stock price" });
      }
      break;
    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}

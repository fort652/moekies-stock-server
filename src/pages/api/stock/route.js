import connectMongoDB from "@/libs/mongodb";
import Stock from "@/models/Stock";
import Sales from "@/models/Sales";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const stockList = await Stock.find();
        res.status(200).json({ stockList });
      } catch (error) {
        console.error("Error fetching stockList:", error);
        res.status(500).json({ error: "Failed to fetch stockList" });
      }
      break;
    
    case 'DELETE':
      try {
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ error: "ID is required" });
        }
        await Sales.findByIdAndDelete(id); // Update the model to 'Sales' if you're deleting sales items
        res.status(200).json({ message: "Sale item deleted successfully" });
      } catch (error) {
        console.error("Error deleting sale item:", error);
        res.status(500).json({ error: "Failed to delete sale item" });
      }
      break;
      
    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}

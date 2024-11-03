import connectMongoDB from "@/libs/mongodb";
import Stock from "@/models/Stock";

export default async function handler(req, res) {
  const { method } = req;

  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const stockList = await Stock.find();

        const fabricTypeNetWorths = stockList.reduce((acc, item) => {
          const fabricType = item.fabric_type;
          if (!acc[fabricType]) {
            acc[fabricType] = { netWorth: 0, items: [] };
          }
          acc[fabricType].netWorth += item.price * item.amount;
          acc[fabricType].items.push(item);
          return acc;
        }, {});

        res.status(200).json({ fabricTypeNetWorths });
      } catch (error) {
        console.error("Error fetching stockList:", error);
        res.status(500).json({ error: "Failed to fetch stockList" });
      }
      break;

    default:
      res.status(405).json({ error: "Method Not Allowed" });
      break;
  }
}

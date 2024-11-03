import mongoose from "mongoose";

const StockSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    fabric_type: { type: String, required: true },
    size: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

let Stock;

try {
  Stock = mongoose.model('Stock');
} catch {
  Stock = mongoose.model('Stock', StockSchema);
}

export default Stock;

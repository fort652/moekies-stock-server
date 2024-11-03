import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema(
  {
    stockItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    fabric_type: { type: String, required: true },
    size: { type: String, required: true },
    sold_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);


let Sales;

try {
  Sales = mongoose.model('Sales');
} catch {
  Sales = mongoose.model('Sales', SalesSchema);
}

export default Sales;

import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: String
  },
  completed: { 
    type: Boolean,
    default: false
  }
});


let ToDo;

try {
  ToDo = mongoose.model('ToDo');
} catch {
  ToDo = mongoose.model('ToDo', TodoSchema);
}

export default ToDo;




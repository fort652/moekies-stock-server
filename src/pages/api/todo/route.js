import connectMongoDB from "@/libs/mongodb";
import ToDo from "@/models/Todo";

export default async function handler(req, res) {
  const { method, query, body } = req;

  await connectMongoDB();

  switch (method) {
    case 'GET':
      try {
        const todos = await ToDo.find({});
        res.status(200).json(todos);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching todos' });
      }
      break;

    case 'POST':
      try {
        const newTodo = await ToDo.create(body);
        res.status(201).json(newTodo);
      } catch (error) {
        res.status(500).json({ error: 'Error creating todo' });
      }
      break;

    case 'PATCH':
      try {
        const updatedTodo = await ToDo.findByIdAndUpdate(query.id, body, { new: true });
        res.status(200).json(updatedTodo);
      } catch (error) {
        res.status(500).json({ error: 'Error updating todo' });
      }
      break;

    case 'DELETE':
      try {
        await ToDo.findByIdAndDelete(query.id);
        res.status(200).json({ message: 'Todo deleted' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting todo' });
      }
      break;

    default:
      res.status(405).json({ error: 'Method Not Allowed' });
      break;
  }
}

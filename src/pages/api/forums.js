import dbConnect from '../../../utils/dbConnect';
import Forum from '../../../models/Forum';

dbConnect();

const forumsHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const forums = await Forum.find({});
        res.status(200).json(forums);
      } catch (error) {
        console.error("Failed to fetch forums:", error); // Log the error for debugging
        res.status(500).json({ success: false, error: "Internal Server Error" });
      }
      break;
    case 'POST':
      try {
        const forum = await Forum.create(req.body);
        res.status(201).json(forum);
      } catch (error) {
        console.error("Failed to create forum:", error); // Log the error for debugging
        res.status(400).json({ success: false, error: "Bad Request" });
      }
      break;
    default:
      res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
};

export default forumsHandler;
import dbConnect from '../../../utils/dbConnect';
import Event from '../../../models/Event';

dbConnect();

const eventsHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const events = await Event.find({});
        res.status(200).json(events);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default eventsHandler;
import dbConnect from '../../../utils/dbConnect';
import Job from '../../../models/Job';

dbConnect();

const jobsHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const jobs = await Job.find({});
        res.status(200).json(jobs);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const job = await Job.create(req.body);
        res.status(201).json(job);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default jobsHandler;
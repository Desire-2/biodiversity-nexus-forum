import dbConnect from '../../../utils/dbConnect';
import Forum from '../../../models/Forum';
import Article from '../../../models/Article';
import Event from '../../../models/Event';
import Job from '../../../models/Job';

dbConnect();

const searchHandler = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  try {
    const forums = await Forum.find({ $text: { $search: query } });
    const articles = await Article.find({ $text: { $search: query } });
    const events = await Event.find({ $text: { $search: query } });
    const jobs = await Job.find({ $text: { $search: query } });

    const results = [...forums, ...articles, ...events, ...jobs];

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default searchHandler;
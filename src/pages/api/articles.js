import dbConnect from '../../../utils/dbConnect';
import Article from '../../../models/Article';

dbConnect();

const articlesHandler = async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const articles = await Article.find({});
        res.status(200).json(articles);
      } catch (error) {
        console.error("GET Error:", error); // Log the error for debugging
        res.status(500).json({ success: false, error: "Failed to fetch articles" });
      }
      break;
    case 'POST':
      try {
        const article = await Article.create(req.body);
        res.status(201).json(article);
      } catch (error) {
        console.error("POST Error:", error); // Log the error for debugging
        if (error.name === 'ValidationError') {
          res.status(400).json({ success: false, error: "Validation Error", details: error.message });
        } else {
          res.status(500).json({ success: false, error: "Failed to create article" });
        }
      }
      break;
    // Ensure to handle other HTTP methods as needed
  }
};

export default articlesHandler;
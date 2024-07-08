import { getSession } from 'next-auth/react';

const sessionHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  return res.status(200).json(session);
};

export default sessionHandler;

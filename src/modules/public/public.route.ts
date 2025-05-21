import { Router } from 'express';

const publicRoutes = Router();

publicRoutes.get('/', (req, res) => {
  res.json({ message: 'This is a public route accessible by anyone.' });
});

export default publicRoutes;

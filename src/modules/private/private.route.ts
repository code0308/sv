import { Router } from 'express';
import { authenticateToken } from '../../shared/middlewares/authMiddleware';
import { authorizeRoles } from '../../shared/middlewares/roleMiddleware';

const privateRoutes = Router();

// Solo admins
privateRoutes.get('/', authenticateToken, authorizeRoles(['admin']), (req, res) => {
  res.json({ message: `Hello Admin! This is a private route.` });
});

export default privateRoutes;

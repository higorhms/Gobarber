import { Router } from 'express';

import authMiddleware from '@modules/users/infra/http/middlewares/authMiddleware';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentRoutes = Router();

appointmentRoutes.use(authMiddleware);

appointmentRoutes.get('/', AppointmentsController.index);

appointmentRoutes.post('/', AppointmentsController.create);

export default appointmentRoutes;
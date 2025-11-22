import express from 'express';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/calendar.controller.js';
import validateCalendar from '../middleware/validate.calendar.js';

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', validateCalendar, createEvent);
router.put('/:id', validateCalendar, updateEvent);
router.delete('/:id', deleteEvent);

export default router;

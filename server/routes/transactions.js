import express from 'express';
import { fetchJson } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  await fetchJson(res, 'SELECT * FROM transactions ORDER BY date DESC');
});

export default router;

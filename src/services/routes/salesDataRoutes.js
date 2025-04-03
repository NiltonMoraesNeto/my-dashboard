import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

router.get('/list', (req, res) => {
  const year = parseInt(req.query.year, 10);
  const db = readDB();
  const salesData = db.salesData.filter(item => item.year === year);

  if (salesData.length > 0) {
    res.json(salesData);
  } else {
    res.status(404).send(`No sales data found for the year ${year}`);
  }
});

router.get('/ByBuilding/list', (req, res) => {
  const buildingName = req.query.buildingName || "Edifício A";
  const db = readDB();
  const salesDataByBuilding = db.salesDataByBuilding.filter(item => item.buildingName === buildingName);

  if (salesDataByBuilding.length > 0) {
    res.json(salesDataByBuilding);
  } else {
    res.status(404).send(`No sales data found for the buildingName ${buildingName}`);
  }
});
export default router;
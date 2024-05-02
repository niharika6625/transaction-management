// pages/api/transactions/[transaction_id].js

import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'transactions.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { transaction_id } = req.query;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const transactions = JSON.parse(data);

      const transaction = transactions.find((tran) => tran.transaction_id === transaction_id);

      if (transaction) {
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ error: 'Transaction not found' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

// pages/api/accounts.js

import fs from 'fs';
import path from 'path';

const accountsFilePath = path.join(process.cwd(), 'data', 'accounts.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const accountsData = await fs.promises.readFile(accountsFilePath, 'utf-8');
      const accounts = JSON.parse(accountsData);
      res.status(200).json(accounts);
    } catch (error) {
      console.error('Error fetching account data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

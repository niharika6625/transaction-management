// pages/api/accounts/[account_id].js

import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'accounts.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { account_id } = req.query;

    try {
      const data = await fs.promises.readFile(dataFilePath, 'utf8');
      const accounts = JSON.parse(data);

      const account = accounts.find((acc) => acc.account_id === account_id);

      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ error: 'Account not found' });
      }
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

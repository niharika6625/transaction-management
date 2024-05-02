import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'transactions.json');
const dataAccountFilePath = path.join(process.cwd(), 'data', 'accounts.json');

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      await handlePostRequest(req, res);
    } else if (req.method === 'GET') {

      // CODE: TO EMPTY THE HISTORY TABLE
      // fs.writeFile(dataFilePath, JSON.stringify([]), (err) => {
      //   if (err) {
      //     console.error(err);
      //     return res.status(500).json({ error: 'Internal Server Error' });
      //   }
      // })
      // fs.writeFile(dataAccountFilePath, JSON.stringify([]), (err) => {
      //   if (err) {
      //     console.error(err);
      //     return res.status(500).json({ error: 'Internal Server Error' });
      //   }
      // })

      await handleGetRequest(req, res);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handlePostRequest(req, res) {
  const { account_id, amount } = req.body;

  if (!account_id || !isValidUUID(account_id) || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  let transactions = await readFromFile(dataFilePath);
  const transaction_id = generateUUID();

  const newTransaction = {
    transaction_id,
    account_id,
    amount,
    created_at: new Date().toISOString(),
  };

  transactions.push(newTransaction);

  await writeToFile(dataFilePath, transactions);

  const accounts = await readFromFile(dataAccountFilePath);
  const accountIndex = accounts.findIndex((item) => item.account_id === account_id);

  if (accountIndex > -1) {
    accounts[accountIndex].balance += amount;
  } else {
    accounts.push({ account_id, balance: amount });
  }

  await writeToFile(dataAccountFilePath, accounts);

  res.status(201).json(newTransaction);
}

async function handleGetRequest(req, res) {
  let transactionsData = await readFromFile(dataFilePath);
  transactionsData = transactionsData.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.status(200).json(transactionsData);
}

async function readFromFile(filePath) {
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeToFile(filePath, data) {
  await fs.promises.writeFile(filePath, JSON.stringify(data));
}

function isValidUUID(uuid) {
  const uuidRegex = /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
  return uuidRegex.test(uuid);
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

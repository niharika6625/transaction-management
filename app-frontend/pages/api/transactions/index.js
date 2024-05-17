// "/transactions": {
//   "post": {
//     "summary": "Creates a new transaction.",
//     "requestBody": {
//       "required": true,
//       "content": {
//         "application/json": {
//           "schema": {
//             "$ref": "#/components/schemas/TransactionRequest"
//           },
//           "examples": {
//             "TransactionRequestWithPositiveAmount": {
//               "$ref": "#/components/examples/TransactionRequestWithPositiveAmount"
//             },
//             "TransactionRequestWithNegativeAmount": {
//               "$ref": "#/components/examples/TransactionRequestWithNegativeAmount"
//             }
//           }
//         }
//       }
//     },
//     "responses": {
//       "201": {
//         "description": "Transaction created.",
//         "content": {
//           "application/json": {
//             "schema": {
//               "$ref": "#/components/schemas/Transaction"
//             },
//             "examples": {
//               "TransactionWithPositiveAmount": {
//                 "$ref": "#/components/examples/TransactionWithPositiveAmount"
//               }
//             }
//           }
//         }
//       },
//       "400": {
//         "description": "Mandatory body parameters missing or have incorrect type."
//       },
//       "405": {
//         "description": "Specified HTTP method not allowed."
//       },
//       "415": {
//         "description": "Specified content type not allowed."
//       }
//     }
//   },
//   "get": {
//     "summary": "Get transactions",
//     "responses": {
//       "200": {
//         "description": "Returns all previously created transactions.",
//         "content": {
//           "application/json": {
//             "schema": {
//               "$ref": "#/components/schemas/ArrayOfTransactions"
//             },
//             "examples": {
//               "ArrayOfTransactionsExample": {
//                 "$ref": "#/components/examples/ArrayOfTransactionsExample"
//               }
//             }
//           }

// returning this : Get method
// [
//   {
//       "transaction_id": "fd8b015d-211a-451d-8ebc-8dcd3ed54ebd",
//       "account_id": "fbf4a552-2418-46c5-b308-6094ddc493a1",
//       "amount": 5,
//       "created_at": "2024-05-09T10:56:18.916Z"
//   },
//   {
//       "transaction_id": "713de7b5-9183-4fb0-bc52-920c9afa9e76",
//       "account_id": "0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
//       "amount": -20,
//       "created_at": "2024-05-09T10:56:05.827Z"
//   },
//   {
//       "transaction_id": "324c348c-5769-49eb-b9f7-b83e0bd339cc",
//       "account_id": "fbf4a552-2418-46c5-b308-6094ddc493a1",
//       "amount": 10,
//       "created_at": "2024-05-09T10:55:06.155Z"
//   },
//   {
//       "transaction_id": "f37d2105-1ef7-476f-93a2-12ff202a96e5",
//       "account_id": "0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
//       "amount": 5,
//       "created_at": "2024-05-09T10:19:41.730Z"
//   },
//   {
//       "transaction_id": "78b08fb8-f736-4059-8208-f8f6a9a8c50d",
//       "account_id": "0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
//       "amount": 5,
//       "created_at": "2024-05-09T10:18:58.383Z"
//   },
//   {
//       "transaction_id": "c8519893-5c7f-4f89-b970-be4c6523cf3c",
//       "account_id": "0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
//       "amount": 10,
//       "created_at": "2024-05-09T08:15:16.561Z"
//   }
// ]

import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "transactions.json");
const dataAccountFilePath = path.join(process.cwd(), "data", "accounts.json");

export default async function handler(req, res) {
  //CORS (cross origin resource sharing)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    //preflight request to server to determine if actual request is safe to send, only for checking permissions: end
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "POST") {
      //creates new transaction
      await handlePostRequest(req, res);
    } else if (req.method === "GET") {
      //retrieves previous transaction details

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
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handlePostRequest(req, res) {
  const { account_id, amount } = req.body;

  if (!account_id || !isValidUUID(account_id) || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid request body" }); //the api end points validates the incoming data
  }
  let transactions = await readFromFile(dataFilePath);
  const transaction_id = generateUUID(); //transaction id is created

  const newTransaction = {
    transaction_id,
    account_id,
    amount,
    created_at: new Date().toISOString(),
  };

  transactions.push(newTransaction); //new transaction object is created and pushed in transactions database

  await writeToFile(dataFilePath, transactions);

  const accounts = await readFromFile(dataAccountFilePath); //simultaneously it reads the account details
  const accountIndex = accounts.findIndex(
    (item) => item.account_id === account_id
  );

  if (accountIndex > -1) { //-1 means it did not find the index, here it means that it found the account
    accounts[accountIndex].balance += amount; //balance is updated
  } else {
    accounts.push({ account_id, balance: amount }); //means that this is the first transaction for this account and first balance is added.
  }

  await writeToFile(dataAccountFilePath, accounts);

  res.status(201).json(newTransaction); //updated account balance is stored in the database of accounts
}

async function handleGetRequest(req, res) {
  let transactionsData = await readFromFile(dataFilePath);
  transactionsData = transactionsData
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.status(200).json(transactionsData); //displaying history in decending order of creation using the created at timestamp.
}

async function readFromFile(filePath) {
  const data = await fs.promises.readFile(filePath, "utf8"); // read the content of the file
  return JSON.parse(data);
}

async function writeToFile(filePath, data) {
  await fs.promises.writeFile(filePath, JSON.stringify(data)); // converts data object to JSON string
}

function isValidUUID(uuid) {
  //universally unique identifier
  const uuidRegex =
    /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i;
  return uuidRegex.test(uuid); //returns boolean
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}



//Q: more optimization-
//Implementing logging middleware to log request and response details could aid in debugging and monitoring the application.
//Depending on the scale and requirements of the application, introducing a database layer could improve data management
//and scalability compared to file-based storage.


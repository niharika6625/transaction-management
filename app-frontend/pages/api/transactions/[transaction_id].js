// pages/api/transactions/[transaction_id].js
//end point is designed to return transaction details by ID

// "get": {
//   "summary": "Returns the transaction by id.",
//   "parameters": [
//     {
//       "name": "transaction_id",
//       "in": "path",
//       "required": true,
//       "description": "Transaction ID",
//       "schema": {
//         "type": "string",
//         "format": "uuid"
//       },

// It expects a parameter named "transaction_id" in the path, which is required and must be of type "string" with a format of "uuid". 
//This means the transaction ID should be provided in the URL path.

//responses": {
  // "200": {
  //   "description": "Transaction details.",
  //   "content": {
  //     "application/json": {
  //       "schema": {
  //         "$ref": "#/components/schemas/Transaction"
  //       },
  //       "examples": {
  //         "TransactionWithPositiveAmount": {
  //           "$ref": "#/components/examples/TransactionWithPositiveAmount"
  //         },
  //         "TransactionWithNegativeAmount": {
  //           "$ref": "#/components/examples/TransactionWithNegativeAmount"
  //         }
  //       }
  //     }
  //   }
  // },
  // "400": {
  //   "description": "transaction_id missing or has incorrect type."
  // },
  // "404": {
  //   "description": "Transaction not found"
  // }

//200 OK: If the transaction is found, it returns the details of the transaction with a JSON schema referenced from "#/components/schemas/Transaction". 
//Examples of responses are also provided for transactions with positive and negative amounts.

// returning this : GET method 
// {
//   "transaction_id": "78b08fb8-f736-4059-8208-f8f6a9a8c50d",
//   "account_id": "0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
//   "amount": 5,
//   "created_at": "2024-05-09T10:18:58.383Z"
// }

import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'transactions.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { transaction_id } = req.query;

    fs.readFile(dataFilePath, 'utf8', (err, data) => { // 3rd argument as call back function, executed after the reading is finished
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' }); //default : if error in reading the file or parsing the data
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
    res.status(405).json({ error: 'Method Not Allowed' }); //if the method used is not GET
  }
}


//Q: What are the potential security risks associated with parsing user input (e.g., request query parameters) directly into JSON data?
  //One potential security risk is injection attacks, where malicious users can inject arbitrary JSON data into the 
  //request parameters to manipulate the server's behavior or access sensitive information. 
  //Another risk is Denial of Service (DoS) attacks, where large or malformed JSON payloads can overwhelm the server and 
  //cause it to become unresponsive.

//Q: How does the use of asynchronous file operations affect the performance and scalability of the server?
  //Asynchronous file operations allow the server to handle multiple requests concurrently without blocking the event loop. 
  //This improves the server's responsiveness and overall performance, especially under high load. However, 
  //excessive use of asynchronous operations can lead to increased memory consumption and CPU usage, which may affect scalability.
  
//Q: What are some alternative methods for handling asynchronous operations in Node.js?
  //Promises: Promises provide a cleaner and more readable syntax for handling asynchronous operations compared to callbacks. 
  //They allow for better error handling and chaining of asynchronous operations.
  //Async/await: Async/await is a modern JavaScript feature that allows for writing asynchronous code in a synchronous 
  //style using async functions and the await keyword. It simplifies error handling and makes asynchronous code easier to 
  //understand and debug.
  //Event emitters: Event emitters can be used to implement custom asynchronous event-driven patterns in Node.js, 
  //where actions are triggered by events and handled asynchronously using event listeners.


// implementing middleware functions for request logging and error handling can enhance monitoring and debugging capabilities,
// ensuring the smooth operation of the API
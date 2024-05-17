// pages/api/accounts/[account_id].js

// "/accounts/{account_id}": {
//   "get": {
//     "summary": "Returns the account data.",
//     "parameters": [
//       {
//         "name": "account_id",
//         "in": "path",
//         "required": true,
//         "description": "Account ID.",
//         "schema": {
//           "type": "string",
//           "format": "uuid"
//         },
//         "example": "5ba6e1b0-e3e7-483a-919a-a2fc17629a90"
//       }
//     ],
//     "responses": {
//       "200": {
//         "description": "Account data.",
//         "content": {
//           "application/json": {
//             "schema": {
//               "$ref": "#/components/schemas/Account"
//             },
//             "examples": {
//               "PositiveAccount": {
//                 "$ref": "#/components/examples/PositiveAccount"
//               },
//               "NegativeAccount": {
//                 "$ref": "#/components/examples/NegativeAccount"
//               }
//             }
//           }
//         }
//       },
//       "400": {
//         "description": "account_id missing or has incorrect type."
//       },
//       "404": {
//         "description": "Account not found."
//       }
//     }


//It expects a parameter named "account_id" in the path, which is required and must be of type "string" with a format of "uuid".
//This means the account ID should be provided in the URL path.

// returning this : details for particular account 
// {
//   "account_id": "0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
//   "balance": 0
// }

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

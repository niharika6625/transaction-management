// pages/api/accounts.js

import fs from 'fs'; //interact with file system in Node.js for file system operations, built.in modules from NODE.js(read content)
import path from 'path'; //path modules for handling file paths, built.in modules from NODE.js

const accountsFilePath = path.join(process.cwd(), 'data', 'accounts.json'); 
//constructs a file path to accounts.json , to contain account data
//cwd: returns the current working directory of Node js process

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try { //method responsible for reading accounts data from accounts.json and return it as response. 
      const accountsData = await fs.promises.readFile(accountsFilePath, 'utf-8');
      //This line asynchronously reads the content of the JSON file specified by accountsFilePath. 
      //It uses fs.promises.readFile() method, which returns a promise that resolves with the file content. 
      //It reads the file with 'utf-8' encoding to interpret the data as a string.

      const accounts = JSON.parse(accountsData); //converts the JSON string into javascript object
      res.status(200).json(accounts); //if everything is good, it send OK res in the form of json 
    } catch (error) { //try.catch block helps in error handling, prevent crashes
      console.error('Error fetching account data:', error); //suppose if JSON file is not found or error during parsing
      res.status(500).json({ error: 'Internal server error' });
    }
  } else { //if the method is not GET
    res.setHeader('Allow', ['GET']); //It sets the 'Allow' header to specify that only 'GET' requests are allowed
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

//   returning this [
//     {
//       "account_id": "0afd02d3-6c59-46e7-b7bc-893c5e0b7ac2",
//       "balance": 20
//   },
//   {
//       "account_id": "fbf4a552-2418-46c5-b308-6094ddc493a1",
//       "balance": 10
//   }
// ]

//Error handling ensures that if something wrong happens the server still returns appropriate error message 
//instead of crashing or returning invalid data

//currently I have shown only the GET method
//similar code blocks can be written for PUT, POST, DELETE, PATCH, UPDATE, handling each request method

//OPTIMIZATION : more code blocks for other HTTP methods
//more error handling with more informative error messages.
//test cases - method is get, parameters in GET method, file not found error message
 
//Q: why is the default method GET

//Q: How can you improve the performance in case of large files ? 
//real time database files like mongodb, sql, capable of handling big files
  // (If performance is a concern, you could consider using streaming APIs for file reading instead of reading 
  //the entire file into memory at once, especially for large files. 
  //Consider implementing caching mechanisms to reduce the frequency of file reads, especially if the JSON data doesn't change frequently.
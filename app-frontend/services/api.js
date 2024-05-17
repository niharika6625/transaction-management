import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchData = async (url, method = "get", data = null) => {
  const response = await axiosInstance({
    method,
    url,
    data,
  });

  return response;
};

export default fetchData;

//Q: what are the benefits of creating axios instance? 
  //avoid code repeatation 
  //a reusable and centralized way to fetch data from the API endpoints.

//Q: Why is asynchronous programming used in the fetchData function, and how does it work with Axios promises?
  //Asynchronous programming is used in the fetchData function to ensure that the HTTP requests do not block the execution 
  //of other code while waiting for a response from the server. This allows the application to remain responsive and handle
  //other tasks concurrently. Axios uses promises to handle asynchronous operations, allowing developers to use async/await
  //syntax to write asynchronous code in a more synchronous style. The fetchData function uses await to wait for the response 
  //from the server before continuing execution, and it returns a promise that resolves with the response data.
  
//Q: optimization -> Adding support for request cancellation to abort ongoing requests if needed. other ?
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
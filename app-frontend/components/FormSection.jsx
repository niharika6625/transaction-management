import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import fetchData from '../services/api';
import { API_PATH } from "../helpers/constants";

const { TRANSACTION } = API_PATH;

const validationSchema = Yup.object({
  account_id: Yup.string()
    .required('Account ID is required'),
  amount: Yup.number()
    .required('Amount is required')
});

const FormSection = ({ handleReload }) => {

  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      account_id: '',
      amount: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => { //async ensures that the UI remains responsive when the form is submitting
      fetchData(`/api${TRANSACTION}`, 'POST', { ...values, amount: Number(values.amount) }).then((res) => {
        formik.resetForm();
        setError('');
        handleReload();
      }).catch((error) => {
        console.error('Error fetching data:', error);
        setError('Account ID entered is invalid');
      })
    },
  });

  const { errors, touched, handleSubmit } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label htmlFor="account_id" className="block text-lg font-medium text-gray-700">Account ID</label>
        <input
          data-type="account-id"
          type="text"
          id="account_id"
          name="account_id"
          placeholder="Enter the account ID"
          value={formik.values.account_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
        />
        {errors.account_id && touched.account_id && <div className="text-red-500">{errors.account_id}</div>}
      </div>
      <div className="mb-2">
        <label htmlFor="amount" className="block text-lg font-medium text-gray-700">Amount</label>
        <input
          data-type="amount"
          type="text"
          id="amount"
          name="amount"
          placeholder="Enter amount in $"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full"
        />
        {errors.amount && touched.amount && <div className="text-red-500">{errors.amount}</div>}
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <input data-type="transaction-submit" type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" value="Submit" />
    </form>

  );
};

export default FormSection;

//form validation and formSubmission
//displays error messages
//invokes a function that tells the parent to reload the component to show the transaction table
//API calling for sending the new valid data to database file and returns response to client hence updating the UI

//The form submission process interacts with the server-side API by sending a POST request to a specific 
//endpoint (/api${TRANSACTION}) with the form data. The server-side API processes the request, validates the data, 
//performs any necessary operations (e.g., saving the transaction to a database), and returns a response to the client. 
//The client then handles the response, updating the UI accordingly.





//Q: What are the potential drawbacks of using inline form validation messages directly in the JSX?
    //Inline form validation messages directly in the JSX can clutter the code and make it harder to maintain,
    //especially if there are multiple form fields with different validation rules. 
    //It can also make the JSX less readable and increase the complexity of the component. 
    //Additionally, inline validation messages may not provide a consistent user experience across the application.
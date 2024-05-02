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
    onSubmit: async (values, { setSubmitting }) => {
      fetchData(`/api${TRANSACTION}`, 'POST', { ...values, amount: Number(values.amount) }).then((res) => {
        formik.resetForm();
        setError('');
        setSubmitting(false);
        handleReload();
      }).catch((error) => {
        console.error('Error fetching data:', error);
        setError('Account ID entered is invalid');
        setSubmitting(false);
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

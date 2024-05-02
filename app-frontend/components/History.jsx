import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_PATH } from "../helpers/constants";
import fetchData from '../services/api';

const { TRANSACTION, ACCOUNT } = API_PATH;

const History = ({ reload }) => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState({});

  useEffect(() => {
    handleDataLoad()
  }, [reload])

  const handleDataLoad = () => {
    fetchData(`/api${TRANSACTION}`).then((res) => {
      if (res.data && res.data.length) {
        getAccountDetails(res.data[0].account_id)
      }
      setTransactions(res.data);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    })
  }

  const getAccountDetails = (accountId) => {
    fetchData(`/api${ACCOUNT}/${accountId}`).then((res) => {
      setAccount(res.data);
    }).catch((error) => {
      console.error('Error fetching data:', error);
    })
  }

  const handleNavigate = (route, transaction_id) => {
    router.push(`/${route}/${transaction_id}`);
  }

  return (
    <div className="overflow-x-auto">
      {transactions.map((transaction, index) => (
        <div
          data-type="transaction"
          data-account-id={transaction.account_id}
          data-amount={transaction.amount}
          data-balance={account?.balance || transaction?.balance}
          data-transaction-id={transaction?.transaction_id}
          key={transaction.transaction_id}
          className={`p-4 transaction ${index % 2 === 0 ? 'bg-gray-100' : ''}`}
        >
          <div className="transaction-info">
            <div className="transaction-detail">
              <span className="detail-label font-bold">Date:</span>
              <span className="detail-value ml-2">{transaction.created_at}</span>
            </div>
            <div className="transaction-detail">
              <span className="detail-label font-bold">Account ID:</span>
              <span className="detail-value ml-2">{transaction.account_id}</span>
            </div>
            <div data-type="transaction-detail" className="transaction-detail cursor-pointer hover:underline"
              onClick={() => handleNavigate('transaction', transaction.transaction_id)}
            >
              <span className="detail-label font-bold">Transaction ID:</span>
              <span className="detail-value">{transaction.transaction_id}</span>
            </div>
            <div className="transaction-detail">
              <span className="detail-label font-bold">Amount:</span>
              <span className="detail-value ml-2">${transaction.amount}</span>
            </div>
            {(0 === index) && <div className="transaction-detail">
              <span className="detail-label font-bold">Balance:</span>
              <span className="detail-value ml-2">${account?.balance}</span>
            </div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;

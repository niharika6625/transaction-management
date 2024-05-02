import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { API_PATH } from "../../helpers/constants"

const { TRANSACTION } = API_PATH;


const TransactionDetails = () => {
  const router = useRouter();
  const [transaction, setTransaction] = useState({});

  useEffect(() => {
    const transactionId = router.query.transaction_id;
    fetch(`/api/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      return res.json();
    })
      .then((res) => {
        console.log('res', res);
        setTransaction(res);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [])

  return (
    <div className="overflow-x-auto m-4">
      <h1 className="text-4xl font-bold text-blue-500 pb-2">Transaction Details</h1>
      <div
        className={`p-4 transaction bg-gray-100`}
        data-type="transaction"
        data-account-id={transaction?.account_id}
        data-amount={transaction?.amount}
        data-balance={transaction?.created_at}
      >
        <div className="transaction-info">
          <div className="transaction-detail">
            <span className="detail-label font-bold">Date:</span>
            <span className="detail-value ml-2">{transaction?.created_at}</span>
          </div>
          <div className="transaction-detail">
            <span className="detail-label font-bold">Account ID:</span>
            <span className="detail-value ml-2">{transaction?.account_id}</span>
          </div>
          <div className="transaction-detail">
            <span className="detail-label font-bold">Transaction ID:</span>
            <span className="detail-value ml-2">{transaction?.transaction_id}</span>
          </div>
          <div className="transaction-detail">
            <span className="detail-label font-bold">Amount:</span>
            <span className="detail-value ml-2">${transaction?.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
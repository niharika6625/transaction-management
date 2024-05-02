import React, { useState, useEffect } from "react";
import FormSection from "./FormSection";
import History from "./History";

const TransactionPage = () => {
    const [reload, setReload] = useState(false);
    const [transactionData, setTransactionData] = useState({});

    useEffect(() => {
        if (reload) {
            const timeout = setTimeout(() => {
                setReload(false);
                setTransactionData({});
            }, 1);
            return () => clearTimeout(timeout);
        }
    }, [reload]);

    const handleReload = () => {
        setReload(true);
    }

    // const handleReload = () => {
    //     setReload(true);
    //     setTransactionData()
    //     setTimeout(() => {
    //         setReload(false)
    //     }, 1)
    // }

    return (
        <div className="flex flex-wrap items-start justify-around mt-6 sm:w-full border">
            <div className="p-6 mt-6 text-left max-w-4xl">
                <h3 className="text-2xl font-bold pb-4">Submit new transaction</h3>
                <FormSection handleReload={handleReload} />
            </div>

            <div className="p-6 mt-6 text-left flex-1">
                <h3 className="text-2xl font-bold pb-6">Transaction history</h3>
                <History reload={reload} transactionData={transactionData} />
            </div>
        </div>
    )
};

export default TransactionPage;
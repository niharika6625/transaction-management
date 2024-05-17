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
    }, [reload]); //when reload turns to true, we need to change it back to false for nect transactions

    const handleReload = () => { //this function is acting like a user event listener like refresh or submit button
        setReload(true);
    }

    return (
        <div className="flex flex-wrap items-start justify-around mt-6 sm:w-full border">
            <div className="p-6 mt-6 text-left max-w-4xl">
                <h3 className="text-2xl font-bold pb-4">Submit new transaction</h3>
                <FormSection handleReload={handleReload} /> 
                {/* by passing it in props, it can let the parent know that there is a new transaction, prompting reload. */}
            </div>

            <div className="p-6 mt-6 text-left flex-1">
                <h3 className="text-2xl font-bold pb-6">Transaction history</h3>
                <History reload={reload} transactionData={transactionData} />
            </div>
        </div>
    )
};

export default TransactionPage;

//Q: explain timeout ? clearTimeOut ? suppose we set a timer for 3 sec, the task doesn't finish then ?

//Q: Why is the timeout variable returned from the useEffect hook's cleanup function?
    //The timeout variable is returned from the useEffect hook's cleanup function to ensure that any pending timeouts are cleared 
    //when the component unmounts or when the reload state changes before the timeout completes. 
    //This prevents memory leaks and unexpected behavior by canceling the timeout if the component is no longer in use.

//Q: How does the useState hook differ from class-based component state?
    //The useState hook allows functional components to manage state without the need for class-based components. 
    //Unlike class-based component state, which is an object that can hold multiple state variables, 
    //the useState hook allows individual state variables to be declared independently within the functional component.

//Q: How would you optimize this code for better performance?
    //One optimization could be to debounce the handleReload function to prevent multiple rapid reload requests. 
    //Debouncing ensures that the reload request is only triggered after a specified delay, reducing unnecessary API calls.
    //Another optimization could be to implement lazy loading or pagination for transaction history to reduce the initial load 
    //time and improve overall performance.
    //Additionally, memoizing expensive calculations or computations within the component using useMemo or useCallback hooks 
    //could improve performance by avoiding unnecessary re-renders.

//Q:What are the potential drawbacks of using setTimeout for triggering state updates?
    //One potential drawback is that setTimeout is not guaranteed to execute exactly after the specified delay, 
    //as it depends on the browser's event loop and other factors. This can lead to inconsistent timing and performance issues 
    //in certain scenarios.
    //Using setTimeout for state updates can also lead to potential memory leaks if the component is unmounted before the 
    //timeout completes, as the callback function may still reference the component's state or props.
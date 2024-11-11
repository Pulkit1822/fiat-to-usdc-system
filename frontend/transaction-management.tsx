import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  exchangeRate: number;
  usdcAmount: number;
}

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    userId: '',
    amount: 0,
    currency: 'USD',
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/transaction', newTransaction);
      setTransactions((prev) => [...prev, response.data]);
      setNewTransaction({
        userId: '',
        amount: 0,
        currency: 'USD',
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div>
      <h1>Transaction Management</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            name="userId"
            value={newTransaction.userId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Currency:</label>
          <input
            type="text"
            name="currency"
            value={newTransaction.currency}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Create Transaction</button>
      </form>

      <h2>Transactions</h2>
      {transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Status</th>
              <th>Exchange Rate</th>
              <th>USDC Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{transaction.userId}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.status}</td>
                <td>{transaction.exchangeRate}</td>
                <td>{transaction.usdcAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionManagement;

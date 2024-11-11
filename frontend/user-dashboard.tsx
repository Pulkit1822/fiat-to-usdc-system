import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
  walletAddress: string;
  bankVerified: boolean;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  exchangeRate: number;
  usdcAmount: number;
}

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = 'user-id'; // Replace with actual user ID
        const userResponse = await axios.get(`/users/${userId}`);
        setUser(userResponse.data);

        const transactionsResponse = await axios.get(`/transactions?userId=${userId}`);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>KYC Status: {user.kycStatus}</p>
          <p>Wallet Address: {user.walletAddress}</p>
          <p>Bank Verified: {user.bankVerified ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <h2>Transactions</h2>
      {transactions.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
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

export default UserDashboard;

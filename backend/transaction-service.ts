import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { FiatDepositService } from './fiat-deposit-service';
import { USDCDistributionService } from './usdc-distribution-service';
import { TransactionStatusService } from './transaction-status-service';
import { ExchangeRateService } from './exchange-rate-service';
import { MultiCurrencyService } from './multi-currency-service';

const app = express();
app.use(bodyParser.json());

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  exchangeRate: number;
  usdcAmount: number;
}

const transactions: Transaction[] = [];

app.post('/transaction', async (req, res) => {
  const { userId, amount, currency } = req.body;
  const id = uuidv4();
  const exchangeRate = await ExchangeRateService.getExchangeRate(currency);
  const usdcAmount = amount * exchangeRate;
  const status = await FiatDepositService.detectDeposit(userId, amount, currency);

  const newTransaction: Transaction = {
    id,
    userId,
    amount,
    currency,
    status,
    exchangeRate,
    usdcAmount,
  };

  transactions.push(newTransaction);
  await USDCDistributionService.distributeUSDC(userId, usdcAmount);
  await TransactionStatusService.trackStatus(id, status);

  res.status(201).json(newTransaction);
});

app.get('/transactions', (req, res) => {
  res.status(200).json(transactions);
});

app.listen(3001, () => {
  console.log('Transaction service is running on port 3001');
});

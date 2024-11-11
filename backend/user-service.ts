import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { KYCService } from './kyc-service';
import { WalletService } from './wallet-service';
import { BankVerificationService } from './bank-verification-service';

const app = express();
app.use(bodyParser.json());

interface User {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
  walletAddress: string;
  bankVerified: boolean;
}

const users: User[] = [];

app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  const id = uuidv4();
  const kycStatus = await KYCService.verifyUser(id);
  const walletAddress = await WalletService.createWallet(id);
  const bankVerified = await BankVerificationService.verifyBankDetails(id);

  const newUser: User = {
    id,
    name,
    email,
    kycStatus,
    walletAddress,
    bankVerified,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.listen(3000, () => {
  console.log('User service is running on port 3000');
});

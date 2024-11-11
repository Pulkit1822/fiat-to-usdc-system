import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { MultiSigWalletService } from './multi-sig-wallet-service';
import { LiquidityPoolService } from './liquidity-pool-service';
import { RebalancingService } from './rebalancing-service';
import { RiskManagementService } from './risk-management-service';

const app = express();
app.use(bodyParser.json());

interface TreasuryOperation {
  id: string;
  type: string;
  status: string;
  details: any;
}

const operations: TreasuryOperation[] = [];

app.post('/treasury/operation', async (req, res) => {
  const { type, details } = req.body;
  const id = uuidv4();
  let status = 'pending';

  switch (type) {
    case 'multi-sig-wallet':
      status = await MultiSigWalletService.manageWallet(details);
      break;
    case 'liquidity-pool':
      status = await LiquidityPoolService.managePool(details);
      break;
    case 'rebalancing':
      status = await RebalancingService.rebalance(details);
      break;
    case 'risk-management':
      status = await RiskManagementService.manageRisk(details);
      break;
    default:
      status = 'unknown operation type';
  }

  const newOperation: TreasuryOperation = {
    id,
    type,
    status,
    details,
  };

  operations.push(newOperation);
  res.status(201).json(newOperation);
});

app.get('/treasury/operations', (req, res) => {
  res.status(200).json(operations);
});

app.listen(3002, () => {
  console.log('Treasury service is running on port 3002');
});

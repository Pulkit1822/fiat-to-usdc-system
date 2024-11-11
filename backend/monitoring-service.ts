import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { TransactionMonitoringService } from './transaction-monitoring-service';
import { AlertManagementService } from './alert-management-service';
import { ReportingService } from './reporting-service';
import { AnalyticsService } from './analytics-service';

const app = express();
app.use(bodyParser.json());

interface MonitoringEvent {
  id: string;
  type: string;
  status: string;
  details: any;
}

const events: MonitoringEvent[] = [];

app.post('/monitoring/event', async (req, res) => {
  const { type, details } = req.body;
  const id = uuidv4();
  let status = 'pending';

  switch (type) {
    case 'transaction-monitoring':
      status = await TransactionMonitoringService.monitorTransaction(details);
      break;
    case 'alert-management':
      status = await AlertManagementService.manageAlert(details);
      break;
    case 'reporting':
      status = await ReportingService.generateReport(details);
      break;
    case 'analytics':
      status = await AnalyticsService.analyzeData(details);
      break;
    default:
      status = 'unknown event type';
  }

  const newEvent: MonitoringEvent = {
    id,
    type,
    status,
    details,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
});

app.get('/monitoring/events', (req, res) => {
  res.status(200).json(events);
});

app.listen(3003, () => {
  console.log('Monitoring service is running on port 3003');
});

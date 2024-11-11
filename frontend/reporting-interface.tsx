import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Report {
  id: string;
  type: string;
  status: string;
  generatedAt: string;
  details: any;
}

const ReportingInterface: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [newReportType, setNewReportType] = useState<string>('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReportType(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/report', { type: newReportType });
      setReports((prev) => [...prev, response.data]);
      setNewReportType('');
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div>
      <h1>Reporting Interface</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Report Type:</label>
          <input
            type="text"
            value={newReportType}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Generate Report</button>
      </form>

      <h2>Generated Reports</h2>
      {reports.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Generated At</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.type}</td>
                <td>{report.status}</td>
                <td>{report.generatedAt}</td>
                <td>{JSON.stringify(report.details)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reports found.</p>
      )}
    </div>
  );
};

export default ReportingInterface;

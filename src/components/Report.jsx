import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function Report() {
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [sessionType, setSessionType] = useState('');

  // Sample data for performance overview
  const departmentPerformance = [
    { department: 'Sales', score: 85 },
    { department: 'Marketing', score: 78 },
    { department: 'Engineering', score: 92 },
  ];

  const performanceOptions = {
    chart: {
      type: 'bar',
    },
    title: {
      text: 'Department Performance Overview',
    },
    xAxis: {
      categories: departmentPerformance.map((dept) => dept.department),
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Performance Score',
      },
    },
    series: [
      {
        name: 'Performance Score',
        data: departmentPerformance.map((dept) => dept.score),
      },
    ],
  };

  // Sample data for xWallet Transactions
  const transactions = [
    { employee: 'Alice', type: 'Credit', date: '2024-09-10', amount: 500 },
    { employee: 'Bob', type: 'Debit', date: '2024-09-12', amount: 200 },
    { employee: 'Charlie', type: 'Credit', date: '2024-09-13', amount: 400 },
  ];

  // Sample data for Withdraw Requests
  const withdrawRequests = [
    { employee: 'David', type: 'Money', amount: 1000, status: 'Pending' },
    { employee: 'Emma', type: 'Vouchers', amount: 300, status: 'Approved' },
    { employee: 'John', type: 'Money', amount: 500, status: 'Rejected' },
  ];

  const handleApprove = (index) => {
    console.log(`Approve withdraw request for index ${index}`);
  };

  const handleReject = (index) => {
    console.log(`Reject withdraw request for index ${index}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-white p-6">
        {/* Sidebar content */}
        <div className="mb-4">
          <label htmlFor="fromDate" className="block text-gray-700 font-medium">From Date</label>
          <input
            type="date"
            id="fromDate"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="toDate" className="block text-gray-700 font-medium">To Date</label>
          <input
            type="date"
            id="toDate"
            className="w-full p-2 mt-1 border border-gray-300 rounded"
          />
        </div>

        <hr className="my-4" />

        <div className="mb-2">
          <label className="block text-gray-700 font-medium">Select a Report</label>
        </div>

        {/* Report Buttons */}
        <div className="space-y-2">
          <button className="w-full bg-gray-100 p-2 rounded text-gray-700 hover:bg-gray-200">Performance Overview</button>
          <button className="w-full bg-gray-100 p-2 rounded text-gray-700 hover:bg-gray-200">xWallet Transactions</button>
          <button className="w-full bg-gray-100 p-2 rounded text-gray-700 hover:bg-gray-200">Withdraw Requests</button>
          <button className="w-full bg-gray-100 p-2 rounded text-gray-700 hover:bg-gray-200">Session Reports</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-3/4 p-8 bg-gray-100 h-screen overflow-y-auto hide-scrollbar">
        {/* HR Admin Report Content */}
        <h2 className="text-2xl font-bold mb-4">HR Admin Report</h2>
        {/* Filters */}
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-gray-700">Department</label>
            <select
              className="border border-gray-300 p-2 rounded"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700">Date Range</label>
            <input
              type="date"
              className="border border-gray-300 p-2 rounded"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Session Type</label>
            <select
              className="border border-gray-300 p-2 rounded"
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value)}
            >
              <option value="">All</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
          </div>
        </div>

        {/* Performance Overview (Bar Chart) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <HighchartsReact highcharts={Highcharts} options={performanceOptions} />
        </div>

        {/* xWallet Transactions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h3 className="text-xl font-bold mb-4">xWallet Transactions</h3>
          <table className="min-w-full bg-white text-center">
            <thead>
              <tr>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Transaction Type</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trans, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{trans.employee}</td>
                  <td className="border px-4 py-2">{trans.type}</td>
                  <td className="border px-4 py-2">{trans.date}</td>
                  <td className="border px-4 py-2">{trans.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Withdraw Requests */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Withdraw Requests</h3>
          <table className="min-w-full bg-white text-center">
            <thead>
              <tr>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Withdraw Type</th>
                <th className="border px-4 py-2">Requested Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawRequests.map((request, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{request.employee}</td>
                  <td className="border px-4 py-2">{request.type}</td>
                  <td className="border px-4 py-2">{request.amount}</td>
                  <td className={`border px-4 py-2 ${request.status === 'Pending' ? 'text-yellow-500' : request.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
                    {request.status}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {request.status === 'Pending' && (
                      <>
                        <button
                          className="bg-green-500 inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-white rounded-full"
                          onClick={() => handleApprove(index)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-white rounded-full"
                          onClick={() => handleReject(index)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { FaPlusCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function WithdrawaRequest() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawType, setWithdrawType] = useState('liquid_money');
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State for pagination

  const withdrawals = [
    { method: 'Amazon Voucher', requestedOn: '25 September 2024 09:00 AM', amount: '£150', status: 'Pending' },
    { method: 'Liquid Money', requestedOn: '12 August 2024 02:30 PM', amount: '£500', status: 'Approved' },
    { method: 'Paga Voucher', requestedOn: '01 July 2024 11:15 AM', amount: '£200', status: 'Rejected' },
    { method: 'Liquid Money', requestedOn: '10 June 2024 10:00 AM', amount: '£350', status: 'Approved' },
    { method: 'Amazon Voucher', requestedOn: '5 May 2024 08:30 AM', amount: '£400', status: 'Pending' },
  ];

  const withdrawalsPerPage = 5; // Number of withdrawals per page
  const indexOfFirstWithdrawal = (currentPage - 1) * withdrawalsPerPage;
  const currentWithdrawals = withdrawals.slice(indexOfFirstWithdrawal, indexOfFirstWithdrawal + withdrawalsPerPage);
  const totalPages = Math.ceil(withdrawals.length / withdrawalsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Amount:', withdrawAmount);
    console.log('Withdraw Type:', withdrawType);
    togglePopup(); // Close popup after submission
  };

  const togglePopup = () => {
    setShowPopup(!showPopup); // Toggle the popup visibility
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Withdraw Request</h3>
        <button
          onClick={() => {
            togglePopup();
          }}
          className="bg-gray-800 text-white py-2 px-4 rounded-full flex items-center hover:bg-gray-700 transition duration-200"
        >
          <FaPlusCircle className="text-white text-lg mr-2" />
          Withdraw Request
        </button>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg relative">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Withdraw Request</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdraw Amount
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdraw Type
                </label>
                <select
                  value={withdrawType}
                  onChange={(e) => setWithdrawType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="liquid_money">Liquid Money</option>
                  <option value="amazon_voucher">Amazon Voucher</option>
                  <option value="paga_voucher">Paga&Pagi Voucher</option>
                </select>
              </div>

              <button
                type="submit"
                className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition w-full"
              >
                Submit Request
              </button>
            </form>

            <button
              onClick={togglePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* Withdraw History Table with Pagination */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-700 p-6">Withdraw History</h2>
        <table className="min-w-full">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-3 px-4 text-left text-gray-600">Sl No</th>
              <th className="py-3 px-4 text-left text-gray-600">Withdrawal Method</th>
              <th className="py-3 px-4 text-left text-gray-600">Requested On</th>
              <th className="py-3 px-4 text-left text-gray-600">Amount</th>
              <th className="py-3 px-4 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentWithdrawals.map((withdrawal, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{indexOfFirstWithdrawal + index + 1}</td>
                <td className="py-3 px-4">{withdrawal.method}</td>
                <td className="py-3 px-4">{withdrawal.requestedOn}</td>
                <td className="py-3 px-4">{withdrawal.amount}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-white rounded-full ${
                      withdrawal.status === 'Approved'
                        ? 'bg-green-600 text-white'
                        : withdrawal.status === 'Pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {withdrawal.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-end items-center mt-4 px-6 pb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          >
            <FaChevronLeft />
          </button>
          <div className="px-4">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { HiX } from "react-icons/hi";

export default function Dashboard() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleDateRangeClick = () => {
    setShowDatePicker(true);
  };

  const handleOkClick = () => {
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);
    setShowDatePicker(false);
  };

  const topPerformers = [
    { name: "John Doe", project: "Project A", department: "Development", designation: "Senior Dev", rating: 5 },
    { name: "Jane Smith", project: "Project B", department: "Marketing", designation: "Manager", rating: 4.5 },
    { name: "Alice Johnson", project: "Project C", department: "Design", designation: "Lead Designer", rating: 4.7 },
  ];

  const worstPerformers = [
    { name: "Michael Scott", project: "Project X", department: "Sales", designation: "Sales Manager", rating: 2 },
    { name: "Dwight Schrute", project: "Project Y", department: "Sales", designation: "Assistant to the Manager", rating: 2.5 },
    { name: "Jim Halpert", project: "Project Z", department: "Sales", designation: "Sales Rep", rating: 3 },
  ];

  const generateAlias = (name) => {
    const [first, last] = name.split(" ");
    return `${first[0]}${last[0]}`;
  };

  return (
    <div className="container mx-auto p-4">
      {/* Top Section */}
      <div className="flex justify-between mb-6">
        <h3 className="text-2xl font-bold">Hi, welcome back!</h3>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded bg-white text-gray-600 flex items-center">
            <option>Departments</option>
            <option>Development</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>
          <select className="border border-gray-300 rounded bg-white text-gray-600 flex items-center">
            <option>Project</option>
            <option>Development</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>
          <select className="border border-gray-300 rounded bg-white text-gray-600 flex items-center">
            <option>Session</option>
            <option>Development</option>
            <option>Design</option>
            <option>Marketing</option>
          </select>
          <select
            className="border border-gray-300 rounded bg-white text-gray-600 flex items-center"
            onChange={(e) => {
              if (e.target.value === "dateRange") {
                handleDateRangeClick();
              }
            }}
          >
            <option>Latest Report</option>
            <option value="dateRange">Date Range</option>
          </select>
          <button className="btn btn-sm bg-gray-500 text-white px-3 py-1">Apply</button>
        </div>
      </div>

      {/* Date Picker */}
      {showDatePicker && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6">
            <h3 className="text-lg font-bold mb-4">Select Date Range</h3>
            <div className="flex mb-4 space-x-4">
              <div className="flex-1">
                <label className="block mb-1">From Date:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">To Date:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 rounded w-full p-2"
                />
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-6 py-2 text-green-500 rounded-full flex items-center"
              >
                <HiX />
                Cancel
              </button>
              <button onClick={handleOkClick} className="px-6 py-2 bg-green-500 text-white rounded-full">
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Performers */}
      <div className="flex space-x-4">
        <div className="w-1/3">
          <h3 className="text-lg font-bold mb-4">Top Performers</h3>
          <div className="grid gap-2">
            {topPerformers.map((employee, index) => (
              <div key={index} className="bg-white p-4 rounded shadow-md flex items-center">
                {/* Alias with circular background */}
                <div className="w-16 h-16 flex items-center justify-center bg-[#c3b7a4] rounded-full">
                  <span className="text-xl font-medium text-white">{generateAlias(employee.name)}</span>
                </div>
                {/* Employee details */}
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-bold">{employee.name}</h3>
                  <p className="text-sm">Project: {employee.project}</p>
                  <p className="text-sm">Department: {employee.department}</p>
                  <p className="text-sm">Designation: {employee.designation}</p>
                </div>
                {/* Rating */}
                <div className="flex items-center ml-4">
                  <div className="w-px h-12 bg-gray-300 mx-4"></div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{employee.rating}</h3>
                    <p className="text-sm">Rating</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Worst Performers */}
        <div className="w-1/3">
          <h3 className="text-lg font-bold mb-4">Worst Performers</h3>
          <div className="grid gap-2">
            {worstPerformers.map((employee, index) => (
              <div key={index} className="bg-white p-4 rounded shadow-md flex items-center">
                {/* Alias with circular background */}
                <div className="w-16 h-16 flex items-center justify-center bg-[#c3b7a4] rounded-full">
                  <span className="text-xl font-medium text-white">{generateAlias(employee.name)}</span>
                </div>
                {/* Employee details */}
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-bold">{employee.name}</h3>
                  <p className="text-sm">Project: {employee.project}</p>
                  <p className="text-sm">Department: {employee.department}</p>
                  <p className="text-sm">Designation: {employee.designation}</p>
                </div>
                {/* Rating */}
                <div className="flex items-center ml-4">
                  <div className="w-px h-12 bg-gray-300 mx-4"></div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{employee.rating}</h3>
                    <p className="text-sm">Rating</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/3">
          <div className="card bg-white shadow-md rounded-lg overflow-hidden mt-4 w-full">
            <div className="card-body p-4">
              <div className="card-title font-medium text-lg">Team Performance</div>
              {topPerformers.map((employee, index) => (
                <div key={index} className="flex flex-wrap border-b py-2 justify-between items-center">
                  <div className="w-16 h-16 flex items-center justify-center bg-[#c3b7a4] rounded-full">
                    <span className="text-xl font-medium text-white">{generateAlias(employee.name)}</span>
                  </div>
                  <div className="pt-2 flex-1 ml-4">
                    <h5 className="mb-0 text-lg font-medium">{employee.name}</h5>
                    <p className="mb-0 text-gray-500">{employee.department}</p>
                    <h5 className="mb-0 text-lg font-medium">{employee.project}</h5>
                  </div>
                </div>
              ))}
              <a className="text-black mt-3 block font-medium h6 hover:underline" href="#">
                View all <i className="mdi mdi-chevron-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

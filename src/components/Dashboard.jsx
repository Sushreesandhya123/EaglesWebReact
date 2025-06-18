import React, { useState, useEffect } from 'react';
import { IoSunnyOutline } from "react-icons/io5";  
import logoImage from '../assets/people.svg';
import { FiBarChart2, FiActivity, FiCheckCircle } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]); 
  const [showAllParams, setShowAllParams] = useState({}); 
  const [sessionData, setSessionData] = useState({
    total_sessions: 0,
    active_sessions: 0,
    closed_sessions: 0
  });

  useEffect(() => {
    const managerId = JSON.parse(localStorage.getItem('manager_id'));

    const fetchData = async () => {
      try {
       
        const sessionResponse = await fetch(`http://localhost:8000/Session/dashboard/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch session data');
        }
        
        const sessionData = await sessionResponse.json();
        setSessionData({
          total_sessions: sessionData.total_sessions,
          active_sessions: sessionData.active_sessions,
          closed_sessions: sessionData.closed_sessions
        });
        const response = await fetch(`http://localhost:8000/SessionEntry/manager-dashboard/${managerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleShowAll = (index) => {
    setShowAllParams(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  return (
    <div className="flex flex-col p-8">
      <div className="section-body mb-4">
        <h3 className="font-bold text-3xl">Good Morning, Eagles!</h3>
        <p>
          Measure How Fast You’re Growing Monthly Recurring Revenue.
          <a href="fake_url">Learn More</a>
        </p>
      </div>

      <div className="flex w-full">
        <div className="w-1/3 p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-end p-6 bg-blue-100">
              <img src={logoImage} alt="people" className="w-100 h-100" />
              <div className="ml-[-180px] mb-[12rem]">
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-normal">
                    <IoSunnyOutline className="inline-block mr-2" />
                    31<sup>°C</sup>
                  </h2>
                </div>
                <h4 className="font-normal">Hyderabad</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/3 p-4 grid grid-cols-2 gap-4">
          <div className="bg-[#5e50f991] text-white rounded-lg shadow-lg p-4 flex justify-between items-center">
            <div>
              <p className="mb-4 text-xl font-semibold">Total Sessions</p>
              <p className="text-4xl mb-2 font-bold">{sessionData.total_sessions}</p>
            </div>
            <FiBarChart2 className="text-5xl" />
          </div>

          <div className="bg-[#6610f2ab] text-white rounded-lg shadow-lg p-4 flex justify-between items-center">
            <div>
              <p className="mb-4 text-xl font-semibold">Active Sessions</p>
              <p className="text-4xl mb-2 font-bold">{sessionData.active_sessions}</p>
            </div>
            <FiActivity className="text-5xl" />
          </div>

          <div className="bg-[#6a008aab] text-white rounded-lg shadow-lg p-4 flex justify-between items-center">
            <div>
              <p className="mb-4 text-xl font-semibold">Completed Sessions</p>
              <p className="text-4xl mb-2 font-bold">{sessionData.closed_sessions}</p>
            </div>
            <FiCheckCircle className="text-5xl" />
          </div>

          <div className="bg-[#ff4747ab] text-white rounded-lg shadow-lg p-4 flex justify-between items-center">
            <div>
              <p className="mb-4 text-xl font-semibold">xWallet Balance</p>
              <p className="text-4xl mb-2 font-bold">47</p>
            </div>
            <FaRupeeSign className="text-5xl" />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h5 className="text-xl font-bold">My Team Performance</h5>
        <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#7955482b] text-black">
              <th className="py-3 px-4 font-semibold text-left">Employee Name</th>
              <th className="py-3 px-4 font-semibold text-left">Performance Parameter Name</th>
              <th className="py-3 px-4 font-semibold text-left">Rating</th>
              <th className="py-3 px-4 font-semibold text-left">Comments</th>
              <th className="py-3 px-4 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? employees.map((employee, empIndex) => {
              const isShowAll = showAllParams[empIndex];
              return (
                <React.Fragment key={empIndex}>
                  {isShowAll ? (
                    employee.performance_entries && employee.performance_entries.map((entry, entryIndex) => (
                      <tr 
                        key={`${empIndex}-${entryIndex}`} 
                        className={`text-left ${entryIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition-all duration-300`}
                      >
                        {entryIndex === 0 && (
                          <td rowSpan={employee.performance_entries.length} className="py-3 px-4 font-medium text-blue-900 border-r border-gray-200">
                            {employee.employee_name}
                          </td>
                        )}
                        <td className="py-3 px-4 text-gray-800 border-r border-gray-200">{entry.parameter_name}</td>
                        <td className="py-3 px-4 text-gray-800 border-r border-gray-200">{entry.rating}</td>
                        <td className="py-3 px-4 text-gray-800">{entry.comments}</td>
                        <td className="py-3 px-4 text-gray-800">
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-left">
                      <td className="py-3 px-4 font-medium text-blue-900 border-r border-gray-200">
                        {employee.employee_name}
                      </td>
                      <td className="py-3 px-4 text-gray-800 border-r border-gray-200">{employee.performance_entries && employee.performance_entries[0]?.parameter_name}</td>
                      <td className="py-3 px-4 text-gray-800 border-r border-gray-200">{employee.performance_entries && employee.performance_entries[0]?.rating}</td>
                      <td className="py-3 px-4 text-gray-800">{employee.performance_entries && employee.performance_entries[0]?.comments}</td>
                      <td className="py-3 px-4 text-gray-800">
                        <button 
                          className="text-blue-500 hover:underline"
                          onClick={() => toggleShowAll(empIndex)}
                        >
                          View All
                        </button>
                      </td>
                    </tr>
                  )}
                  {isShowAll && (
                    <tr>
                      <td colSpan="5" className="py-3 px-4 text-gray-800 text-center">
                        <button 
                          className="text-blue-500 hover:underline"
                          onClick={() => toggleShowAll(empIndex)}
                        >
                          View Less
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            }) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-gray-800 text-center">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

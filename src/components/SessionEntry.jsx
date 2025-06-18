import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import NoDataImage from '../assets/norecord.svg';

export default function SessionEntry() {
  const [parameters, setParameters] = useState([]);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submittedEmployees, setSubmittedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [comments, setComments] = useState({});
  const maxLength = 50;

  useEffect(() => {
    // Fetch employees
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token is undefined.');
          return;
        }
        const response = await fetch('http://127.0.0.1:8000/Employee/manager-employees/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch employee details');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Fetch parameters
    const fetchParameters = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/PerformanceParameter/parameters');
        if (!response.ok) throw new Error('Failed to fetch parameters');
        const data = await response.json();
        setParameters(data);
      } catch (error) {
        console.error('Error fetching parameters:', error);
      }
    };
    fetchParameters();
  }, []);

  const toggleEmployeeDetails = (emp) => {
    setExpandedEmployee((prev) => (prev === emp ? null : emp));
  };

  const selectEmployee = (emp) => {
    setSelectedEmployee((prev) => (prev === emp ? null : emp)); // Toggle selection
    localStorage.setItem('selected_employee_id', emp?.emp_id || '');
  };

  const handleCommentChange = (parameterId, value) => {
    setComments((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionId = parseInt(localStorage.getItem('session_id'), 10);
    const empId = parseInt(localStorage.getItem('selected_employee_id'), 10);

    if (!sessionId || !empId) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please select an employee and ensure the session ID is valid.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Check if performance data has already been submitted for this employee
    if (submittedEmployees.includes(selectedEmployee)) {
      Swal.fire({
        icon: 'info',
        title: 'Performance parameters for this employee have already been submitted',
        text: 'Please select a different employee.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const ratings = parameters.map((parameter) => ({
      parameter_id: parameter.parameter_id,
      rating: parseInt(e.target[`rating-${parameter.parameter_id}`]?.value, 10) || 0,
      comments: comments[parameter.parameter_id] || "",
    })).filter(param => param.rating > 0 || param.comments !== "");

    if (ratings.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete data',
        text: 'Please provide ratings or comments before submitting.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const performanceData = {
      session_id: sessionId,
      emp_id: empId,
      ratings
    };

    console.log("Submitting performance data:", performanceData);

    try {
      const response = await fetch('http://localhost:8000/SessionEntry/sessionentry/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(performanceData),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        // Check for a specific error message from the server
        const errorData = await response.json();
        if (errorData.detail === 'Performance parameters for this employee have already been submitted.') {
          Swal.fire({
            icon: 'info',
            title: 'Performance Already Submitted',
            text: 'Performance parameters for this employee have already been submitted for this session.',
            confirmButtonText: 'OK'
          });
          return;  // Stop further processing if already submitted
        } else {
          throw new Error('Failed to submit performance data');
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Form submitted successfully!',
        confirmButtonText: 'OK'
      });
      setSubmittedEmployees((prev) => [...prev, selectedEmployee]);
      setComments({});
      setSelectedEmployee(null);
      localStorage.removeItem('selected_employee_id');
    } catch (error) {
      console.error('Error submitting performance data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error submitting the form. Please try again.',
        confirmButtonText: 'OK'
      });
    }
};


  // Clear submitted employees when the component unmounts or when navigating away
  useEffect(() => {
    return () => {
      setSubmittedEmployees([]);
    };
  }, []);

  return (
    <div className="flex flex-wrap h-full min-h-screen">
      <div className="w-full md:w-3/12 h-full">
        <div className="card bg-[#f3f6fc] h-full flex flex-col overflow-hidden shadow-lg">
          <div className="card-body p-2 flex-grow">
            <div className="mb-4 text-center mt-3">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Session Entry Form</h2>
              <hr className="border-t-2 border-gray-300 mb-4" />
            </div>

            <div className="space-y-2">
              {employees.length > 0 ? employees.map((emp) => (
                <div key={emp.employee_id} className="p-4 bg-[#c3b7a4] flex flex-col rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold cursor-pointer" onClick={() => selectEmployee(emp)}>{emp.employee_name}</span>
                    <div className="flex items-center">
                      {submittedEmployees.includes(emp) && <FaCheckCircle className="text-green-600 mr-2" />}
                      <span className="text-gray-800 cursor-pointer" onClick={() => toggleEmployeeDetails(emp)}>{expandedEmployee === emp ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedEmployee === emp && (
                    <div className="mt-2 p-2 text-white">
                      <p>Employee ID: {emp.employee_id}</p>
                      <p>Designation: {emp.designation}</p>
                      <p>Manager: {emp.manager_name}</p>
                    </div>
                  )}
                </div>
              )) : (
                <div className="flex flex-col items-center">
                  <img src={NoDataImage} alt="No Data" className="w-32 h-32 mb-4" />
                  <p>No employees found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-9/12 h-full">
        <div className="card bg-white h-full flex flex-col overflow-hidden">
          <div className="card-header flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-xl font-semibold" id="reportTitle">
              {selectedEmployee ? `Entry Performance Parameter for ${selectedEmployee.employee_name}` : 'Entry Performance Parameter for Employee'}
            </h2>
          </div>
          <div className="card-body flex-grow flex flex-col">
            {selectedEmployee ? (
              <form onSubmit={handleSubmit} className="w-full flex-grow flex flex-col">
                <div className="flex-grow overflow-auto">
                  <table className="bg-white border border-gray-200 w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 text-gray-600 font-medium">Parameters Name</th>
                        <th className="text-left p-4 text-gray-600 font-medium">Rating</th>
                        <th className="text-left p-4 text-gray-600 font-medium">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameters.map((parameter) => (
                        <tr key={parameter.parameter_id} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="p-4">{parameter.name}</td>
                          <td className="p-4">
                            <select name={`rating-${parameter.parameter_id}`} className="border border-gray-300 w-20 px-2 py-1 rounded" defaultValue="0">
                              {Array.from({ length: (parameter.max_rating - parameter.min_rating + 1) }, (_, index) => parameter.min_rating + index).map((value) => (
                                <option key={value} value={value}>{value}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4">
                            <textarea
                              name={`comments-${parameter.parameter_id}`}
                              className="border border-gray-300 p-2 w-full rounded"
                              placeholder="Enter Comments"
                              maxLength={maxLength}
                              value={comments[parameter.parameter_id] || ""}
                              onChange={(e) => handleCommentChange(parameter.parameter_id, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end p-4 border-t border-gray-300">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow">
                <img src={NoDataImage} alt="No Data" className="w-32 h-32 mb-4" />
                <p className="text-gray-600">Please select an employee to enter performance parameters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

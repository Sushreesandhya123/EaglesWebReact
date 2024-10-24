import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function SessionEntry() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [quillValue, setQuillValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [parameters, setParameters] = useState([]); // State for performance parameters
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [submittedEmployees, setSubmittedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]); // Store fetched employees here
  const maxLength = 50;

  // Fetch employee details based on the manager's full name and role
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const managerFullName = localStorage.getItem('fullName');
        const managerRole = localStorage.getItem('userRole');
        
        console.log('Manager Full Name:', managerFullName); // Check if this is null or undefined
        console.log('Manager Role:', managerRole); //
     // Replace with actual value if dynamic

        // Ensure managerFullName and managerRole are defined before making the request
        if (!managerFullName || !managerRole) {
          console.error('Manager full name or role is undefined.');
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/SessionEntry/employees/manager?manager_full_name=${managerFullName}&manager_role=${managerRole}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }

        const data = await response.json();
        setEmployees(data); // Store the fetched employees
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch performance parameters
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/PerformanceParameter/parameters');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setParameters(data); // Set the fetched parameters in the state
      } catch (error) {
        console.error('Error fetching parameters:', error);
      }
    };

    fetchParameters();
  }, []);

  const handleInputClick = () => {
    setIsPopupOpen(true);
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const handleOkClick = () => {
    setIsPopupOpen(false);
    setInputValue(stripHtml(quillValue));
  };

  const toggleEmployeeDetails = (emp) => {
    setExpandedEmployee((prev) => (prev === emp ? null : emp));
  };

  const selectEmployee = (emp) => {
    setSelectedEmployee(emp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the POST request
    const performanceData = {
        employeeId: selectedEmployee?.employee_id,
        parameters: parameters.map((parameter) => ({
            parameter_id: parameter.parameter_id, // Ensure parameter_id is set
            rating: parseInt(e.target[`rating-${parameter.parameter_id}`]?.value, 10) || 0, // Default to 0 if undefined
            comments: e.target[`comments-${parameter.parameter_id}`]?.value || "", // Get comments from input field
        })).filter(param => param.rating > 0 || param.comments !== ""), // Filter out parameters without ratings or comments
    };

    // Log the data being sent for debugging
    console.log('Submitting performance data:', performanceData);

    try {
        const response = await fetch('http://127.0.0.1:8000/SessionEntry/session-entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(performanceData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Response error:', errorText);
            throw new Error('Failed to submit performance data');
        }

        const result = await response.json();
        setSubmittedEmployees((prev) => [...prev, selectedEmployee]);
        alert('Form submitted successfully!');

        // Reset form fields
        setInputValue('');
        setQuillValue('');
        setSelectedEmployee(null);
    } catch (error) {
        console.error('Error submitting performance data:', error);
    }
};

  
  
  

  return (
    <div className="flex flex-wrap h-full min-h-screen">
      <div className="w-full md:w-3/12 h-full">
        <div className="card bg-[#f3f6fc] h-full flex flex-col overflow-hidden shadow-lg">
          <div className="card-body p-2 flex-grow">
            {/* Session Entry Form Title */}
            <div className="mb-4 text-center mt-3">
              <h2 className="text-lg font-bold text-gray-700 mb-2">Session Entry Form</h2>
              <hr className="border-t-2 border-gray-300 mb-4" />
            </div>

            {/* Session Name */}
            <div className="mb-4 text-center">
              <h2 className="text-md font-bold text-gray-700 mb-2">Session Name</h2>
              <hr className="border-t-2 border-gray-300 mb-4" />
            </div>

            {/* Employee Divs */}
            <div className="space-y-2">
              {employees.length > 0 ? employees.map((emp) => (
                <div 
                  key={emp.employee_id} 
                  className="p-4 bg-[#c3b7a4] flex flex-col rounded-lg shadow-md"
                >
                  {/* Employee Name */}
                  <div className="flex justify-between items-center">
                    <span 
                      className="text-white font-semibold cursor-pointer" 
                      onClick={() => selectEmployee(emp)}
                    >
                      {emp.employee_name}
                    </span>

                    <div className="flex items-center">
                      {submittedEmployees.includes(emp) && (
                        <FaCheckCircle className="text-green-600 mr-2" />
                      )}
                      
                      <span 
                        className="text-gray-800 cursor-pointer" 
                        onClick={() => toggleEmployeeDetails(emp)}
                      >
                        {expandedEmployee === emp ? '▲' : '▼'}
                      </span>
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
              )) : <p>No employees found</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-9/12 h-full">
        <div className="card bg-white h-full flex flex-col overflow-hidden">
          <div className="card-header flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="text-xl font-semibold" id="reportTitle">Entry Performance Parameter for Employee</h2>
          </div>
          <div className="card-body flex-grow flex flex-col">
            {selectedEmployee !== null ? (
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
                            <select
                              name={`rating-${parameter.parameter_id}`} // Give each select a unique name
                              className="border border-gray-300 w-20 px-2 py-1 rounded"
                              defaultValue="0"
                            >
                              {Array.from({ length: (parameter.max_rating - parameter.min_rating + 1) }, (_, index) => parameter.min_rating + index).map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4">
                            <div
                              className="border border-gray-300 p-2 w-full cursor-pointer"
                              onClick={handleInputClick}
                            >
                              {inputValue.length > maxLength
                                ? `${inputValue.substring(0, maxLength)}...`
                                : inputValue || 'Click to add a comment'}
                            </div>

                            {isPopupOpen && (
                              <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-white p-4 rounded shadow-lg">
                                  <h2 className="text-lg font-bold mb-2">Add Comment</h2>
                                  <ReactQuill value={quillValue} onChange={setQuillValue} />
                                  <div className="flex justify-end mt-4">
                                    <button
                                      type="button"
                                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                                      onClick={handleOkClick}
                                    >
                                      OK
                                    </button>
                                    <button
                                      type="button"
                                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                                      onClick={() => setIsPopupOpen(false)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end p-4 border-t border-gray-300">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-center h-full">
                <h3 className="text-lg text-gray-700">Please select an employee to rate.</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

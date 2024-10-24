import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaAngleLeft, FaAngleRight, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';
// import NoDataImage from '../assets/norecord.svg';

export default function Employee() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ employeeId: '', employeeName: '', employeeDesignation: '', projectName: '', managerName: '', departmentName:'',role: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const [managers, setManagers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchManagers();
    fetchProjects();
    fetchDepartments();
  }, []);
 
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Employee/employees/');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  const fetchManagers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Employee/managers/');
      const data = await response.json();
      setManagers(data.map((manager) => manager.employee_name)); // Store manager names in state
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchDepartments = async () => { // New function to fetch departments
    try {
        const response = await fetch('http://127.0.0.1:8000/Departments/departments/'); // Adjust URL as needed
        const data = await response.json();
        setDepartments(data);
    } catch (error) {
        console.error('Error fetching departments:', error);
    }
};
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Project/projects/');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  const handleEdit = (employee) => {
    setFormData({
      employeeId: employee.employee_id,
      employeeName: employee.employee_name,
      employeeDesignation: employee.designation,
      projectName: employee.project_name,
      managerName: employee.manager_name,
      departmentName:employee.department_name,
      role: employee.role
    });
    setSelectedEmployee(employee);
    setIsEditMode(true);
    togglePopup();
  };
  const handleDelete = async (employeeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this employee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`http://127.0.0.1:8000/Employee/employees/${employeeId}`, {
            method: 'DELETE',
          });
          fetchEmployees(); // Refresh the employee list
          Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting employee:', error);
          Swal.fire('Error!', 'An error occurred while deleting the employee.', 'error');
        }
      }
    });
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value === 'Member') {
      fetchManagers();
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditMode ? 'PATCH' : 'POST';
    const url = isEditMode
      ? `http://127.0.0.1:8000/Employee/employees/${selectedEmployee.emp_id}`  // Ensure you're using the correct ID here
      : `http://127.0.0.1:8000/Employee/employees/`;
 
    const body = JSON.stringify({
      employee_id: formData.employeeId, // Include employee_id if required
      employee_name: formData.employeeName,
      designation: formData.employeeDesignation,
      project_name: formData.projectName,
      manager_name: formData.managerName,
      department_name:formData.departmentName,
      role: formData.role, // Ensure this matches the RoleEnum in the backend
    });
 
    console.log(`Submitting data: ${body}`);
 
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} employee:`, response.status, errorData);
 
        // Display validation errors
        if (errorData.detail) {
          console.error("Validation Errors:", errorData.detail);
        }
 
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
 
      await response.json();
      fetchEmployees();
      togglePopup();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} employee:`, error);
    }
  };
 
 
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
 
  // Filtering employees based on search query
  const filteredEmployees = employees.filter(employee =>
    employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  // Pagination Logic
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePreviousPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

  const handleNextPage = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
      }
  };

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  };
 
    return (
        <div className="container mx-auto p-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-bold">Employee</h3>
                <div className="flex space-x-4 items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-64 py-2 px-4 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                        />
                        <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    <button
                        onClick={() => {
                            setIsEditMode(false);
                            setFormData({ employeeId: '', employeeName: '', employeeDesignation: '', projectName: '', managerName: '',departmentName:'', role: '' });
                            togglePopup();
                        }}
                        className="bg-gray-800 text-white py-2 px-4 rounded-full flex items-center hover:bg-gray-700 transition duration-200"
                    >
                        <FaPlusCircle className="text-white text-lg mr-2" />
                        Add employee
                    </button>
                </div>
            </div>
 
            {/* Card wrapper */}
            <div className="bg-white rounded-lg p-6">
                <div className="overflow-x-auto bg-white rounded-lg">
                    <table className="min-w-full">
                        <thead className="bg-[#7955482b]">
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-600">Sl No</th>
                                <th className="py-3 px-4 text-left text-gray-600">Employee ID</th>
                                <th className="py-3 px-4 text-left text-gray-600">Employee Name</th>
                                <th className="py-3 px-4 text-left text-gray-600">Designation</th>
                                <th className="py-3 px-4 text-left text-gray-600">Project Name</th>
                                <th className="py-3 px-4 text-left text-gray-600">Role</th>
                                <th className="py-3 px-4 text-left text-gray-600"> Reporting Manager </th>
                                <th className="py-3 px-4 text-left text-gray-600"> Department Name</th>
                                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEmployees.map((employee, index) => (
                                <tr key={employee.emp_id} className="border-b">
                                    <td className="py-3 px-4">{indexOfFirstEmployee + index + 1}</td>
                                    <td className="py-3 px-4">{employee.employee_id}</td>
                                    <td className="py-3 px-4">{employee.employee_name}</td>
                                    <td className="py-3 px-4">{employee.designation}</td>
                                    <td className="py-3 px-4">{employee.project_name}</td>
                                    <td className="py-3 px-4">{employee.role}</td>
                                    <td className="py-3 px-4">{employee.manager_name}</td>
                                    <td className="py-3 px-4">{employee.department_name}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button onClick={() => handleEdit(employee)} className="text-blue-500 hover:text-blue-700">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(employee.emp_id)} className="text-red-500 hover:text-red-700">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
 
                {/* Pagination Controls */}
                <div className="flex justify-end mt-4">
                  <nav className="flex items-center" aria-label="pagination">
                      <button
                          onClick={handlePreviousPage}
                          disabled={currentPage === 1}
                          className={`flex items-center p-2 rounded-full border border-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                      >
                          <FaAngleLeft />
                      </button>

                      <div className="flex space-x-2 mx-2">
                          {Array.from({ length: totalPages }, (_, index) => ( 
                              <button
                                  key={index}
                                  onClick={() => handlePageChange(index + 1)}
                                  className={`px-4 py-2 rounded-full text-sm ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                              >
                                  {index + 1}
                              </button>
                          ))}
                      </div>

                      <button
                          onClick={handleNextPage}
                          disabled={currentPage === totalPages}
                          className={`flex items-center p-2 rounded-full border border-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                      >
                          <FaAngleRight />
                      </button>
                  </nav>
              </div>
            </div>
 
            {isOpen && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-2">
                {isEditMode ? 'Edit Employee' : 'Add Employee'}
            </h2>
            <form onSubmit={handleSubmit}>
                {/* Employee Id */}
                <div className="mb-1">
                    <label htmlFor="employeeId" className="block text-gray-700">Employee Id</label>
                    <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                    />
                </div>

                {/* Employee Name */}
                <div className="mb-1">
                    <label htmlFor="employeeName" className="block text-gray-700">Employee Name</label>
                    <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                    />
                </div>

                {/* Designation */}
                <div className="mb-1">
                    <label htmlFor="employeeDesignation" className="block text-gray-700">Designation</label>
                    <input
                        type="text"
                        id="employeeDesignation"
                        name="employeeDesignation"
                        value={formData.employeeDesignation}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                    />
                </div>

                {/* Project Name */}
                <div className="mb-1">
                    <label htmlFor="projectName" className="block text-gray-700">Project Name</label>
                    <select
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                        required
                    >
                        <option value="">Select Project</option>
                        {projects.map((project) => (
                            <option key={project.project_id} value={project.project_name}>
                                {project.project_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Department Name */}
                <div className="mb-1">
                    <label htmlFor="departmentName" className="block text-gray-700">Department Name</label>
                    <select
                        name="departmentName"
                        value={formData.departmentName}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.department_id} value={dept.department_name}>
                                {dept.department_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Role */}
                <div className="mb-1">
                    <label htmlFor="role" className="block text-gray-700">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                    >
                        <option value="" disabled>Select a role</option>
                        <option value="HR Admin">HR Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Member">Member</option>
                    </select>
                </div>

                {/* Reporting Manager (Dropdown always visible) */}
                <div className="mb-1">
                    <label htmlFor="managerName" className="block text-gray-700">Reporting Manager</label>
                    <select
                        name="managerName"
                        value={formData.managerName}
                        onChange={handleChange}
                        className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                    >
                        <option value="">Select Manager</option>
                        {managers.map((manager, index) => (
                            <option key={index} value={manager}>
                                {manager}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-4 mt-4">
                    <button
                        type="button"
                        onClick={togglePopup}
                        className="px-6 py-2 text-green-500 rounded-full flex items-center"
                        style={{ marginRight: '15rem' }}
                    >
                        <HiX className="mr-2" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    >
                        {isEditMode ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

 
        </div>
    );
}

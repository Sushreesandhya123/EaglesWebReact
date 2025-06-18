import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaAngleLeft, FaAngleRight, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import Swal from 'sweetalert2';

export default function Employee() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ 
    employeeId: '', 
    employeeName: '', 
    employeeDesignation: '', 
    employee_email: '', 
    userPassword: '',
    projectName: '', 
    managerName: '', 
    departmentName: '', 
    role: '' 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage, setEmployeesPerPage] = useState(10); // Added this line
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
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
      Swal.fire('Error', 'Failed to load employees', 'error');
    }
  };

  const fetchManagers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:8000/Employee/employees/managers/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Managers data:', data); // Debug log
    
    if (!Array.isArray(data)) {
      throw new Error('Expected array but got:', typeof data);
    }
    
    const managerNames = data.map(manager => manager.employee_name);
    setManagers(managerNames);
    
  } catch (error) {
    console.error('Error fetching managers:', error);
    setManagers([]);
    Swal.fire('Error', 'Failed to load managers', 'error');
  }
};

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Departments/departments/');
      if (!response.ok) throw new Error('Failed to fetch departments');
      const data = await response.json();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Project/projects/');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  const togglePopup = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEdit = (employee) => {
    setIsEditMode(true);
    setSelectedEmployee(employee);
    setFormData({
      employeeId: employee.employee_id,
      employeeName: employee.employee_name,
      employeeDesignation: employee.designation,
      employee_email: employee.employee_email || '',
      userPassword: '',
      projectName: employee.project_name,
      managerName: employee.manager_name || '',
      departmentName: employee.department_name,
      role: employee.role
    });
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
          const token = localStorage.getItem('token');
          if (!token) {
            Swal.fire('Error!', 'No token found. Please log in again.', 'error');
            return;
          }
          
          const response = await fetch(`http://127.0.0.1:8000/Employee/delete-employee/${employeeId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            Swal.fire('Deleted!', data.message, 'success');
            fetchEmployees();  
          } else {
            const errorData = await response.json();
            Swal.fire('Error!', errorData.detail || 'Failed to delete employee', 'error');
          }
        } catch (error) {
          console.error('Error deleting employee:', error);
          Swal.fire('Error!', 'An error occurred while deleting the employee.', 'error');
        }
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const authToken = localStorage.getItem('token');
    const orgId = localStorage.getItem('org_id');

    if (!authToken) {
      throw new Error('Authorization token not found. Please log in again.');
    }

    const requestBody = {
      employee_id: formData.employeeId,
      employee_name: formData.employeeName,
      designation: formData.employeeDesignation,
      role: formData.role,
      project_name: formData.projectName,
      manager_name: formData.managerName,
      department_name: formData.departmentName,
      // Include these only if your backend expects them
      employee_email: formData.employee_email || '',
      employee_password: formData.userPassword || '',
      org_id: orgId ? parseInt(orgId, 10) : 1 // Default to 1 if not found
    };

    // Remove null or empty fields
    const payload = Object.fromEntries(
      Object.entries(requestBody).filter(([_, v]) => v !== null && v !== '')
    );

    const response = await fetch('http://127.0.0.1:8000/Employee/employees/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.detail || 'Failed to create employee');
    }

    const data = await response.json();
    console.log('Success response:', data);
    
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Employee created successfully!',
    });
    
    fetchEmployees();
    setFormData({
      employeeId: '',
      employeeName: '',
      employeeDesignation: '',
      employee_email: '',
      userPassword: '',
      projectName: '',
      managerName: '',
      departmentName: '',
      role: '',
    });
    togglePopup();
  } catch (error) {
    console.error('Error creating employee:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to create employee',
    });
  }
};

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('token');
      const orgId = localStorage.getItem('org_id');

      if (!authToken) throw new Error('Authorization token not found');
      
      const requestBody = {
        org_id: parseInt(orgId, 10),
        employee_id: formData.employeeId,
        employee_name: formData.employeeName,
        employee_email: formData.employee_email,
        designation: formData.employeeDesignation,
        project_name: formData.projectName,
        manager_name: formData.managerName,
        department_name: formData.departmentName,
        role: formData.role,
      };

      const response = await fetch(`http://127.0.0.1:8000/Employee/update-employee/${selectedEmployee.emp_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update employee');
      }

      const data = await response.json();
      Swal.fire('Success', data.message, 'success');
      fetchEmployees();
      togglePopup();
    } catch (error) {
      console.error('Error updating employee:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter and pagination logic
  const filteredEmployees = employees.filter(employee =>
    employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.designation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-2xl font-bold">Employees</h3>
          <p className="text-gray-600">"Each employee brings unique strengths and potential, contributing to a collective vision of growth, success, and shared achievement."</p>
        </div>
        <div className="flex space-x-4 items-center">
          <button
            onClick={() => {
              setIsEditMode(false);
              setFormData({ 
                employeeId: '', 
                employeeName: '', 
                employeeDesignation: '', 
                employee_email: '', 
                userPassword: '',
                projectName: '', 
                managerName: '', 
                departmentName: '', 
                role: '' 
              });
              togglePopup();
            }}
            className="bg-gray-800 text-white py-2 px-4 rounded-full flex items-center hover:bg-gray-700 transition duration-200"
          >
            <FaPlusCircle className="text-white text-lg mr-2" />
            Add employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-2">
          <label className="mr-2">
            Show
            <select
              className="ml-1 form-select form-select-xl border border-gray-300"
              value={employeesPerPage}
              onChange={(e) => setEmployeesPerPage(Number(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            entries
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-64 py-1 px-4 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
            <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="min-w-full">
            <thead className="bg-[#7955482b]">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Employee ID</th>
                <th className="py-3 px-4 text-left text-gray-600">Employee Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Designation</th>
                <th className="py-3 px-4 text-left text-gray-600">Employee Email</th>
                <th className="py-3 px-4 text-left text-gray-600">Department Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Project Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Role</th>
                <th className="py-3 px-4 text-left text-gray-600">Reporting Manager</th>
                <th className="py-3 px-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <tr key={employee.emp_id} className="border-b">
                    <td className="py-3 px-4">{employee.employee_id}</td>
                    <td className="py-3 px-4">{employee.employee_name}</td>
                    <td className="py-3 px-4">{employee.designation}</td>
                    <td className="py-3 px-4">{employee.employee_email || '-'}</td>
                    <td className="py-3 px-4">{employee.department_name}</td>
                    <td className="py-3 px-4">{employee.project_name}</td>
                    <td className="py-3 px-4">{employee.role}</td>
                    <td className="py-3 px-4">{employee.manager_name || '-'}</td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button onClick={() => handleEdit(employee)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(employee.emp_id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-4 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {indexOfFirstEmployee + 1} to {Math.min(indexOfLastEmployee, filteredEmployees.length)} of {filteredEmployees.length} entries
            </div>
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
        )}
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 flex items-center justify-end z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg w-1/3 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">
                {isEditMode ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button onClick={togglePopup} className="text-gray-700">
                <HiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
              <div className="mb-1">
                <label htmlFor="employeeId" className="block text-gray-700">Employee ID</label>
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

              <div className="mb-1">
                <label htmlFor="employee_email" className="block text-gray-700">Employee Email</label>
                <input
                  type="email"
                  id="employee_email"
                  name="employee_email"
                  value={formData.employee_email}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                />
              </div>

              <div className="mb-1">
                <label htmlFor="departmentName" className="block text-gray-700">Department Name</label>
                <select
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_name}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-1">
                <label htmlFor="projectName" className="block text-gray-700">Project Name</label>
                <select
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                  className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.project_id} value={project.project_name}>
                      {project.project_name}
                    </option>
                  ))}
                </select>
              </div>

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
                  <option value="">Select a role</option>
                  <option value="HR Admin">HR Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div className="mb-1">
              <label htmlFor="managerName" className="block text-gray-700">Reporting Manager</label>
              <select
                id="managerName"
                name="managerName"
                value={formData.managerName}
                onChange={handleChange}
                className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
              >
                <option value="">Select Manager</option>
                {managers.length > 0 ? (
                  managers.map((manager, index) => (
                    <option key={index} value={manager}>
                      {manager}
                    </option>
                  ))
                ) : (
                  <option disabled>No managers available</option>
                )}
              </select>
            </div>

              {!isEditMode && (
                <div className="mb-1">
                  <label htmlFor="userPassword" className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    id="userPassword"
                    name="userPassword"
                    value={formData.userPassword}
                    onChange={handleChange}
                    required
                    className="w-full py-2 px-3 border border-gray-300 rounded mt-1"
                  />
                </div>
              )}

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={togglePopup}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full flex items-center hover:bg-gray-100"
                >
                  <HiX className="mr-1" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  {isEditMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import NoDataImage from '../assets/norecord.svg';
 
export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const borderColors = ['#B2E0D7', '#F2C94C', '#B4A583', '#FAD9C4'];
 
  useEffect(() => {
    fetchDepartments();
  }, []);
 
  const fetchDepartments = () => {
    fetch('http://127.0.0.1:8000/Departments/departments')
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  };
 
  const handleAddDepartment = () => {
    const newDepartment = { department_name: newDepartmentName, total_employees: 0, total_projects: 0 };
 
    fetch('http://127.0.0.1:8000/Departments/departments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDepartment),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        setDepartments([...departments, { ...data, total_employees: 0, total_projects: 0 }]);
        setShowModal(false);
        setNewDepartmentName('');
 
        Swal.fire({
          title: 'Success!',
          text: 'Department added successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
      })
      .catch(error => {
        console.error('Error adding department:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add department!',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33'
        });
      });
  };
 
  const handleEditItem = (index) => {
    setNewDepartmentName(departments[index].department_name);
    setEditingIndex(index);
    setShowModal(true);
  };
 
  const handleUpdateDepartment = () => {
    const updatedDepartment = { department_name: newDepartmentName };
 
    fetch(`http://127.0.0.1:8000/Departments/departments/${departments[editingIndex].department_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDepartment),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        fetchDepartments();
        setShowModal(false);
        setNewDepartmentName('');
        setEditingIndex(null);
        toast.success('Department updated successfully!', { position: 'top-center' });
      })
      .catch(error => {
        console.error('Error updating department:', error);
        toast.error('Error updating department!', { position: 'top-center' });
      });
  };
 
  const handleDeleteItem = (index) => {
    const departmentId = departments[index].department_id;
 
    Swal.fire({
      title: 'Are you sure you want to delete this department?',
      text: "This action can't be reverted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://127.0.0.1:8000/Departments/departments/${departmentId}`, {
          method: 'DELETE',
        })
          .then(response => {
            if (response.ok) {
              const updatedDepartments = departments.filter((_, i) => i !== index);
              setDepartments(updatedDepartments);
              toast.success('Department deleted successfully!', { position: 'top-center' });
            } else {
              throw new Error('Network response was not ok.');
            }
          })
          .catch(error => {
            console.error('Error deleting department:', error);
            toast.error('Error deleting department!', { position: 'top-center' });
          });
      }
    });
  };
 
  return (
    <div>
          <div className="flex justify-between mb-4 items-center">
      <div className="flex-grow">
        <blockquote className="text-lg text-gray-600">
          "A strong department is the backbone of any organization, where teamwork turns vision into reality."
        </blockquote>
      </div>
      <button
        className="bg-gray-800 text-white py-2 px-4 rounded-full flex items-center hover:bg-gray-700 transition duration-200"
        onClick={() => {
          setShowModal(true);
          setEditingIndex(null);
        }}
      >
        <FaPlusCircle className="mr-2" />
        New Department
      </button>
    </div>
      {departments.length === 0 ? (
        <div className="flex justify-center items-center">
          <img src={NoDataImage} alt="No Data Available" className="w-80" />
          <p className="text-gray-600 text-lg mt-[18rem] ml-[-14rem]">No Departments available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {departments.map((dept, index) => (
            <div
              key={dept.department_id}
              className="relative bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
              style={{
                borderLeft: `8px solid ${borderColors[index % borderColors.length]}`,
                borderTop: `2px solid ${borderColors[index % borderColors.length]}`,
                borderRight: `2px solid ${borderColors[index % borderColors.length]}`,
                borderBottom: `2px solid ${borderColors[index % borderColors.length]}`,
              }}
            >
              <div>
                <h3 className="text-lg font-semibold">{dept.department_name}</h3>
                <p className="text-md text-gray-600">Department Name</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">{dept.total_employees}</h3>
                <p className="text-md text-gray-600">Total Employees</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-lg font-semibold">{dept.total_projects}</p>
                <p className="text-md text-gray-600">Total Projects</p>
              </div>
              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditItem(index)}>
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteItem(index)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
 
      <ToastContainer />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editingIndex !== null ? 'Edit Department' : 'Add New Department'}</h2>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="departmentName">
              Department Name
            </label>
            <input
              id="departmentName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter Department Name"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
           <div className="flex justify-between items-center w-full">
            <button
              className="px-6 py-2 text-green-500 rounded-full flex items-center"
              onClick={() => setShowModal(false)}
            >
              <HiX />
              Cancel
            </button>
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-full"
              onClick={editingIndex !== null ? handleUpdateDepartment : handleAddDepartment}
            >
              {editingIndex !== null ? 'Update' : 'Save'}
            </button>
          </div>

          </div>
        </div>
      )}
    </div>
  );
}
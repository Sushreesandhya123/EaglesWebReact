import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import NoDataImage from '../assets/norecord.svg';
 
export default function PerformanceParameter() {
  const [performanceParameters, setPerformanceParameters] = useState([]);
  const borderColors = ['#B2E0D7', '#F2C94C', '#B4A583', '#FAD9C4'];
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parameterToEdit, setParameterToEdit] = useState(null);
  const [newParameterName, setNewParameterName] = useState('');
  const [newParameterMaxRating, setNewParameterMaxRating] = useState(5); // Default to 5
  const [newParameterMinRating, setNewParameterMinRating] = useState(-5); // Default to -5
 
  // Fetch data from the API
  useEffect(() => {
    const fetchPerformanceParameters = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/PerformanceParameter/parameters');
        const data = await response.json();
        setPerformanceParameters(data);
      } catch (error) {
        console.error('Error fetching performance parameters:', error);
      }
    };
 
    fetchPerformanceParameters();
  }, []);
 
  // Handle adding or updating a parameter (POST or PATCH request)
  const handleParameterSubmit = async () => {
    if (newParameterName && newParameterMaxRating >= newParameterMinRating) {
      try {
        const parameter = {
          name: newParameterName,
          max_rating: newParameterMaxRating,
          min_rating: newParameterMinRating,
        };
 
        let response;
        if (isEditMode && parameterToEdit) {
          // Edit existing parameter
          response = await fetch(`http://127.0.0.1:8000/PerformanceParameter/parameters/${parameterToEdit.parameter_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(parameter),
          });
        } else {
          // Add new parameter
          response = await fetch('http://127.0.0.1:8000/PerformanceParameter/parameters', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(parameter),
          });
        }
 
        if (response.ok) {
          const addedOrUpdatedParameter = await response.json();
          if (isEditMode) {
            const updatedParameters = performanceParameters.map((param) =>
              param.parameter_id === addedOrUpdatedParameter.parameter_id ? addedOrUpdatedParameter : param
            );
            setPerformanceParameters(updatedParameters);
          } else {
            setPerformanceParameters([...performanceParameters, addedOrUpdatedParameter]);
          }
 
          // Show success alert
          Swal.fire({
            title: 'Success!',
            text: isEditMode ? 'Performance parameter updated successfully!' : 'Performance parameter added successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          toast.success(isEditMode ? 'Parameter updated successfully!' : 'Parameter added successfully!');
 
          resetModal();
        } else {
          console.error('Error submitting performance parameter:', response.statusText);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to submit performance parameter.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          toast.error('Failed to submit performance parameter.');
        }
      } catch (error) {
        console.error('Error submitting performance parameter:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        toast.error('An unexpected error occurred.');
      }
    }
  };
 
  // Handle deleting a parameter (DELETE request)
  const handleDeleteItem = async (parameterId) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this performance parameter?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
 
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/PerformanceParameter/parameters/${parameterId}`, {
          method: 'DELETE',
        });
 
        if (response.ok) {
          const updatedParameters = performanceParameters.filter(param => param.parameter_id !== parameterId);
          setPerformanceParameters(updatedParameters);
 
          // Show success alert
          Swal.fire({
            title: 'Deleted!',
            text: 'Performance parameter has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          toast.success('Performance parameter has been deleted.');
        } else {
          console.error('Error deleting performance parameter:', response.statusText);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete performance parameter.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          toast.error('Failed to delete performance parameter.');
        }
      } catch (error) {
        console.error('Error deleting performance parameter:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        toast.error('An unexpected error occurred.');
      }
    }
  };
 
  const handleEditItem = (parameter) => {
    setNewParameterName(parameter.name);
    setNewParameterMaxRating(parameter.max_rating);
    setNewParameterMinRating(parameter.min_rating);
    setParameterToEdit(parameter);
    setIsEditMode(true);
    setShowModal(true);
  };
 
  const resetModal = () => {
    setNewParameterName('');
    setNewParameterMaxRating(5); // Reset to 5
    setNewParameterMinRating(-5); // Reset to -5
    setShowModal(false);
    setIsEditMode(false);
    setParameterToEdit(null);
  };
 
  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
      <div className="flex-grow">
        <blockquote className="text-lg text-gray-600">
        "Performance is the result of a perfect blend of strategy, planning, and execution."
        </blockquote>
      </div>
        <button
          className="bg-gray-800 text-white py-2 px-4 rounded-full flex items-center hover:bg-gray-700 transition duration-200"
          onClick={() => setShowModal(true)}
        >
          <FaPlusCircle className="mr-2" />
          New Performance Parameter
        </button>
      </div>
      {/* Conditional rendering for no data */}
      {performanceParameters.length === 0 ? (
        <div className="flex justify-center items-center flex-col mt-10">
          <img src={NoDataImage} alt="No data available" className="w-64 h-64 mb-4" />
          <p className="text-gray-600 text-lg mt-4">No performance parameters available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {performanceParameters.map((parameter, index) => (
            <div
              key={parameter.parameter_id}
              className="relative bg-white p-6 rounded-lg shadow-md flex justify-between items-start"
              style={{
                borderLeft: `8px solid ${borderColors[index % borderColors.length]}`,
                borderTop: `2px solid ${borderColors[index % borderColors.length]}`,
                borderRight: `2px solid ${borderColors[index % borderColors.length]}`,
                borderBottom: `2px solid ${borderColors[index % borderColors.length]}`,
              }}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">
                  {parameter.name}
                </h3>
                <p className="text-md text-gray-600">Parameter</p>
              </div>
              <div className="flex flex-col items-center flex-1">
                <h3 className="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">
                  {parameter.min_rating}
                </h3>
                <p className="text-md text-gray-600">Min Rating</p>
              </div>
              <div className="flex flex-col items-center flex-1">
                <h3 className="text-lg font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">
                  {parameter.max_rating}
                </h3>
                <p className="text-md text-gray-600">Max Rating</p>
              </div>
 
              <div className="flex space-x-4 ">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEditItem(parameter)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDeleteItem(parameter.parameter_id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
 
{showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{isEditMode ? 'Edit Performance Parameter' : 'Add Performance Parameter'}</h2>
            <label className="block text-sm font-medium mb-2">Parameter Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter Parameter Name"
              value={newParameterName}
              onChange={(e) => setNewParameterName(e.target.value)}
            />
 
            <div className="flex justify-between mb-4">
              <div className="w-1/2 mr-2">
                <label className="block text-sm font-medium mb-2">Min Rating</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newParameterMinRating}
                  onChange={(e) => setNewParameterMinRating(Number(e.target.value))}
                >
                  {[...Array(11).keys()].map(i => (
                    <option key={i - 5} value={i - 5}>
                      {i - 5}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 ml-2">
                <label className="block text-sm font-medium mb-2">Max Rating</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={newParameterMaxRating}
                  onChange={(e) => setNewParameterMaxRating(Number(e.target.value))}
                >
                  {[...Array(11).keys()].map(i => (
                    <option key={i - 5} value={i - 5}>
                      {i - 5}
                    </option>
                  ))}
                </select>
              </div>
            </div>
 
            <div className="flex justify-end space-x-4">
              <button
               className="px-6 py-2 text-green-500 rounded-full flex items-center"style={{ marginRight: '9rem' }}
                onClick={resetModal}
              >
                <HiX />
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-green-500 text-white rounded-full"
                onClick={handleParameterSubmit}
              >
                {isEditMode ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
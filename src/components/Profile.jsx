import React, { useState, useEffect } from 'react';
import { FaPen } from 'react-icons/fa';
import { BiHide,BiShow } from 'react-icons/bi';
import Swal from 'sweetalert2';
 
export default function Profile() {
  const [successMessage, setSuccessMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [empId, setEmpId] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
 
  const token = localStorage.getItem('token');
  console.log("Token:", token);
 
  useEffect(() => {
    const storedEmpId = localStorage.getItem('emp_id');
    if (storedEmpId) {
      setEmpId(storedEmpId);
    } else {
      console.error("No employee ID found. Please log in again.");
      setError("Session expired. Please log in again.");
    }
  }, []);
 
  const fetchEmployeeById = async (id) => {
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }
 
    try {
      const response = await fetch(`http://localhost:8000/Employee/get_employee_id/?emp_id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message || 'Failed to fetch employee details. Please try again.';
        throw new Error(message);
      }
 
      const data = await response.json();
      setEmployeeDetails(data);
      setFullName(data.employee_name);
      setEmail(data.employee_email);
      setPhoneNumber(data.employee_mobile);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch employee details:', error);
    }
  };
 
  useEffect(() => {
    if (empId) {
      fetchEmployeeById(empId);
    }
  }, [empId]);
 
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
    }
  };
 
  const handleSaveProfile = async () => {
    if (!token) {
      setError("Session expired. Please log in again.");
      return;
    }
 
    try {
      const response = await fetch(`http://localhost:8000/Employee/update_employee_partial/${empId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          employee_name: fullName,
          employee_email: email,
          employee_mobile: phoneNumber,
        }),
      });
 
      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.message || 'Failed to save profile. Please try again.';
        throw new Error(message);
      }
 
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been updated successfully.',
        confirmButtonText: 'OK',
      });
 
      setError('');
    } catch (error) {
      setError(error.message);
      console.error('Failed to save profile:', error);
    }
  };
 
  const handleChangePassword = async () => {
    if (!token) {
        setError("Session expired. Please log in again.");
        return;
    }
 
    if (!currentPassword || !newPassword) {
        setError("Please fill in all fields.");
        return;
    }
 
    if (currentPassword === newPassword) {
      // Show a yellow warning popup
      Swal.fire({
          icon: 'warning',
          title: 'Warning!',
          text: 'New password cannot be the same as the current password.',
          confirmButtonText: 'OK',
          background: '#fff3cd', // Optional: Set a yellow background
          color: '#856404' // Optional: Set text color for better visibility
      });
      return;
  }
 
    try {
        const response = await fetch(`http://localhost:8000/Employee/update_employee_password/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                employee_email: email, // Make sure this is correct
                old_password: currentPassword, // Change this key to match your model
                new_password: newPassword, // This should also match
            }),
        });
 
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error Data:', errorData); // Log the error data
            const message = errorData.detail || 'Failed to change password. Please try again.';
            throw new Error(message);
        }
 
        const data = await response.json();
        setSuccessMessage(data.msg); // Set success message from response
        setCurrentPassword('');
        setNewPassword('');
        setError('');
        Swal.fire({
            icon: 'success',
            title: 'Password Changed!',
            text: 'Your password has been changed successfully.',
            confirmButtonText: 'OK',
        });
    } catch (error) {
        setError(error.message);
        console.error('Failed to change password:', error);
    }
};
 
 
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h5 className="text-lg font-semibold">My Profile</h5>
      <p className="text-center">Empower your profile with the strength of a new password; change is the key to a secure account</p>
 
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center">
          <input type="file" id="profilePicInput" accept=".jpg, .jpeg, .png, .jfif" className="hidden" />
          <label htmlFor="profilePicInput" className="cursor-pointer">
            <div className="relative w-24 h-24">
              <img src="https://memopsprodstore.blob.core.windows.net/user-profile/user_profile-murali.yagala@alongx.com-mumfuy0cfd.png" alt="Profile" className="w-full h-full rounded-full object-cover" />
              <FaPen className="absolute bottom-0 right-0 text-white bg-blue-500 rounded-full p-1" />
            </div>
          </label>
        </div>
 
        <div className="mt-4">
          <label htmlFor="fullname" className="block font-medium">Full Name</label>
          <input
            type="text"
            id="fullname"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g. Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)} // Allow user to edit
          />
        </div>
 
        <div className="flex gap-4 mt-4">
          <div className="w-1/2">
            <label htmlFor="emailId" className="block font-medium">Email ID</label>
            <input
              type="email"
              id="emailId"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Allow user to edit
            />
          </div>
 
          <div className="w-1/2">
            <label htmlFor="phonenumber" className="block font-medium">Phone Number</label>
            <input
              type="text"
              id="phonenumber"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter phone number"
              maxLength="10"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
            <div id="phonenumberError" className="text-red-500 hidden">
              Please enter exactly 10 digits.
            </div>
          </div>
        </div>
        <button
          type="button"
          className="w-1/3 mt-4 py-2 bg-green-500 text-white rounded-full"
          onClick={handleSaveProfile}
        >
          Save Profile
        </button>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {error && <p className="text-red-500">{error}</p>}
       
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-4">Change Password</h4>
          <div className="mt-4">
            <label htmlFor="currentPassword" className="block font-medium">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
 
                {showCurrentPassword ? <BiShow /> : <BiHide />}
              </span>
            </div>
          </div>
 
          <div className="mt-4">
            <label htmlFor="newPassword" className="block font-medium">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <BiShow /> : <BiHide />}
              </span>
            </div>
          </div>
 
          <button
            type="button"
            className="w-1/3 mt-4 py-2 bg-green-500 text-white rounded-full"
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
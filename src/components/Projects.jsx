import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import NoDataImage from '../assets/norecord.svg';
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDepartment, setNewProjectDepartment] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const borderColors = ['#B2E0D7', '#F2C94C', '#B4A583', '#FAD9C4'];
 
  // Fetch projects from API
  const fetchProjects = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/Project/projects/');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const transformedData = data.map(project => ({
            id: project.project_id,
            name: project.project_name,
            department: project.department_name,
            total_employees: project.total_employees, // Include total_employees here
        }));
        setProjects(transformedData);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
    }
};
 
  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/Departments/departments/');
      if (!response.ok) throw new Error('Network response was not ok');
      const departmentData = await response.json();
      setDepartments(departmentData);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };
 
  useEffect(() => {
    fetchProjects();
    fetchDepartments();
  }, []);
 
  const handleAddProject = async () => {
    if (newProjectName && newProjectDepartment) {
      const newProject = { project_name: newProjectName, department_name: newProjectDepartment };
      try {
        const response = await fetch('http://127.0.0.1:8000/Project/projects/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProject),
        });
 
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add project: ${errorText}`);
        }
 
        const addedProject = await response.json();
        setProjects([...projects, { id: addedProject.project_id, name: addedProject.project_name, department: addedProject.department_name }]);
        setNewProjectName('');
        setNewProjectDepartment('');
        setShowModal(false);
 
        // SweetAlert success message
        Swal.fire('Success!', 'Project added successfully!', 'success');
      } catch (error) {
        console.error('Failed to add project:', error);
        Swal.fire('Error!', 'Failed to add project!', 'error');
      }
    } else {
      console.error('Project name and department are required');
      Swal.fire('Error!', 'Project name and department are required!', 'error');
    }
  };
 
  const handleEditItem = (index) => {
    const projectToEdit = projects[index];
    setNewProjectName(projectToEdit.name);
    setNewProjectDepartment(projectToEdit.department);
    setEditingIndex(index);
    setShowModal(true); // Ensure the modal is shown
  };
 
  const handleUpdateProject = async () => {
    if (newProjectName && newProjectDepartment && editingIndex !== null) {
        const projectId = projects[editingIndex]?.id;
        if (!projectId) {
            console.error("Project ID is missing.");
            return;
        }
 
        const updatedProject = {
            project_name: newProjectName,
            department_name: newProjectDepartment,
        };
 
        try {
            const response = await fetch(`http://127.0.0.1:8000/Project/projects/${projectId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject),
            });
 
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update project: ${errorText}`);
            }
 
            // Re-fetch projects after the update
            fetchProjects(); // Add this line to refresh the project data
 
            setNewProjectName('');
            setNewProjectDepartment('');
            setEditingIndex(null);
            setShowModal(false);
 
            // SweetAlert success message
            Swal.fire('Success!', 'Project updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to update project:', error);
            Swal.fire('Error!', 'Failed to update project!', 'error');
        }
    } else {
        console.error('Project name and department are required');
        Swal.fire('Error!', 'Project name and department are required!', 'error');
    }
};
 
  const handleDelete = async (projectId) => {
    // SweetAlert2 confirmation popup
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this project?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
 
    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/Project/projects/${projectId}/`, {
          method: 'DELETE',
        });
 
        if (!response.ok) throw new Error('Failed to delete project');
 
        setProjects(projects.filter(project => project.id !== projectId));
        Swal.fire('Deleted!', 'Project has been deleted.', 'success'); // SweetAlert success message
      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error!', 'Failed to delete project!', 'error'); // SweetAlert error message
      }
    }
  };
 
 
  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
      <div className="flex-grow">
        <blockquote className="text-lg text-gray-600">
        "A project is a temporary endeavor undertaken to create a unique product, service, or result."
        </blockquote>
      </div>
        <button
          className="bg-gray-800 text-white py-2 px-4 rounded-full flex items-center hover:bg-gray-700 transition duration-200"
          onClick={() => {
            setNewProjectName('');
            setNewProjectDepartment('');
            setEditingIndex(null);
            setShowModal(true);
          }}
        >
          <FaPlusCircle className="mr-2" />
          New Project
        </button>
      </div>
     
      {/* Conditionally render No Data Image or the projects list */}
      {projects.length === 0 ? (
        <div className="flex justify-center items-center flex-col">
          <img src={NoDataImage} alt="No Data" className="h-64 w-64 mb-4" />
          <p className="text-gray-600">No projects available. Please add a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {projects.map((project, index) => (
            <div key={project.id} className="relative bg-white p-6 rounded-lg shadow-md flex justify-between items-center" style={{
              borderLeft: `8px solid ${borderColors[index % borderColors.length]}`,
              borderTop: `2px solid ${borderColors[index % borderColors.length]}`,
              borderRight: `2px solid ${borderColors[index % borderColors.length]}`,
              borderBottom: `2px solid ${borderColors[index % borderColors.length]}`,
            }}>
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-md text-gray-600">Project Name</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">{project.total_employees}</h3>
                <p className="text-md text-gray-600">Total Employees</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-lg font-semibold">{project.department}</h3>
                <p className="text-md text-gray-600">Department Name</p>
              </div>
              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditItem(index)}>
                  <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(project.id)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
 
      {/* Modal code */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">{editingIndex !== null ? 'Edit Project' : 'Add New Project'}</h2>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="projectName">
              Project Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Enter Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="departmentName">
              Department Name
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              value={newProjectDepartment}
              onChange={(e) => setNewProjectDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.department_id} value={department.department_name}>
                  {department.department_name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button className="px-6 py-2 text-green-500 rounded-full flex items-center ml-[-25px]" onClick={() => setShowModal(false)}>
                <HiX className="inline-block mr-1" /> Cancel
              </button>
              <button
               className="px-6 py-2 bg-green-500 text-white rounded-full ml-[-2rem]"
                onClick={editingIndex !== null ? handleUpdateProject : handleAddProject}
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

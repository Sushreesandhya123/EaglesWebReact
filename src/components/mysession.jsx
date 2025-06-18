import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlusCircle, FaSearch } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import NoDataImage from '../assets/norecord.svg';

export default function MySession() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [formData, setFormData] = useState({ sessionName: '', startDate: '', endDate: '', createdStatus: '' });
    const [searchQuery, setSearchQuery] = useState('');

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const sessionsPerPage = 10;

    // Fetch sessions from the backend API
    useEffect(() => {
      const fetchSessions = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/Session/sessions/');
          const data = await response.json();
          setSessions(data);
        } catch (error) {
          console.error('Error fetching sessions:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSessions();
    }, []);

    const togglePopup = () => {
      setIsOpen(!isOpen);
    };

    const handleEdit = (session) => {
      setFormData({
        sessionId: session.session_id,
        sessionName: session.session_name,
        startDate: session.start_date,
        endDate: session.end_date,
        createdStatus: session.status
      });
      setSelectedSession(session);
      setIsEditMode(true);
      togglePopup();
    };

    const handleDelete = async (sessionId) => {
      const confirmDelete = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (confirmDelete.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/Session/sessions/${sessionId}/`, {
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire('Deleted!', 'Your session has been deleted.', 'success');
            setSessions((prev) => prev.filter((session) => session.session_id !== sessionId));
          } else {
            Swal.fire('Error!', 'Failed to delete session.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'An error occurred while deleting the session.', 'error');
        }
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const { sessionName, startDate, endDate } = formData;

      if (isEditMode) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/Session/sessions/${selectedSession.session_id}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session_name: sessionName,
              start_date: startDate,
              end_date: endDate,
            }),
          });
          if (response.ok) {
            const updatedSession = await response.json();
            setSessions((prev) =>
              prev.map((session) => (session.session_id === updatedSession.session_id ? updatedSession : session))
            );
            Swal.fire('Updated!', 'Your session has been updated.', 'success');
          } else {
            Swal.fire('Error!', 'Failed to update session.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'An error occurred while updating the session.', 'error');
        }
      } else {
        try {
          const response = await fetch('http://127.0.0.1:8000/Session/sessions/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session_name: sessionName,
              start_date: startDate,
              end_date: endDate,
            }),
          });
          if (response.ok) {
            const newSession = await response.json();
            setSessions((prev) => [...prev, newSession]);
            Swal.fire('Added!', 'Your session has been added.', 'success');
          } else {
            Swal.fire('Error!', 'Failed to add session.', 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'An error occurred while adding the session.', 'error');
        }
      }
      togglePopup();
    };

    const handleSearch = (e) => {
      setSearchQuery(e.target.value);
    };

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

    const filteredSessions = sessions.filter(session =>
      session.session_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
    const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-2">
        <div className="flex justify-between items-center mb-2">
        <div>
        <h3 className="text-2xl font-bold">Sessions</h3>
        <p className="text-gray-600">"Each session is not just a meeting, but an opportunity to align vision, set goals, and inspire growth."</p>
    </div>
          <div className="flex space-x-4 items-center">
            <button
              onClick={() => {
                setIsEditMode(false);
                setFormData({ sessionName: '', startDate: '', endDate: '', createdStatus: '' });
                togglePopup();
              }}
              className="bg-gray-800 text-white py-2 px-4 rounded-full flex items-center hover:bg-gray-700 transition duration-200"
            >
              <FaPlusCircle className="text-white text-lg mr-2" />
              Add Session
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-2">
            <label className="mr-2">
          Show 
          <select 
            name="allUsers_length" 
            aria-controls="allUsers" 
            className="ml-1 form-select form-select-xl border border-gray-300 "
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
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-64 py-1 px-4 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
                        <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
                    </div>
                
            </div>
          <div className="overflow-x-auto bg-white rounded-lg">
          {sessions.length === 0 ? (
    <div className="flex flex-col items-center justify-center">
      <img src={NoDataImage} alt="No Data" className="w-64 h-62 mb-4" />
      <p className="mt-2 text-gray-500">No sessions available.</p>
    </div>
  ) : (
            <table className="min-w-full">
              <thead className="bg-[#7955482b]">
                <tr>
                  <th className="py-3 px-4 text-left text-gray-600">Sl No</th>
                  <th className="py-3 px-4 text-left text-gray-600">Session Name</th>
                  <th className="py-3 px-4 text-left text-gray-600">Start Date</th>
                  <th className="py-3 px-4 text-left text-gray-600">End Date</th>
                  <th className="py-3 px-4 text-left text-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSessions.map((session, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{session.session_id}</td>
                    <td className="py-3 px-4">{session.session_name}</td>
                    <td className="py-3 px-4">{session.start_date}</td>
                    <td className="py-3 px-4">{session.end_date}</td>
                    <td className="py-3 px-4 flex items-center">
                      {session.status === 'Closed' && <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>}
                      {session.status === 'Active' && <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>}
                      {session.status === 'New' && <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>}
                      {session.status}
                    </td>
                    <td className="py-3 px-4 space-x-2">
                      <button onClick={() => handleEdit(session)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(session.session_id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
   
          {/* Stylish Pagination Controls */}
          <div className="flex justify-end mt-4">
            <nav className="flex items-center" aria-label="pagination">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`flex items-center p-2 rounded-full border border-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              >
                &lt;
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
                &gt;
              </button>
            </nav>
          </div>
        </div>
   
        {/* Popup Form */}
        {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-1/3">
          <h3 className="text-lg font-bold mb-4">{isEditMode ? 'Edit Session' : 'Add Session'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-grey mb-2" htmlFor="sessionName">
                Session Name
              </label>
              <input
                type="text"
                id="sessionName"
                name="sessionName"
                value={formData.sessionName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
     
            {/* Flex container for Start Date and End Date */}
            <div className="mb-4 flex justify-between space-x-4">
              <div className="w-1/2">
                <label className="block text-grey mb-2" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-grey mb-2" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
            </div>
     
            <div className="flex justify-end">
              <button
                type="button"
                onClick={togglePopup}
                className="px-6 py-2 text-green-500 rounded-full flex items-center"
                style={{ marginRight: '18rem' }}
              >
                <HiX className="inline-block mr-1" /> Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-full"
              >
                {isEditMode ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
        )}

        <ToastContainer />
      </div>
    );
}

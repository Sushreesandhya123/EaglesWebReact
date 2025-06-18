import React, { useState, useEffect } from 'react';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Sessions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sessions, setSessions] = useState([]);
  const [submissionData, setSubmissionData] = useState({});
  const [loading, setLoading] = useState(true);
  const sessionsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch sessions data
    fetch('http://127.0.0.1:8000/Session/sessions/')
      .then((response) => response.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sessions:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch submission data for each session
    const fetchSubmissionStatus = (sessionId) => {
      const managerId = localStorage.getItem('manager_id');
      if (!managerId) return;

      fetch(`http://localhost:8000/SessionEntry/submission-status/${managerId}/${sessionId}`)
        .then((response) => response.json())
        .then((data) => {
          setSubmissionData((prevData) => ({
            ...prevData,
            [sessionId]: data,
          }));
        })
        .catch((error) => console.error('Error fetching submission status:', error));
    };

    sessions.forEach((session) => fetchSubmissionStatus(session.session_id));
  }, [sessions]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSessions = sessions.filter((session) =>
    session.session_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSessionClick = (sessionId) => {
    const submissionStatus = submissionData[sessionId];
    if (submissionStatus && submissionStatus.total_employees === submissionStatus.submitted_count) {
      // Show SweetAlert if all performance parameters are submitted
      Swal.fire({
        icon: 'info',
        title: 'All Parameters Submitted',
        text: 'You have already submitted all employee performance parameters in this session. Click another session.',
      });
    } else {
      localStorage.setItem('session_id', sessionId);
      navigate(`/sessionentry/${sessionId}`);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-2xl font-bold">Sessions</h3>
          <p className="text-gray-600">"Each session is not just a meeting, but an opportunity to align vision, set goals, and inspire growth."</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-64 py-2 px-4 pl-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="overflow-x-auto bg-white rounded-lg">
          <table className="min-w-full">
            <thead className="bg-[#7955482b] items-center">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Sl No</th>
                <th className="py-3 px-4 text-left text-gray-600">Session Name</th>
                <th className="py-3 px-4 text-left text-gray-600">Start Date</th>
                <th className="py-3 px-4 text-left text-gray-600">End Date</th>
                <th className="py-3 px-4 text-left text-gray-600">Own Status</th>
                <th className="py-3 px-4 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentSessions.map((session, index) => (
                <tr key={session.session_id} className="border-b">
                  <td className="py-3 px-4 text-left">{indexOfFirstSession + index + 1}</td>
                  <td className="py-3 px-4 text-left">
                    <span
                      onClick={() => handleSessionClick(session.session_id)}
                      className="cursor-pointer text-gray-800 hover:text-green-600 transition-colors duration-200"
                    >
                      {session.session_name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-left">{session.start_date}</td>
                  <td className="py-3 px-4 text-left">{session.end_date}</td>
                  <td className="py-3 px-4 text-left">
                    {submissionData[session.session_id] ? (
                      <span className="text-gray-800">
                        {submissionData[session.session_id].total_employees} out of{' '}
                        {submissionData[session.session_id].submitted_count} submitted
                      </span>
                    ) : (
                      'Loading...'
                    )}
                  </td>
                  <td className="py-3 px-4 text-left">
                    <span className="inline-flex items-center space-x-2">
                      {session.status.toLowerCase() === 'completed' && (
                        <FaCheckCircle className="text-green-600" />
                      )}
                      {session.status.toLowerCase() === 'new' && (
                        <FaHourglassHalf className="text-yellow-600" />
                      )}
                      {session.status.toLowerCase() === 'closed' && (
                        <FaTimesCircle className="text-red-600" />
                      )}
                      {session.status.toLowerCase() === 'active' && (
                        <FaCheckCircle className="text-green-600" />
                      )}
                      <span className="text-gray-800">{session.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
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
    </div>
  );
}

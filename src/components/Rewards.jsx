import React, { useEffect, useState } from "react";
import Img1 from "../assets/e4.jpg";
import Img2 from "../assets/e2.jpg";
import Img3 from "../assets/e1.avif";
import Img4 from "../assets/e5.jpg";

export default function Rewards() {
  const [topPerformers, setTopPerformers] = useState([]);
  const [filter, setFilter] = useState("month"); 
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 

  useEffect(() => {
    let apiUrl = `http://127.0.0.1:8000/Dashoard/rewards/top-performers-per-project?period=${filter}`;

    if (filter === "custom" && startDate && endDate) {
      apiUrl = `http://127.0.0.1:8000/Dashoard/rewards/top-performers-per-project?start_date=${startDate}&end_date=${endDate}`;
    }

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setTopPerformers(data.top_performers_per_project);
      })
      .catch((error) => {
        console.error("Error fetching top performers:", error);
      });
  }, [filter, startDate, endDate]); 

  const images = [Img1, Img2, Img3, Img4]; 

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCustomFilter = () => {
    if (startDate && endDate) {
      setFilter("custom");
    }
  };

  return (
    <div className="w-full py-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-7xl min-h-[500px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-center flex-1">Rewards</h2>
          <div className="flex justify-end">
            <select
              className="p-2 rounded-md border border-gray-300 mr-4"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
              <option value="custom">Custom Date</option>
            </select>
            {filter === "custom" && (
              <div className="flex items-center">
                <input
                  type="date"
                  className="p-2 rounded-md border border-gray-300 mr-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  className="p-2 rounded-md border border-gray-300 mr-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <button
                  onClick={handleCustomFilter}
                  className="p-2 bg-blue-500 text-white rounded-md"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="relative bg-gradient-to-r from-yellow-200 to-yellow-500 p-6 mb-10 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-white">
            🎉 Congratulations, Team! 🎉
          </h3>
          <p className="text-white text-lg mt-2">
            Your hard work and dedication have paid off. Together, we achieve greatness!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topPerformers.map((performer, index) => (
            <div
              key={performer.employee_id}
              className="relative bg-white p-2 mb-6 rounded-lg shadow-lg flex items-center"
            >
              <div
                className={`absolute top-0 left-0 w-1/4 h-full ${
                  index % 4 === 0
                    ? "bg-gradient-to-r from-blue-300 to-transparent"
                    : index % 4 === 1
                    ? "bg-gradient-to-r from-green-300 to-transparent"
                    : index % 4 === 2
                    ? "bg-gradient-to-r from-pink-300 to-transparent"
                    : "bg-gradient-to-r from-purple-300 to-transparent"
                } rounded-l-lg`}
              ></div>
              <img
                src={images[index % images.length]}
                alt={`Performer ${performer.employee_name}`}
                className="w-24 h-24 rounded-full mr-6 relative z-10"
              />
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-gray-800">
                  Best Performance Rewards
                </h4>
                <p className="text-gray-600 mt-1">
                  Celebrating outstanding achievements and dedication.
                </p>
                <p className="text-gray-700 mt-2">
                  Name: <span className="font-semibold">{performer.employee_name}</span>
                </p>
                <p className="text-gray-700 mt-2">
                  Department: <span className="font-semibold">{performer.department_name}</span>
                </p>
                <p className="text-gray-700 mt-2">
                  Project: <span className="font-semibold">{performer.project_name}</span>
                </p>
                <p className="text-gray-700 mt-1">
                  Performance Rating:{" "}
                  <span className="font-semibold">{performer.top_rating}</span>
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  Extreme professionalism and work ethics were shown by {performer.employee_name}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

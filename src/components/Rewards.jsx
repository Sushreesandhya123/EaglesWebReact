import React from 'react';
import Img1 from '../assets/e4.jpg';
import Img2 from '../assets/e2.jpg';
import Img3 from '../assets/e1.avif';
import Img4 from '../assets/e5.jpg'; // Example for a 4th image if needed

export default function Rewards() {
  return (
    <div className="w-full py-4 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-7xl min-h-[500px]">
        <h2 className="text-3xl font-bold text-center mb-6">Rewards</h2>

        {/* Reward Message Card */}
        <div className="relative bg-gradient-to-r from-yellow-200 to-yellow-500 p-6 mb-10 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-semibold text-white">🎉 Congratulations, Team! 🎉</h3>
          <p className="text-white text-lg mt-2">
            Your hard work and dedication have paid off. Together, we achieve greatness!
          </p>
        </div>

        {/* Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Card 1 */}
          <div className="relative bg-white p-6 mb-6 rounded-lg shadow-lg flex items-center">
            <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-blue-300 to-transparent rounded-l-lg"></div>
            <img
              src={Img1}
              alt="Client 1"
              className="w-24 h-24 rounded-full mr-6 relative z-10"
            />
            <div className="relative z-10">
            <h4 className="text-xl font-bold text-gray-800">Best Performance Rewards</h4>
              <p className="text-gray-600 mt-1">
                Celebrating outstanding achievements and dedication.
              </p>
              <p>Employee name1</p>
              <p className="text-gray-500">Designation</p>
              <p className="text-sm text-gray-700 mt-2">
                Extreme professionalism and work ethics were shown by (Alongx).
              </p>
            </div>
          </div>

          {/* Client Card 2 */}
          <div className="relative bg-white p-6 mb-6 rounded-lg shadow-lg flex items-center">
            <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-green-300 to-transparent rounded-l-lg"></div>
            <img
              src={Img2}
              alt="Client 2"
              className="w-24 h-24 rounded-full mr-6 relative z-10"
            />
            <div className="relative z-10">
            <h4 className="text-xl font-bold text-gray-800">Best Performance Rewards</h4>
              <p className="text-gray-600 mt-1">
                Celebrating outstanding achievements and dedication.
              </p>
              <p>Employee name1</p>
              <p className="text-gray-500">Designation</p>
              <p className="text-sm text-gray-700 mt-2">
                Extreme professionalism and work ethics were shown by (Alongx).
              </p>
            </div>
          </div>

          {/* Client Card 3 */}
          <div className="relative bg-white p-6 mb-6 rounded-lg shadow-lg flex items-center">
            <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-pink-300 to-transparent rounded-l-lg"></div>
            <img
              src={Img3}
              alt="Client 3"
              className="w-24 h-24 rounded-full mr-6 relative z-10"
            />
            <div className="relative z-10">
            <h4 className="text-xl font-bold text-gray-800">Best Performance Rewards</h4>
              <p className="text-gray-600 mt-1">
                Celebrating outstanding achievements and dedication.
              </p>
              <p>Employee name1</p>
              <p className="text-gray-500">Designation</p>
              <p className="text-sm text-gray-700 mt-2">
                Extreme professionalism and work ethics were shown by (Alongx).
              </p>
            </div>
          </div>

          {/* Client Card 4 */}
          <div className="relative bg-white p-6 mb-6 rounded-lg shadow-lg flex items-center">
            <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-purple-300 to-transparent rounded-l-lg"></div>
            <img
              src={Img4}
              alt="Client 4"
              className="w-24 h-24 rounded-full mr-6 relative z-10"
            />
            <div className="relative z-10">
            <h4 className="text-xl font-bold text-gray-800">Best Performance Rewards</h4>
              <p className="text-gray-600 mt-1">
                Celebrating outstanding achievements and dedication.
              </p>
              <p>Employee name1</p>
              <p className="text-gray-500">Designation</p>
              <p className="text-sm text-gray-700 mt-2">
                Extreme professionalism and work ethics were shown by (Alongx).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

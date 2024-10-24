import React, { useState } from 'react';
// import { FaPlusCircle } from 'react-icons/fa';
import Departments from './Departments';
import Projects from './Projects';
import PerformanceParameters from './PerformanceParameter';
import OrganisationProfile from './OrganisationProfile';
 
export default function Setting() {
  const [activeTab, setActiveTab] = useState('department');
 
  return (
<div className="bg-light p-5">
      {/* Tab Navigation */}
<div className="bg-gray-100 p-2 rounded-lg shadow-lg mb-1">
<ul className="flex justify-between relative">
          {['department', 'project', 'performanceParameter', 'organisationProfile'].map((tab) => (
<li key={tab} className="nav-item relative">
<button
                className={`nav-link ${activeTab === tab ? 'bg-[#c3b7a4] text-white' : 'bg-gray-300 text-black'} py-2 px-4 rounded-[10px_45px_10px_45px] pr-36 transition duration-300`}
                onClick={() => setActiveTab(tab)}
>
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
</button>
              {activeTab === tab && (
<span className="absolute left-1/2 transform -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#c3b7a4]"></span>
              )}
</li>
          ))}
</ul>
</div>
 
      {/* Tab Content */}
<div className="tab-content p-4 bg-gray-100 rounded-lg">
        {activeTab === 'department' && <Departments />}
        {activeTab === 'project' && <Projects />}
        {activeTab === 'performanceParameter' && <PerformanceParameters />}
        {activeTab === 'organisationProfile' && <OrganisationProfile />}
</div>
</div>
  );
}
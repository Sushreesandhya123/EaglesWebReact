import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
 
export default function ChartComponent() {
  const [projectData, setProjectData] = useState(null); // State to hold project-based employee data
  const [employeeData, setEmployeeData] = useState(null); // State to hold department-based employee data
 
  // Fetch data from the API
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch('http://localhost:8000/Dashoard/dashboard/employees-per-project');
        const data = await response.json();
        // Transform the data for Highcharts
        const categories = data.employees_per_project.map((item) => item.project_name);
        const seriesData = data.employees_per_project.map((item) => item.employee_count);
        setProjectData({ categories, seriesData });
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
 
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch('http://localhost:8000/Dashoard/dashboard/employees-per-department');
        const data = await response.json();
        setEmployeeData(data); // Store the fetched data
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
 
    fetchProjectData();
    fetchEmployeeData();
  }, []); // Empty dependency array ensures this only runs once on component mount
 
  // Line chart for employees per project
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 300,
    },
    title: {
      text: 'Employees Per Project',
    },
    xAxis: {
      categories: projectData ? projectData.categories : [], // Dynamically set categories
    },
    yAxis: {
      title: {
        text: '',
      },
    },
    series: [
      {
        name: 'Number of Employees',
        data: projectData ? projectData.seriesData : [], // Dynamically set data
      },
    ],
  };
 
  // Bar chart for employees per department
  const barChartOptions = {
    chart: {
      type: 'column',
      height: 300,
    },
    title: {
      text: 'Performance Overview ',
    },
    xAxis: {
      categories: employeeData ? employeeData.categories : [], // Dynamically set categories
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
    },
    series: [
      {
        name: 'Number of Employees',
        data: employeeData ? employeeData.series[0].data : [], // Dynamically set data
      },
    ],
  };
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {/* Line Chart Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        {projectData ? (
          <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
        ) : (
          <div>Loading project data...</div>
        )}
      </div>
 
      {/* Bar Chart Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        {employeeData ? (
          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
        ) : (
          <div>Loading department data...</div>
        )}
      </div>
    </div>
  );
}
 
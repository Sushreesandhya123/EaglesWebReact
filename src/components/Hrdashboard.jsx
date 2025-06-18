import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function ChartComponent() {
  const [projectData, setProjectData] = useState({ categories: [], seriesData: [] });
  const [departmentData, setDepartmentData] = useState({ categories: [], seriesData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [projectResponse, departmentResponse] = await Promise.all([
          fetch('http://localhost:8000/Dashoard/dashboard/employees-per-project'),
          fetch('http://localhost:8000/Dashoard/dashboard/employees-per-department')
        ]);

        const projectJson = await projectResponse.json();
        const departmentJson = await departmentResponse.json();

        // Process project data
        const projectCategories = (projectJson?.employees_per_project || []).map(item => item.project_name || 'Unknown Project');
        const projectSeriesData = (projectJson?.employees_per_project || []).map(item => item.employee_count || 0);
        
        // Process department data
        const departmentCategories = (departmentJson?.employees_per_department || []).map(item => item.department_name || 'Unknown Department');
        const departmentSeriesData = (departmentJson?.employees_per_department || []).map(item => item.employee_count || 0);

        setProjectData({
          categories: projectCategories,
          seriesData: projectSeriesData
        });

        setDepartmentData({
          categories: departmentCategories,
          seriesData: departmentSeriesData
        });

      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 300,
    },
    title: {
      text: 'Employees Per Project',
    },
    xAxis: {
      categories: projectData.categories,
    },
    yAxis: {
      title: {
        text: 'Number of Employees',
      },
    },
    series: [{
      name: 'Employees',
      data: projectData.seriesData,
      color: '#4F46E5' // Indigo color
    }],
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: true
      }
    }
  };

  const barChartOptions = {
    chart: {
      type: 'column',
      height: 300,
    },
    title: {
      text: 'Employees Per Department',
    },
    xAxis: {
      categories: departmentData.categories,
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Number of Employees'
      }
    },
    series: [{
      name: 'Employees',
      data: departmentData.seriesData,
      color: '#10B981' // Emerald color
    }],
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading charts...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={lineChartOptions} 
        />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={barChartOptions} 
        />
      </div>
    </div>
  );
}
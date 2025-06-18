import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoSmall from '../assets/logo.png'; 

export default function OrganisationProfile() {
  const [orgLogo, setOrgLogo] = useState(logoSmall); 
  const [orgName, setOrgName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');


  const orgId = localStorage.getItem('org_id');
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!orgId) {
        toast.warn('Organization ID is not found in local storage.');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/Organization/get-organization/${orgId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        // Populate fields with fetched data
        setOrgName(result.org_name || '');
        setFullName(result.full_name || '');
        setEmail(result.org_email || '');
        setMobileNumber(result.org_mobile_number || '');
        setAddress(result.org_address || '');
        setPincode(result.org_pincode || '');
        setCity(result.org_city || '');
        setState(result.org_state || '');
        setCountry(result.org_country || '');
        setOrgLogo(result.org_logo || logoSmall); 

        // toast.success('Organization data has been successfully fetched!');
      } catch (error) {
        console.error('Failed to fetch organization data:', error);
        toast.error('There was an error fetching the organization data.');
      }
    };

    fetchOrganizationData();
  }, [orgId, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrgLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const data = {
      org_name: orgName,
      org_mobile_number: mobileNumber,
      org_email: email,
      org_address: address,
      org_pincode: pincode,
      org_city: city,
      org_state: state,
      org_country: country,
      org_logo: orgLogo,
      full_name: fullName,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/Organization/update-organization/${orgId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Organization updated successfully:', result);

      toast.success('The organization profile has been updated successfully!');
    } catch (error) {
      console.error('Failed to update organization:', error);
      toast.error('There was an error updating the organization profile.');
    }
  };

  const handleSearch = async () => {
    if (!pincode) {
      toast.warn('Please enter a pincode to search for location.');
      return;
    }

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = await response.json();
      if (data[0].Status === 'Success' && data[0].PostOffice.length > 0) {
        const locationData = data[0].PostOffice[0];
        const district = locationData.District || 'Unknown District';
        const state = locationData.State || 'Unknown State';
        const country = 'India';

        setCity(district);
        setState(state);
        setCountry(country);
        setAddress(`${locationData.Name}, ${district}, ${state}, ${country}`);

        toast.success('The location data has been retrieved successfully!');
      } else {
        throw new Error('No location data found for the given pincode');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
      toast.error('Unable to retrieve location data. Please check the pincode and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <a href="/operations" className="text-xl text-gray-700">
            <i className="bi bi-arrow-left"></i>
          </a>
          <h1 className="text-xl font-semibold">Organization Profile</h1>
        </div>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Embrace change, configure your settings for organizational growth, and subscribe to progress with simplicity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium">Organization Logo</label>
            <div className="mt-2 flex items-center">
              <input
                type="file"
                id="organization_logo"
                name="organization_logo"
                accept=".jpg, .jpeg, .png"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="organization_logo" className="cursor-pointer">
                <div className="w-28 h-28 border rounded-md overflow-hidden">
                  <img
                    src={orgLogo}
                    alt="Organization Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = logoSmall; }} // Fallback to default logo
                  />
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Subscriber ID</label>
            <p className="mt-2 bg-gray-100 text-center py-2 rounded-md text-sm font-semibold">73</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Organization Name</label>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile Number</label>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter phone number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Pincode</label>
            <div className="flex items-center mt-2">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Search
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">State</label>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              className="mt-2 w-full p-2 border rounded-md"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

import React, { useState } from 'react';
import logoSmall from '../assets/logo.png'; 

export default function OrganisationProfile() {
 // State for organization profile fields
 const [orgLogo, setOrgLogo] = useState(logoSmall);
 const [orgName, setOrgName] = useState('');
 const [department, setDepartment] = useState('');
 const [email, setEmail] = useState('');
 const [mobileNumber, setMobileNumber] = useState('');
 const [pointOfContact, setPointOfContact] = useState('');
 const [address, setAddress] = useState('');
 const [pincode, setPincode] = useState('');
 const [city, setCity] = useState('');
 const [state, setState] = useState('');
 const [country, setCountry] = useState('');


 // Handle logo upload
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

 // Handle saving the organization profile
 const handleSave = () => {
   // Logic to save the organization profile details
   console.log({
     orgName,
     department,
     email,
     mobileNumber,
     pointOfContact,
     address,
     pincode,
     city,
     state,
     country,
   });
 };

 return (
   <div className="flex items-center justify-center min-h-screen">
     <div className="w-full max-w-4xl bg-white p-6 rounded-md shadow-lg">
       {/* Header */}
       <div className="flex items-center space-x-2 mb-6">
         <a href="/operations" className="text-xl text-gray-700">
           <i className="bi bi-arrow-left"></i>
         </a>
         <h1 className="text-xl font-semibold">Organization Profile</h1>
       </div>

       {/* Subheader */}
       <p className="text-sm text-gray-500 mb-6 text-center">
         Embrace change, configure your settings for organizational growth, and subscribe to progress with simplicity.
       </p>

       {/* Main form */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Organization Logo */}
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
                      {orgLogo ? (
                        <img src={orgLogo} alt="Organization Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="flex items-center justify-center h-full text-gray-300">No Logo</span>
                      )}
                    </div>
                  </label>
                </div>
              </div>

         {/* Subscriber ID */}
         <div>
           <label className="block text-sm font-medium">Subscriber ID</label>
           <p className="mt-2 bg-gray-100 text-center py-2 rounded-md text-sm font-semibold">73</p>
         </div>

         {/* Organization Name */}
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

         {/* Department */}
         <div>
           <label className="block text-sm font-medium">Department</label>
           <select
             className="mt-2 w-full p-2 border rounded-md"
             value={department}
             onChange={(e) => setDepartment(e.target.value)}
           >
             <option value="" disabled>Select department</option>
             <option value="HR">HR</option>
             <option value="Marketing">Marketing</option>
             <option value="Sales">Sales</option>
             <option value="Designing">Designing</option>
           </select>
         </div>

         {/* Email */}
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

         {/* Mobile Number */}
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

         {/* Point of Contact */}
         <div>
           <label className="block text-sm font-medium">Point of Contact</label>
           <input
             type="text"
             className="mt-2 w-full p-2 border rounded-md"
             placeholder="Enter point of contact"
             value={pointOfContact}
             onChange={(e) => setPointOfContact(e.target.value)}
           />
         </div>

         {/* Address */}
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

         {/* Pincode */}
         <div>
           <label className="block text-sm font-medium">Pincode</label>
           <div className="flex space-x-2 mt-2">
             <input
               type="text"
               className="flex-1 p-2 border rounded-md"
               placeholder="Enter pincode"
               value={pincode}
               onChange={(e) => setPincode(e.target.value)}
             />
             <button className="px-4 py-2 bg-green-500 text-white rounded-md">Search</button>
           </div>
         </div>

         {/* City */}
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

         {/* State */}
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

         {/* Country */}
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

       {/* Save Button */}
       <div className="mt-6 flex justify-end">
         <button
           onClick={handleSave}
           className="px-6 py-2 bg-green-500 text-white rounded-full"
         >
           Save
         </button>
       </div>
     </div>
   </div>
 );
}

import { useState } from 'react';
import logoImage from '../assets/eagleslogo.png';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const navigate = useNavigate();
    const [orgName, setOrgName] = useState('');
    const [orgEmail, setOrgEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [orgMobile, setOrgMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleCreateAccount = async () => {
        if (password !== confirmPassword) {
            toast.error('Passwords do not match', { position: 'top-right' });
            return;
        }
    
        const payload = {
            org_name: orgName,
            org_email: orgEmail,
            org_mobile_number: orgMobile,
            full_name: fullName,
            password: password,
        };
    
        try {
            const response = await fetch('http://127.0.0.1:8000/Organization/create-organization/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            const responseData = await response.json();
            console.log('Full Response:', responseData); // Log full response
    
            if (response.ok) {
                console.log("Success notification triggered");
    
                // Ensure the response has 'response' object
                const { access_token, org_name, org_id, employee_name, emp_id, role, org_logo,org_email } = responseData.response;
    
                // Store values in localStorage
                localStorage.setItem('token', access_token);
                localStorage.setItem('org_name', org_name);
                localStorage.setItem('org_id', org_id);
                localStorage.setItem('full_name', employee_name);
                localStorage.setItem('emp_id', emp_id);
                localStorage.setItem('role', role);
                localStorage.setItem('org_logo', org_logo);
                localStorage.setItem('email', org_email);
    
                toast.success('Account created successfully!', {
                    position: 'top-right',
                    autoClose: 5000,
                });
    
                // Delay navigation to ensure the toast appears
                setTimeout(() => {
                    navigate('/hrdashboard');
                }, 1000); // 1000 ms = 1 second delay
            } else {
                console.error('Error Response:', responseData);
                const errorMessage = responseData.msg || 'An error occurred';
                toast.error(errorMessage, { position: 'top-right' });
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.', { position: 'top-right' });
            console.error('Error during signup:', error);
        }
    };
    
    
    
    
    
    
    

    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center bg-white-100" id="signup">
                <div className="w-full md:w-[54%] bg-white-200 p-0 rounded">
                    <div className="flex justify-between bg-white p-2 items-center">
                        <a href="https://www.alongx.com/" target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://alongxpublicstorage.blob.core.windows.net/alongx-logo/alongx_logo_transparent_black.png"
                                alt="AlongX Logo"
                                className="h-12"
                            />
                        </a>
                        <div className="text-center">
                            <h6 className="inline-block">
                                Already have an account?
                                <a href="signin" className="btn btn-danger rounded-full bg-red-500 text-white px-4 py-2 ml-2">Log In</a>
                            </h6>
                        </div>
                    </div>
                    <div className="bg-white p-4 mt-5">
                        <img
                            src={logoImage}
                            alt="Eagles Logo"
                            className="eaglesLogo h-14 w-auto ml-[1rem]"
                        />
                        <h6 className="mt-3 text-lg font-semibold text-left ml-[1rem]">Start with your free account today.</h6>
                        <p className="text-left text-gray-600 ml-[1rem]">No upfront fees. No credit card required.</p>
                        <div className="flex flex-col md:flex-row mt-5">
                            <div className="md:w-1/2 p-2">
                                <input
                                    type="text"
                                    id="orgName"
                                    placeholder="Organization Name"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    className="p-2 w-[90%] border-b-2 border-black focus:outline-none focus:border-b-black mb-4"
                                />
                                <input
                                    type="email"
                                    id="orgEmail"
                                    placeholder="Email"
                                    value={orgEmail}
                                    onChange={(e) => setOrgEmail(e.target.value)}
                                    className="p-2 w-[90%] border-b-2 border-black focus:outline-none focus:border-b-black mb-4"
                                    autoComplete="off"
                                />
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-2 w-[90%] border-b-2 border-black focus:outline-none focus:border-b-black mb-4"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="md:w-1/2 p-2">
                                <input
                                    type="text"
                                    id="orgMobile"
                                    placeholder="Mobile Number"
                                    value={orgMobile}
                                    onChange={(e) => setOrgMobile(e.target.value)}
                                    className="p-2 w-[90%] border-b-2 border-black focus:outline-none focus:border-b-black mb-4"
                                    maxLength="10"
                                    minLength="10"
                                />
                                <input
                                    type="text"
                                    id="full_name"
                                    placeholder="Your Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="p-2 w-[90%] border-b-2 border-black focus:outline-none focus:border-b-black mb-4"
                                />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="p-2 w-[90%] border-b-2 border-black focus:outline-none focus:border-b-black mb-4"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-left">
                            <p className="text-xs">
                                By clicking 'Create Account for Free', I accept the AlongX
                                <a href="https://www.alongx.com/Home/Terms_and_conditions" target="_blank" className="text-blue-600 underline">Terms of Service</a>
                                and
                                <a href="https://www.alongx.com/Home/Privacy_policy" target="_blank" className="text-blue-600 underline">Privacy Notice</a>
                            </p>
                        </div>
                        <div className="mt-4 text-left">
                            <button
                                className="bg-[#795548c4] text-white rounded-full px-4 py-2"
                                onClick={handleCreateAccount}
                            >
                                Create Account for Free
                            </button>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <p className="text-xs">Already have an account? Don't create another. Just
                                <a href="signin" className="text-red-500 underline">Click Here to Login</a>
                            </p>
                            <a href="/forgot/" className="text-dark underline text-xs mr-[6rem]">Forgot Password?</a>
                        </div>
                    </div>
                    <div className="flex justify-between mt-4 w-full px-4">
                        <p className="text-xs">A product of AlongX Software</p>
                        <p className="text-xs">© 2024 AlongX Software All Rights Reserved. | App Version - v2.0.0</p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

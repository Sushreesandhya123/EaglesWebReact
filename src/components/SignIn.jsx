import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/eagleslogo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

export default function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); 

    useEffect(() => {
        const token = Cookies.get('access_token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSignIn = async () => {
        const payload = new URLSearchParams();
        payload.append('grant_type', 'password');
        payload.append('username', email);
        payload.append('password', password);
    
        try {
            const response = await fetch('http://localhost:8000/Login/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: payload.toString(),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
    
                // Store user details in local storage
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('employee_name', data.employee_name);
                localStorage.setItem('role', data.role);
                localStorage.setItem('emp_id', data.emp_id);
                localStorage.setItem('manager_id', data.emp_id);
                if (data.org_id) {
                    localStorage.setItem('org_id', data.org_id);
                    console.log('Stored org_id:', data.org_id);
                }
    
                // Handle "Remember Me" functionality
                if (rememberMe) {
                    localStorage.setItem('email', email);
                    localStorage.setItem('password', password);
                    Cookies.set('email', email, { expires: 365 });
                    Cookies.set('password', password, { expires: 365 });
                } else {
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                    Cookies.remove('email');
                    Cookies.remove('password');
                }
    
                toast.success('Login successful!', { position: 'top-right', autoClose: 3000 });
    
                // Navigate based on role
                setTimeout(() => {
                    if (data.role === 'HR Admin') {
                        navigate('/hrdashboard');
                    } else if (data.role === 'Manager') {
                        navigate('/dashboard');
                    } else {
                        toast.error('Unauthorized role. Please contact support.', { position: 'top-right' });
                    }
                }, 3000);
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                toast.error('Login failed. Please check your credentials.', { position: 'top-right' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            toast.error('Something went wrong. Please try again.', { position: 'top-right' });
        }
    };
    
    
    

    return (
        <div className="container mx-auto font-sans">
            <div className="flex items-center justify-center bg-white-100" id="signIn">
                <div className="w-full md:w-[56%]">
                    <div className="flex items-center justify-between bg-[#f5f5f5] p-4">
                        <div className="w-1/2">
                            <a href="https://www.alongx.com/" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://alongxpublicstorage.blob.core.windows.net/alongx-logo/alongx_logo_transparent_black.png"
                                    alt="AlongX Logo"
                                    className="alongxLogo h-12 w-auto"
                                />
                            </a>
                        </div>
                        <div className="w-1/2 text-right">
                            <h6 className="heading">
                                New user?{' '}
                                <span>
                                    <Link to="/login" className="text-red-600">
                                        Create an account
                                    </Link>
                                </span>
                            </h6>
                        </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-4" id="signIn">
                        <div className="w-1/2 mt-5 mainCol">
                            <img
                                src={logoImage}
                                alt="Eagles Logo"
                                className="eaglesLogo h-14 w-auto"
                            />
                            <h6 className="mt-3 text-lg font-semibold ml-[6px]">Sign into your Eagles account</h6>
                            <p className="text-muted text-gray-600 ml-[6px]">Unlock Your World: Access Awaits!</p>

                            <div className="mt-2">
                                <div className="mb-4">
                                    <input
                                        id="email"
                                        type="text"
                                        className="p-2 w-[100%] border-b-2 border-black focus:outline-none focus:border-b-black"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="off"
                                        aria-label="Email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        id="password"
                                        type="password"
                                        className="p-2 w-[100%] border-b-2 border-black focus:outline-none focus:border-b-black"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="off"
                                        aria-label="Password"
                                    />
                                </div>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                                <div>
                                    <input type="checkbox" id="rememberMe" />
                                    <label htmlFor="rememberMe" className="ml-2">Remember me</label>
                                </div>
                                <Link to="/forgot-password" className="text-blue-600">Forgot Password?</Link>
                            </div>
                            <div className="mt-3">
                                <button className="bg-[#795548c4] text-white rounded-full px-4 py-2" id="btnLogin" onClick={handleSignIn}>
                                    Log In
                                </button>
                            </div>
                        </div>
                        <div className="w-1/2 mainCol ml-[2rem]">
                            <img
                                src="https://alongxpublicstorage.blob.core.windows.net/common/web_authentication_screen_promotional_thumbnail.png"
                                alt="Background"
                                className="bgImg h-72 w-auto"
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between bg-white p-4">
                        <div className="w-full">
                            <p className="text-xs">
                                By clicking 'Log In', I accept the AlongX{' '}
                                <a href="https://www.alongx.com/Home/Terms_and_conditions" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Terms of Service</a> and{' '}
                                <a href="https://www.alongx.com/Home/Privacy_policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Privacy Notice</a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="w-1/2">
                            <p className="text-xs">A product of AlongX Software</p>
                        </div>
                        <div className="w-1/2 text-right">
                            <p className="text-xs">© 2024 AlongX Software All Rights Reserved. | App Version - v2.0.0</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

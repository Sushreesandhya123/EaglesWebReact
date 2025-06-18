import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/shared/Layout';
import Dashboard from './components/Dashboard';
import Employee from './components/Employee';
import SignIn from './components/SignIn';
import Login from './components/Login';
import Departments from './components/Departments';
import PerformanceParameter from './components/PerformanceParameter';
import OrganisationProfile from './components/OrganisationProfile';
import Projects from './components/Projects';
import Sessions from './components/Sessions';
import SessionEntry from './components/SessionEntry';
import WithdrawaRequest from './components/WithdrawaRequest';
import Setting from './components/Setting';
import MySession from './components/mysession';
import Report from './components/Report';
import Rewards from './components/Rewards';
import Profile from './components/Profile'
import Hrdashboard from './components/Hrdashboard';

function App() {
    const [ setIsAuthenticated ] = useState(false); // manage auth state

    const handleSignInSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <Router>
            <Routes>
                {/* Test SignIn and Login Routes First */}
                <Route path="/signin" element={<SignIn onSignInSuccess={handleSignInSuccess} />} />
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

                {/* Public and Protected Routes */}
                <Route element={<Layout />}>
                    {/* Temporarily hardcode dashboard route without auth check */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/hrdashboard" element={<Hrdashboard />} />
                    <Route path="employee" element={<Employee />} />
                    <Route path="departments" element={<Departments />} />
                    <Route path="performanceparameter" element={<PerformanceParameter />} />
                    <Route path="organisationprofile" element={<OrganisationProfile />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="/sessionentry/:sessionId" element={<SessionEntry />} />
                    <Route path="mysession" element={<MySession />} />
                    <Route path="rewards" element={<Rewards />} />
                    <Route path="withdrawarequest" element={<WithdrawaRequest />} />
                    <Route path="report" element={<Report />} />
                    <Route path="setting" element={<Setting />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Redirect Root to SignIn */}
                <Route path="/" element={<Navigate to="/signin" />} />
            </Routes>
        </Router>
    );
}

export default App;

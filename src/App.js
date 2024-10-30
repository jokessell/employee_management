import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import EmployeeTable from './components/EmployeeTable';
import GeneratedDataTable from './components/GeneratedDataTable';
import ProjectTable from './components/ProjectTable';
import SkillTable from './components/SkillTable';
import NavigationBar from './components/NavigationBar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AdminPage from './components/AdminPage';
import AccessDeniedPage from './components/AccessDeniedPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function App() {
    const { auth } = useContext(AuthContext);

    return (
        <>
            <NavigationBar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LoginPage />} />  {/* Home/Login page accessible to anyone */}
                <Route path="/generated-data" element={<GeneratedDataTable />} /> {/* Unrestricted route */}
                <Route path="/login" element={auth.token ? <Navigate to="/" /> : <LoginPage />} />
                <Route path="/register" element={auth.token ? <Navigate to="/" /> : <RegisterPage />} />

                {/* Authenticated Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/employees" element={<EmployeeTable />} />
                    <Route path="/projects" element={<ProjectTable />} />
                    <Route path="/skills" element={<SkillTable />} />
                </Route>

                {/* Admin-Only Route */}
                <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                    <Route path="/admin" element={<AdminPage />} />
                </Route>

                {/* Access Denied Route */}
                <Route path="/access-denied" element={<AccessDeniedPage />} />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeTable from './components/EmployeeTable';
import GeneratedDataTable from './components/GeneratedDataTable';
import ProjectTable from './components/ProjectTable';
import SkillTable from './components/SkillTable'; // Import SkillTable
import NavigationBar from './components/NavigationBar'; // Import NavigationBar

function App() {
    return (
        <Router>
            <NavigationBar /> {/* Include the navigation bar */}
            <Routes>
                <Route path="/" element={<EmployeeTable />} />
                <Route path="/projects" element={<ProjectTable />} />
                <Route path="/skills" element={<SkillTable />} /> {/* Add SkillTable route */}
                <Route path="/generated-data" element={<GeneratedDataTable />} />
            </Routes>
        </Router>
    );
}

export default App;

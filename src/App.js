import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeTable from './components/EmployeeTable';
import GeneratedDataTable from './components/GeneratedDataTable'; // Import new component

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EmployeeTable />} />  {/* Default Employee Management */}
                <Route path="/generated-data" element={<GeneratedDataTable />} /> {/* New Table for Generated Data */}
            </Routes>
        </Router>
    );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import Departments from './pages/Departments';
import AddDepartment from './pages/AddDepartment';
import EditDepartment from './pages/EditDepartment';
import Designations from './pages/Designations';
import AddDesignation from './pages/AddDesignation';
import EditDesignation from './pages/EditDesignation';
import Attendances from './pages/Attendances';
import AddAttendance from './pages/AddAttendance';
import EditAttendance from './pages/EditAttendance';

function App() {
    return (
        <BrowserRouter>

            <div className="min-h-screen bg-gray-100">

                <Sidebar />

                <div className="ml-64">

                    <Navbar />

                    <main>

                        <Routes>

                            <Route
                                path="/"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/employees"
                                element={<Employees />}
                            />
                            <Route
                                path="/employees/create"
                                element={<AddEmployee />}
                            />
                            <Route
                                path="/employees/:id/edit"
                                element={<EditEmployee />}
                            />
                            <Route path="/departments" element={<Departments />} />
                            <Route path="/departments/create" element={<AddDepartment />} />
                            <Route path="/departments/:id/edit" element={<EditDepartment />} />
                            <Route path="/designations" element={<Designations />} />
                            <Route path="/designations/create" element={<AddDesignation />} />
                            <Route path="/designations/:id/edit" element={<EditDesignation />} />
                            <Route path="/attendance" element={<Attendances />} />
                            <Route path="/attendance/create" element={<AddAttendance />} />
                            <Route path="/attendance/:id/edit" element={<EditAttendance />} />

                        </Routes>

                    </main>

                </div>

            </div>

        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';

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

                        </Routes>

                    </main>

                </div>

            </div>

        </BrowserRouter>
    );
}

export default App;

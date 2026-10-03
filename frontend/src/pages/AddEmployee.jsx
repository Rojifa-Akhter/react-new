import { useState } from 'react';

function AddEmployee() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
        salary: '',
        joining_date: '',
        status: 'Active',
    });


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(formData);
    };


    return (
        <div className="p-8">

            {/* Header */}
            <div className="mb-6">

                <h2 className="text-2xl font-bold text-gray-900">
                    Add Employee
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Add a new employee to your organization.
                </p>

            </div>


            {/* Form */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">


                        {/* Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter employee name"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>


                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>


                        {/* Phone */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>


                        {/* Designation */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Designation
                            </label>

                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="e.g. Laravel Developer"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>


                        {/* Department */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Department
                            </label>

                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">
                                    Select Department
                                </option>

                                <option value="Development">
                                    Development
                                </option>

                                <option value="Design">
                                    Design
                                </option>

                                <option value="HR">
                                    HR
                                </option>

                                <option value="Marketing">
                                    Marketing
                                </option>
                            </select>
                        </div>


                        {/* Salary */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Salary
                            </label>

                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="Enter salary"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>


                        {/* Joining Date */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Joining Date
                            </label>

                            <input
                                type="date"
                                name="joining_date"
                                value={formData.joining_date}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>


                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Active">
                                    Active
                                </option>

                                <option value="Inactive">
                                    Inactive
                                </option>
                            </select>
                        </div>

                    </div>


                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

                        <button
                            type="button"
                            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Save Employee
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddEmployee;

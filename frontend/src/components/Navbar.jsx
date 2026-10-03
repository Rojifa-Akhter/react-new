function Navbar() {
    return (
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Welcome back, Rojifa!
                </p>
            </div>


            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    RA
                </div>

                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        Rojifa Akhter
                    </p>

                    <p className="text-xs text-gray-500">
                        Administrator
                    </p>
                </div>

            </div>

        </header>
    );
}

export default Navbar;

function StatCard({ title, value, icon }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-xl">
                    {icon}
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                        {value}
                    </h2>
                </div>

            </div>

        </div>
    );
}

export default StatCard;

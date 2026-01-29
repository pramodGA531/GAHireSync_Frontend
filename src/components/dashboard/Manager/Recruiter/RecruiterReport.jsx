import React from "react";
import Main from "../Layout";

import GoBack from "../../../common/Goback";

const RecruiterReport = () => {
    const recruiters = ["recruiter1", "recrutier2", "recruiter3"];
    return (
        <Main defaultSelectedKey="3">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold text-[#071C50]">
                            Recruiter Reports
                        </h2>
                        <div className="flex items-center gap-3">
                            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none font-medium">
                                {recruiters.map((name, index) => (
                                    <option key={index} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none font-medium">
                                <option value="month">Monthly</option>
                                <option value="week">Weekly</option>
                                <option value="year">Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="text-6xl mb-4 opacity-10">📈</div>
                        <h3 className="text-lg font-bold text-gray-400">
                            No report data available
                        </h3>
                        <p className="text-sm text-gray-400">
                            Reports will be generated once activity is recorded.
                        </p>
                    </div>
                </div>
            </div>
        </Main>
    );
};

export default RecruiterReport;

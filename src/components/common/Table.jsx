import React, { useState, useEffect } from "react";
import NoData from "../../images/empty.svg";

/**
 * Reusable Table Component with Pagination, Sorting, and Expandable Rows
 * @param {Array} columns - Table columns
 * @param {Array} data - Table data
 * @param {Object} pagination - Pagination configuration
 * @param {Boolean} loading - Loading state
 * @param {Object} expandable - { expandedRowRender: Function, rowExpandable: Function }
 */
const Table = ({
    columns = [],
    data = [],
    pagination = {},
    loading = false,
    expandable = {},
}) => {
    const [sortedData, setSortedData] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: null,
    });
    const [expandedRowKeys, setExpandedRowKeys] = useState([]); // Track expanded rows

    // Handle sorting
    const handleSort = (col) => {
        if (!col.sorter) return;

        let direction = "ascend";
        if (sortConfig.key === col.key && sortConfig.direction === "ascend") {
            direction = "descend";
        }

        const sortedArray = [...data].sort((a, b) => {
            if (typeof col.sorter === "function") {
                return col.sorter(a, b);
            } else {
                if (a[col.dataIndex] < b[col.dataIndex])
                    return direction === "ascend" ? -1 : 1;
                if (a[col.dataIndex] > b[col.dataIndex])
                    return direction === "ascend" ? 1 : -1;
                return 0;
            }
        });

        setSortedData(sortedArray);
        setSortConfig({ key: col.key, direction });
    };

    useEffect(() => {
        setSortedData(data);
    }, [data]);

    // Pagination
    // const { current = 1, pageSize = 5, total = 0, onChange } = pagination;
    // const startIndex = (current - 1) * pageSize;
    // const endIndex = startIndex + pageSize;
    // const paginatedData = sortedData.slice(startIndex, endIndex);

    let paginatedData = sortedData; // Default: no pagination

    if (pagination && pagination !== false) {
        const { current = 1, pageSize = 5 } = pagination;
        const startIndex = (current - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        paginatedData = sortedData.slice(startIndex, endIndex);
    }

    // Handle row expand/collapse
    const handleExpand = (key) => {
        if (expandedRowKeys.includes(key)) {
            setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
        } else {
            setExpandedRowKeys([...expandedRowKeys, key]); // Only one expanded at a time, change to [...expandedRowKeys, key] for multiple
        }
    };

    return (
        <div className="w-full overflow-x-auto rounded-lg col-span-10 my-2.5">
            <table className="w-full border-collapse min-w-[600px] mt-[15px]">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => handleSort(col)}
                                style={{
                                    cursor: col.sorter ? "pointer" : "default",
                                }}
                                className="bg-white text-[#A2A1A8] font-light text-base border-b-0 mb-[15px] p-[12px_16px] text-left"
                            >
                                {col.title}
                                {sortConfig.key === col.key && (
                                    <span>
                                        {sortConfig.direction === "ascend"
                                            ? " 🔼"
                                            : " 🔽"}
                                    </span>
                                )}
                            </th>
                        ))}
                        {expandable.expandedRowRender && (
                            <th className="bg-white text-[#A2A1A8] font-light text-base border-b-0 mb-[15px] p-[12px_16px] text-left"></th>
                        )}{" "}
                        {/* For expand button */}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="text-center p-5 text-[#888] font-light h-[150px] align-middle"
                            >
                                <span className="border-4 border-[#f3f3f3] border-t-[#555] rounded-full w-5 h-5 animate-spin inline-block mr-2.5"></span>{" "}
                                Loading...
                            </td>
                        </tr>
                    ) : paginatedData.length > 0 ? (
                        paginatedData.map((item, idx) => {
                            const rowKey = item.id || item.key || idx; // You can adjust rowKey as per your data
                            const isExpanded = expandedRowKeys.includes(rowKey);
                            return (
                                <React.Fragment key={rowKey}>
                                    <tr className="hover:bg-[#f9f9f9] transition-colors duration-300">
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className="text-[#16151C] border-b border-[#e0e0e0] p-[12px_16px] text-left"
                                            >
                                                {col.render
                                                    ? col.render(
                                                          item[col.dataIndex],
                                                          item
                                                      )
                                                    : item[col.dataIndex]}
                                            </td>
                                        ))}
                                        {expandable.expandedRowRender && (
                                            <td className="text-[#16151C] border-b border-[#e0e0e0] p-[12px_16px] text-left">
                                                <button
                                                    onClick={() =>
                                                        handleExpand(rowKey)
                                                    }
                                                    className="w-[100px] bg-[#007bff] text-white border-none rounded cursor-pointer text-xs p-1"
                                                >
                                                    {isExpanded
                                                        ? "Hide"
                                                        : "View Remarks"}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                    {isExpanded && (
                                        <tr>
                                            <td
                                                colSpan={columns.length + 1}
                                                className="bg-[#f9f9f9] p-[15px] border-b border-[#e0e0e0] border-l-2 border-l-[#ddd]"
                                            >
                                                {expandable.expandedRowRender(
                                                    item
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="text-center p-5 text-[#888] font-light h-[150px] align-middle"
                            >
                                <img
                                    src={NoData}
                                    alt="No data"
                                    className="mx-auto"
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {pagination && pagination !== false && (
                <div className="flex justify-end items-center gap-2.5 py-2.5">
                    <button
                        className="px-2.5 py-1.5 border border-[#ccc] bg-white text-black cursor-pointer rounded md:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() =>
                            pagination.onChange(
                                pagination.current - 1,
                                pagination.pageSize
                            )
                        }
                        disabled={pagination.current === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.current} of{" "}
                        {Math.ceil(pagination.total / pagination.pageSize)}
                    </span>
                    <button
                        onClick={() =>
                            pagination.onChange(
                                pagination.current + 1,
                                pagination.pageSize
                            )
                        }
                        className="px-2.5 py-1.5 border border-[#ccc] bg-white text-black cursor-pointer rounded md:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                            pagination.current >=
                            Math.ceil(pagination.total / pagination.pageSize)
                        }
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Table;

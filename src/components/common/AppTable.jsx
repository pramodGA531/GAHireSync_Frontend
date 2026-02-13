"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { parseISO, isWithinInterval } from "date-fns";

// Custom debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const AppTable = ({
    data,
    columns,
    onDeleteSelected,
    multiSelect = false,
    pageSize = 10,
    customFilters,
    expandable = {},
}) => {
    const [expandedRows, setExpandedRows] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [columnFilters, setColumnFilters] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [searchInputs, setSearchInputs] = useState({});

    // Debounce global filter
    const debouncedGlobalFilter = useDebounce(globalFilter, 300);

    // Process columns to add sticky positioning and filter capabilities
    const processedColumns = useMemo(() => {
        let leftStickyOffset = multiSelect ? 50 : 0;
        let rightStickyOffset = 0;

        // Calculate right sticky columns first (reverse order)
        const rightStickyColumns = columns.filter((col) => col.rightSticky);
        rightStickyColumns.reverse().forEach((col) => {
            const colWidth = col.width || 150;
            col.meta = {
                ...col.meta,
                rightOffset: rightStickyOffset,
                width: colWidth,
            };
            rightStickyOffset += colWidth;
        });

        return columns.map((column, index) => {
            const processedColumn = { ...column };
            const colWidth = column.width || 150;

            // Add sticky positioning
            if (column.leftSticky) {
                processedColumn.meta = {
                    ...processedColumn.meta,
                    leftSticky: true,
                    leftOffset: leftStickyOffset,
                    width: colWidth,
                };
                leftStickyOffset += colWidth;
            }

            if (column.rightSticky) {
                processedColumn.meta = {
                    ...processedColumn.meta,
                    rightSticky: true,
                    width: colWidth,
                };
            }

            // Ensure all columns have proper meta with width
            if (!processedColumn.meta) {
                processedColumn.meta = { width: colWidth };
            } else if (!processedColumn.meta.width) {
                processedColumn.meta.width = colWidth;
            }

            // Add filtering capability
            if (
                column.searchField ||
                column.dateFilter ||
                column.dropdownFilter
            ) {
                processedColumn.enableColumnFilter = true;
            }

            // Add sorting capability
            if (column.sort !== false) {
                processedColumn.enableSorting = true;
            }

            return processedColumn;
        });
    }, [columns, multiSelect]);

    // Filter data based on date range and other filters
    const filteredData = useMemo(() => {
        let result = data;

        // Apply date range filter
        if (dateRange.from && dateRange.to) {
            result = result.filter((row) => {
                const dateColumns = columns.filter((col) => col.dateFilter);
                return dateColumns.some((col) => {
                    const dateValue = row[col.accessorKey];
                    if (!dateValue) return false;
                    try {
                        const date = parseISO(dateValue);
                        return isWithinInterval(date, {
                            start: dateRange.from,
                            end: dateRange.to,
                        });
                    } catch {
                        return false;
                    }
                });
            });
        }

        return result;
    }, [data, dateRange, columns]);

    const table = useReactTable({
        data: filteredData,
        columns: processedColumns,
        state: {
            globalFilter: debouncedGlobalFilter,
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        enableColumnFilters: true,
        enableGlobalFilter: true,
    });

    const toggleRowSelection = (rowId) => {
        setSelectedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    const toggleAllRowsSelection = (checked) => {
        const newSelection = {};
        if (checked) {
            table.getRowModel().rows.forEach((row) => {
                newSelection[row.id] = true;
            });
        }
        setSelectedRows(newSelection);
    };

    const handleBulkDelete = () => {
        const ids = Object.keys(selectedRows).filter((id) => selectedRows[id]);
        onDeleteSelected?.(ids);
        setSelectedRows({});
    };

    const getSelectedCount = () => {
        return Object.values(selectedRows).filter(Boolean).length;
    };

    const DateRangePicker = ({ value, onChange }) => {
        return (
            <div className="flex flex-col md:flex-row md:items-center gap-2 px-2 mx-4 py-1 border border-gray-300 rounded-md bg-white transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10">
                <input
                    type="date"
                    value={
                        value.from ? value.from.toISOString().split("T")[0] : ""
                    }
                    onChange={(e) =>
                        onChange({
                            ...value,
                            from: e.target.value
                                ? new Date(e.target.value)
                                : null,
                        })
                    }
                    className="border-none outline-none p-1 text-sm transition-all duration-200 w-full md:w-auto"
                />

                <span className="text-gray-500 text-sm text-center md:text-left">
                    to
                </span>

                <input
                    type="date"
                    value={value.to ? value.to.toISOString().split("T")[0] : ""}
                    onChange={(e) =>
                        onChange({
                            ...value,
                            to: e.target.value
                                ? new Date(e.target.value)
                                : null,
                        })
                    }
                    className="border-none outline-none p-1 text-sm transition-all duration-200 w-full md:w-auto"
                />

                {(value.from || value.to) && (
                    <button
                        onClick={() => onChange({ from: null, to: null })}
                        className="bg-red-500 text-white border-none py-[6px] px-[10px] rounded-md text-xs cursor-pointer transition-all duration-200 hover:bg-red-600 hover:scale-105 w-full md:w-auto"
                    >
                        Clear
                    </button>
                )}
            </div>
        );
    };

    const ColumnFilter = ({ column }) => {
        const columnFilterValue = column.getFilterValue();
        const columnDef = column.columnDef;
        const columnId = column.id;

        // Handle search input with debounce
        const handleSearchChange = useCallback(
            (value) => {
                setSearchInputs((prev) => ({ ...prev, [columnId]: value }));
                // Debounce the actual filter update
                const timeoutId = setTimeout(() => {
                    column.setFilterValue(value || undefined);
                }, 300);

                return () => clearTimeout(timeoutId);
            },
            [column, columnId],
        );

        if (columnDef.dateFilter) {
            return null; // Date filtering is handled globally
        }

        if (columnDef.dropdownFilter && columnDef.dropdownOptions) {
            return (
                <select
                    value={columnFilterValue ?? ""}
                    onChange={(e) =>
                        column.setFilterValue(e.target.value || undefined)
                    }
                    className="w-full px-[6px] py-[4px] border border-gray-300 rounded-[4px] text-[11px] outline-none transition-all duration-300 bg-white cursor-pointer box-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 hover:border-gray-400"
                >
                    <option value="">All {columnDef.header}</option>
                    {columnDef.dropdownOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (columnDef.searchField) {
            return (
                <input
                    type="text"
                    value={searchInputs[columnId] ?? columnFilterValue ?? ""}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={`Filter ${columnDef.header}...`}
                    className="w-full px-[6px] py-[4px] border border-gray-300 rounded-[4px] text-[11px] outline-none transition-all duration-300 bg-white box-border focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 hover:border-gray-400"
                />
            );
        }

        return null;
    };

    // Calculate total table width for horizontal scroll
    const totalTableWidth = useMemo(() => {
        let width = multiSelect ? 50 : 0;
        processedColumns.forEach((col) => {
            width += col.meta?.width || 150;
        });
        return Math.max(width, 800); // Minimum width
    }, [processedColumns, multiSelect]);

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center rounded-lg p-4 bg-[#f8f9fa] border-b border-[#e9ecef] gap-3">
                <div className="flex flex-col md:flex-row items-center gap-3 justify-between w-full md:w-auto md:justify-start">
                    <input
                        type="text"
                        placeholder="Search all columns..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-md text-sm min-w-[200px] outline-none transition-all duration-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:-translate-y-px md:min-w-[200px]"
                    />
                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                    />
                    {customFilters}
                </div>

                {getSelectedCount() > 0 && (
                    <div className="flex items-center gap-3 animate-[slideInRight_0.3s_ease]">
                        <span className="text-sm text-gray-700 font-medium">
                            {getSelectedCount()} selected
                        </span>
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-500 text-white border-none py-2 px-4 rounded-md text-sm cursor-pointer transition-all duration-200 hover:bg-red-600 hover:-translate-y-px hover:shadow-[0_4px_8px_rgba(239,68,68,0.3)]"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div
                className="overflow-auto max-h-[600px] relative scroll-smooth "
                style={{
                    overflowX:
                        table.getRowModel().rows.length > 0 ? "auto" : "hidden",
                }}
            >
                <table
                    className="w-full border-collapse text-sm bg-white relative table-fixed"
                    style={{ minWidth: `${totalTableWidth}px` }}
                >
                    <thead className="sticky top-0 z-10 bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <React.Fragment key={headerGroup.id}>
                                <tr className="bg-[#f8f9fa] border-b border-[#e9ecef]">
                                    {multiSelect && (
                                        <th
                                            className="w-[50px] min-w-[50px] max-w-[50px] text-center p-[8px_4px] border-r border-[#e9ecef] bg-inherit box-border sticky left-0 z-20 bg-[#f8f9fa] shadow-[2px_0_6px_rgba(59,130,246,0.1),1px_0_3px_rgba(0,0,0,0.05)] border-r-[#e9ecef]"
                                            style={{ left: 0 }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    table.getRowModel().rows
                                                        .length > 0 &&
                                                    table
                                                        .getRowModel()
                                                        .rows.every(
                                                            (row) =>
                                                                selectedRows[
                                                                    row.id
                                                                ],
                                                        )
                                                }
                                                onChange={(e) =>
                                                    toggleAllRowsSelection(
                                                        e.target.checked,
                                                    )
                                                }
                                                className="cursor-pointer scale-110 transition-all duration-200 hover:scale-125"
                                            />
                                        </th>
                                    )}
                                    {headerGroup.headers.map((header) => {
                                        const {
                                            leftSticky,
                                            rightSticky,
                                            leftOffset,
                                            rightOffset,
                                            width,
                                        } = header.column.columnDef.meta || {};

                                        return (
                                            <th
                                                key={header.id}
                                                className={`p-[8px_12px] text-left font-semibold text-gray-700 border-r border-[#e9ecef] cursor-pointer select-none relative bg-[#f8f9fa] transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis box-border align-middle hover:bg-[#e9ecef] hover:-translate-y-px ${
                                                    leftSticky
                                                        ? "md:sticky md:left-0 z-20 bg-[#f8f9fa] md:shadow-[3px_0_8px_rgba(59,130,246,0.15),2px_0_4px_rgba(0,0,0,0.1)] md:border-r-2 md:border-r-[rgba(59,130,246,0.3)]"
                                                        : ""
                                                } ${
                                                    rightSticky
                                                        ? "md:sticky md:right-0 z-20 bg-[#f8f9fa] md:shadow-[-3px_0_8px_rgba(59,130,246,0.15),-2px_0_4px_rgba(0,0,0,0.1)] md:border-l-2 md:border-l-[rgba(59,130,246,0.3)]"
                                                        : ""
                                                }`}
                                                style={{
                                                    left: leftSticky
                                                        ? `${leftOffset}px`
                                                        : undefined,
                                                    right: rightSticky
                                                        ? `${rightOffset}px`
                                                        : undefined,
                                                    width: `${width || 150}px`,
                                                    minWidth: `${
                                                        width || 150
                                                    }px`,
                                                    maxWidth: `${
                                                        width || 150
                                                    }px`,
                                                }}
                                                onClick={
                                                    header.column.getCanSort()
                                                        ? header.column.getToggleSortingHandler()
                                                        : undefined
                                                }
                                            >
                                                <div className="flex items-center justify-between gap-2 w-full group">
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <span className="text-gray-500 font-normal transition-all duration-200 opacity-70 shrink-0 group-hover:opacity-100 group-hover:scale-110">
                                                            {header.column.getIsSorted() ===
                                                            "asc"
                                                                ? " ↓"
                                                                : header.column.getIsSorted() ===
                                                                    "desc"
                                                                  ? " ↑"
                                                                  : " ↕"}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                    {expandable.expandedRowRender && (
                                        <th className="p-[8px_12px] text-left font-semibold text-gray-700 bg-[#f8f9fa] w-[100px]">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </React.Fragment>
                        ))}
                    </thead>
                    <tbody className="bg-white">
                        {table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <tr
                                    key={row.id}
                                    className={`bg-white transition-all duration-200 border-b border-[#f3f4f6] hover:bg-[#f8fafc] hover:-translate-y-px hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)] even:bg-[#fafafa] even:hover:bg-[#f1f5f9] ${
                                        hoveredRow === row.id ? "hovered" : ""
                                    }`}
                                    onMouseEnter={() => setHoveredRow(row.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                >
                                    {multiSelect && (
                                        <td
                                            className="w-[50px] min-w-[50px] max-w-[50px] text-center p-[8px_4px] border-r border-[#e9ecef] bg-inherit box-border md:sticky md:left-0 z-5 shadow-[2px_0_6px_rgba(59,130,246,0.1),1px_0_3px_rgba(0,0,0,0.05)] border-r-[rgba(59,130,246,0.2)] hover:shadow-[4px_0_12px_rgba(59,130,246,0.2),3px_0_6px_rgba(0,0,0,0.15)] hover:border-r-[3px_solid_rgba(59,130,246,0.4)]"
                                            style={{ left: 0 }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedRows[row.id] ||
                                                    false
                                                }
                                                onChange={() =>
                                                    toggleRowSelection(row.id)
                                                }
                                                className="cursor-pointer scale-110 transition-all duration-200 hover:scale-125"
                                            />
                                        </td>
                                    )}
                                    {row.getVisibleCells().map((cell) => {
                                        const {
                                            leftSticky,
                                            rightSticky,
                                            leftOffset,
                                            rightOffset,
                                            width,
                                        } = cell.column.columnDef.meta || {};

                                        return (
                                            <td
                                                key={cell.id}
                                                className={`p-[8px_12px] border-r border-[#f3f4f6] align-middle bg-inherit transition-all duration-200 whitespace-nowrap overflow-hidden text-ellipsis box-border ${
                                                    leftSticky
                                                        ? "md:sticky md:left-0 z-5 md:shadow-[2px_0_6px_rgba(59,130,246,0.1),1px_0_3px_rgba(0,0,0,0.05)] md:border-r-[rgba(59,130,246,0.2)]"
                                                        : ""
                                                } ${
                                                    rightSticky
                                                        ? "md:sticky md:right-0 z-5 md:shadow-[-2px_0_6px_rgba(59,130,246,0.1),-1px_0_3px_rgba(0,0,0,0.05)] md:border-l-[rgba(59,130,246,0.2)]"
                                                        : ""
                                                }`}
                                                style={{
                                                    left: leftSticky
                                                        ? `${leftOffset}px`
                                                        : undefined,
                                                    right: rightSticky
                                                        ? `${rightOffset}px`
                                                        : undefined,
                                                    width: `${width || 150}px`,
                                                    minWidth: `${width || 150}px`,
                                                    maxWidth: `${width || 150}px`,
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </td>
                                        );
                                    })}
                                    {expandable.expandedRowRender && (
                                        <td className="p-[8px_12px] border-r border-[#f3f4f6] align-middle bg-inherit transition-all duration-200 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedRows((prev) => ({
                                                        ...prev,
                                                        [row.id]: !prev[row.id],
                                                    }));
                                                }}
                                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all"
                                            >
                                                {expandedRows[row.id]
                                                    ? "Hide"
                                                    : "Details"}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                                {expandable.expandedRowRender &&
                                    expandedRows[row.id] && (
                                        <tr className="bg-[#f8fafc]">
                                            <td
                                                colSpan={
                                                    row.getVisibleCells()
                                                        .length +
                                                    (multiSelect ? 1 : 0) +
                                                    1
                                                }
                                                className="p-4 border-b border-[#f3f4f6]"
                                            >
                                                <div className="animate-[slideDown_0.2s_ease-out]">
                                                    {expandable.expandedRowRender(
                                                        row.original,
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {table.getRowModel().rows.length === 0 && (
                    <div className="flex flex-col items-center p-4 justify-center mt-[15px] pb-[20px]">
                        <div className="text-[80px] mb-[20px] opacity-60 animate-[float_3s_ease-in-out_infinite]">
                            📊
                        </div>
                        <div className="text-2xl font-semibold text-gray-700 mb-2">
                            No Data Available
                        </div>
                        <div className="text-base text-gray-500 mb-5 max-w-[400px] leading-relaxed">
                            There are no records to display. Try adjusting your
                            filters or search criteria.
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2 justify-center before:content-['•'] before:text-blue-500 before:font-bold">
                                Clear your search filters
                            </div>
                            <div className="flex items-center gap-2 justify-center before:content-['•'] before:text-blue-500 before:font-bold">
                                Check your date range selection
                            </div>
                            <div className="flex items-center gap-2 justify-center before:content-['•'] before:text-blue-500 before:font-bold">
                                Verify your column filters
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination & Legend */}
            <div className="bg-[#f8f9fa] border-t border-[#e9ecef]">
                <div className="flex justify-between items-center p-[8px_16px] min-h-[40px] relative md:flex-col md:gap-3">
                    <div className="text-xs text-gray-500 animate-[fadeIn_0.3s_ease]">
                        Showing{" "}
                        {table.getState().pagination.pageIndex *
                            table.getState().pagination.pageSize +
                            1}{" "}
                        to{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) *
                                table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length,
                        )}{" "}
                        of {table.getFilteredRowModel().rows.length} entries
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="p-[4px_8px] border border-gray-300 bg-white text-gray-700 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {"<<"}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-[4px_8px] border border-gray-300 bg-white text-gray-700 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ml-1"
                        >
                            {"<"}
                        </button>
                        <span className="text-xs text-gray-700 mx-[6px] font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </span>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-[4px_8px] border border-gray-300 bg-white text-gray-700 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed mr-1"
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                            className="p-[4px_8px] border border-gray-300 bg-white text-gray-700 rounded text-xs cursor-pointer transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {">>"}
                        </button>
                    </div>
                </div>

                {/* Table Legend */}
                <div className="flex justify-center gap-8 py-2 px-4 border-t border-[#f0f0f0] bg-[#fafafa]">
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-500">First</span>
                            <span className="bg-gray-200 px-1 rounded text-gray-600">
                                {"<<"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-500">Prev</span>
                            <span className="bg-gray-200 px-1 rounded text-gray-600">
                                {"<"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-500">Next</span>
                            <span className="bg-gray-200 px-1 rounded text-gray-600">
                                {">"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-500">Last</span>
                            <span className="bg-gray-200 px-1 rounded text-gray-600">
                                {">>"}
                            </span>
                        </div>
                    </div>
                    <div className="w-[1px] bg-gray-200 h-3 self-center"></div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                        <span className="text-gray-500">Sort icons:</span>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-sm">↑</span>
                            <span>Descending</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-sm">↓</span>
                            <span>Ascending</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-sm">↕</span>
                            <span>Normal</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppTable;

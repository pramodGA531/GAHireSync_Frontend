import React, { useEffect, useState } from "react";
import Main from "../Layout";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Button, Tag, Breadcrumb, Tooltip, Empty } from "antd";
import { useAuth } from "../../../common/useAuth";
import ViewResumeRecruiter from "./ViewResumeRecruiter";
import AppTable from "../../../common/AppTable";
import {
    EyeOutlined,
    MailOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined,
    ArrowLeftOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons";
import Pageloading from "../../../common/loading/Pageloading";
import GoBack from "../../../common/Goback";

const IncomingApplications = () => {
    const { job_id, location } = useParams();
    const { token, apiurl } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [isEditedByClient, setIsEditedByClient] = useState(false);

    const fetchApplications = async () => {
        try {
            setFetching(true);
            const response = await fetch(
                `${apiurl}/recruiter/incoming-applications/?job_id=${job_id}&location=${location}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await response.json();
            setApplications(data.applications || []);
            setIsEditedByClient(data.is_edited_by_client || false);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleSelectedApplication = (id) => {
        setSelectedApplication(id);
        setModalVisible(true);
    };

    useEffect(() => {
        if (token) {
            fetchApplications();
        }
    }, [token, job_id, location]);

    const columns = [
        {
            header: "Candidate Name",
            accessorKey: "candidate_name",
            sort: true,
            width: 220,
            searchField: true,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1681FF] font-bold text-xs border border-blue-100 uppercase">
                        {getValue()?.[0]}
                    </div>
                    <span className="text-gray-700 font-bold text-sm tracking-tight">
                        {getValue()}
                    </span>
                </div>
            ),
        },
        {
            header: "Contact Info",
            accessorKey: "candidate_email",
            width: 250,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 text-gray-500 font-medium text-xs">
                    <MailOutlined className="text-gray-300" />
                    <span className="truncate max-w-[200px]">{getValue()}</span>
                </div>
            ),
        },
        {
            header: "Birth Date",
            accessorKey: "date_of_birth",
            width: 140,
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                    <CalendarOutlined className="text-gray-300" />
                    <span>{getValue() || "N/A"}</span>
                </div>
            ),
        },
        {
            header: "Current Status",
            accessorKey: "status",
            width: 160,
            cell: ({ row }) => (
                <span className="bg-blue-50 text-[#1681FF] text-[10px] font-black uppercase px-2 py-1 rounded-md border border-blue-100">
                    {row.original.status || "Incoming"}
                </span>
            ),
        },
        {
            header: "Location",
            accessorKey: "location_status",
            width: 140,
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 uppercase font-black text-[9px] tracking-widest text-gray-400 px-2 py-1 bg-gray-50 rounded-md border border-gray-100 w-fit">
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${
                            row.original.location_status === "opened"
                                ? "bg-green-500"
                                : "bg-red-500"
                        }`}
                    ></div>
                    {location} ({row.original.location_status})
                </div>
            ),
        },
        {
            header: "Actions",
            id: "actions",
            width: 120,
            rightSticky: true,
            cell: ({ row }) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleSelectedApplication(row.original.id)}
                    className="rounded-xl h-10 w-full font-bold text-gray-500 hover:text-[#1681FF] hover:border-[#1681FF] transition-all flex items-center justify-center gap-2"
                >
                    Review
                </Button>
            ),
        },
    ];

    return (
        <Main defaultSelectedKey={2} defaultSelectedChildKey="2-1">
            <div className="mt-4 -ml-2 -mb-4">
                <GoBack />
            </div>
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="max-w-[1600px] mx-auto">
                    {/* Navigation/Header */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <Breadcrumb
                                items={[
                                    {
                                        title: (
                                            <span
                                                className="text-gray-400 hover:text-blue-600 cursor-pointer font-bold uppercase tracking-tighter text-[10px]"
                                                onClick={() =>
                                                    navigate(
                                                        "/recruiter/postings/opened",
                                                    )
                                                }
                                            >
                                                Assigned jobs
                                            </span>
                                        ),
                                    },
                                    {
                                        title: (
                                            <span className="text-gray-800 font-black uppercase tracking-tighter text-[10px]">
                                                Incoming Applications
                                            </span>
                                        ),
                                    },
                                ]}
                                className="mb-4"
                            />
                            <div className="flex items-center gap-3 mb-1">
                                <Button
                                    onClick={() => navigate(-1)}
                                    icon={<ArrowLeftOutlined />}
                                    shape="circle"
                                    className="border-none bg-white shadow-sm hover:text-[#1681FF]"
                                />
                                <h2 className="text-2xl font-bold text-[#071C50]">
                                    Processing Queue
                                </h2>
                                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-lg shadow-blue-100">
                                    {applications.length} Pending
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium tracking-tight mt-1">
                                Review and move candidates to the next stage of
                                the hiring pipeline.
                            </p>
                        </div>
                    </div>

                    {isEditedByClient && (
                        <div className="mb-6 bg-linear-to-r from-amber-50 to-orange-50/30 border border-amber-200/50 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                                <InfoCircleOutlined className="text-white text-lg" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-amber-900 font-black uppercase tracking-tight text-xs m-0">
                                    Pending Client Edit Request
                                </h3>
                                <p className="text-amber-600 font-bold text-[10px] uppercase tracking-wider mt-0.5 m-0 opacity-80">
                                    Please hold on until the manager reacts to
                                    the client edit request.
                                </p>
                            </div>
                        </div>
                    )}

                    {fetching ? (
                        <div className="h-64 flex items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <Pageloading />
                        </div>
                    ) : applications.length > 0 ? (
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4">
                            <AppTable
                                data={applications}
                                columns={columns}
                                pageSize={15}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-dashed border-gray-200 py-32 flex flex-col items-center justify-center text-center">
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold text-gray-400">
                                            Queue is empty
                                        </h3>
                                        <p className="text-sm text-gray-300 max-w-xs mx-auto">
                                            All applications for this location
                                            have been processed or none have
                                            arrived yet.
                                        </p>
                                    </div>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title={null}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={1000}
                centered
                destroyOnClose
                className="modal-no-padding"
            >
                <div className="animate-in fade-in zoom-in-95 duration-300">
                    <ViewResumeRecruiter
                        id={selectedApplication}
                        job_id={job_id}
                        onFinish={() => {
                            setModalVisible(false);
                            fetchApplications();
                        }}
                    />
                </div>
            </Modal>
        </Main>
    );
};

export default IncomingApplications;

import React from "react";
import Main from "./Layout";
import {
    UserAddOutlined,
    ScheduleOutlined,
    SafetyCertificateOutlined,
    BarChartOutlined,
    DashboardOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Progress, Typography } from "antd";

const { Title, Text } = Typography;

const Recruiter = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Jobs",
            description: "Manage active job postings and pipelines.",
            icon: <UserAddOutlined />,
            color: "#1681FF",
            path: "/recruiter/postings/opened",
        },
        {
            title: "Applications",
            description: "Process applications and schedule interviews.",
            icon: <ScheduleOutlined />,
            color: "#8B5CF6",
            path: "/recruiter/applications/to-schedule",
        },
        {
            title: "Reconfirmations",
            description: "Audit and verify candidate acceptances.",
            icon: <SafetyCertificateOutlined />,
            color: "#10B981",
            path: "/recruiter/reconfirmation-applications",
        },
        {
            title: "Replacements",
            description: "Manage candidate replacement requests.",
            icon: <BarChartOutlined />,
            color: "#F59E0B",
            path: "/recruiter/replacements",
        },
    ];

    const metrics = [
        { label: "Efficiency", value: 87, color: "#1681FF" },
        { label: "Precision", value: 94, color: "#10B981" },
        { label: "Velocity", value: 72, color: "#F59E0B" },
    ];

    return (
        <Main defaultSelectedKey="1" defaultSelectedChildKey="0">
            <div className="p-6 bg-[#F9FAFB] min-h-screen">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div>
                            <Title level={3} className="!m-0 text-[#071C50]">
                                Recruiter Dashboard
                            </Title>
                            <Text className="text-gray-500">
                                Welcome to your operational dashboard.
                            </Text>
                        </div>

                        {/* System Integrity Stat */}
                    </div>

                    <Row gutter={[24, 24]}>
                        {/* Actions Grid */}
                        <Col xs={24} lg={16}>
                            <Row gutter={[24, 24]}>
                                {actions.map((action, idx) => (
                                    <Col xs={24} md={12} key={idx}>
                                        <Card
                                            hoverable
                                            className="h-full rounded-2xl border-gray-100 shadow-sm hover:shadow-md transition-all"
                                            onClick={() =>
                                                navigate(action.path)
                                            }
                                        >
                                            <div className="flex flex-col h-full">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                                                    style={{
                                                        backgroundColor: `${action.color}15`,
                                                        color: action.color,
                                                    }}
                                                >
                                                    {action.icon}
                                                </div>
                                                <h3 className="text-lg font-bold text-[#071C50] mb-2">
                                                    {action.title}
                                                </h3>
                                                <p className="text-gray-500 text-sm m-0">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>

                        {/* Metrics Panel */}
                        <Col xs={24} lg={8}>
                            <Card className="h-full rounded-2xl border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-[#071C50] mb-1">
                                    Metrics Snapshot
                                </h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-6">
                                    Quarterly Performance
                                </p>

                                <div className="space-y-6">
                                    {metrics.map((metric, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span>{metric.label}</span>
                                                <span className="text-gray-400">
                                                    {metric.value}%
                                                </span>
                                            </div>
                                            <Progress
                                                percent={metric.value}
                                                strokeColor={metric.color}
                                                showInfo={false}
                                                size="small"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50">
                                    <div className="text-center text-xs text-gray-400 cursor-pointer hover:text-[#1681FF] transition-colors">
                                        View Full Scorecard
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </Main>
    );
};

export default Recruiter;

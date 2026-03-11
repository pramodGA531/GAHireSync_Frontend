import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Button, Empty, Skeleton, message } from "antd";
import {
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
   
    ArrowUpOutlined,
    PieChartOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import {IndianRupee} from "lucide-react";
import Main from "./Layout";
import { useAuth } from "../../common/useAuth";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const AccountantDashboard = () => {
    const { token, apiurl, userData } = useAuth();
    const user = typeof userData === "string" ? JSON.parse(userData) : userData;
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [stats, setStats] = useState({
        totalAmount: 0,
        paidCount: 0,
        pendingCount: 0,
        verifiedCount: 0,
        monthlyRevenue: []
    });

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/get_invoices/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.invoices) {
                setInvoices(data.invoices);
                calculateStats(data.invoices);
            }
        } catch (error) {
            message.error("Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const stats = data.reduce((acc, inv) => {
            const isSettled = inv.payment_status === "Paid" || inv.payment_verification;
            const amount = parseFloat(inv.final_price) || 0;
            
            if (isSettled) {
                acc.total += amount;
                acc.paid++;
            } else {
                acc.pending++;
            }
            
            if (inv.payment_verification) acc.verified++;
            return acc;
        }, { total: 0, paid: 0, pending: 0, verified: 0 });

        // Chart data logic: group by month from scheduled_at for SETTLED invoices
        const monthlyMap = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Initialize last 6 months
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            monthlyMap[months[d.getMonth()]] = 0;
        }

        data.forEach(inv => {
            const isSettled = inv.payment_status === "Paid" || inv.payment_verification;
            if (isSettled && inv.scheduled_at) {
                const d = new Date(inv.scheduled_at);
                const m = months[d.getMonth()];
                if (monthlyMap.hasOwnProperty(m)) {
                    monthlyMap[m] += parseFloat(inv.final_price) || 0;
                }
            }
        });

        const chartData = Object.keys(monthlyMap).map(key => ({
            name: key,
            amount: monthlyMap[key]
        }));

        setStats({
            totalAmount: stats.total,
            paidCount: stats.paid,
            pendingCount: stats.pending,
            verifiedCount: stats.verified,
            monthlyRevenue: chartData
        });
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const recentInvoicesColumns = [
        {
            title: "Invoice Code",
            dataIndex: "invoice_code",
            key: "invoice_code",
            render: (text) => <span className="font-medium text-blue-600">{text}</span>
        },
        {
            title: "Client",
            dataIndex: "client_email",
            key: "client_email",
            ellipsis: true
        },
        {
            title: "Status",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (status) => (
                <Tag color={status === "Paid" ? "success" : "warning"} className="rounded-full px-3 text-[10px] uppercase font-bold border-none">
                    {status}
                </Tag>
            )
        },
        {
            title: "Verification",
            dataIndex: "payment_verification",
            key: "payment_verification",
            render: (verified) => (
                <BadgeStatus verified={verified} />
            )
        }
    ];

    const BadgeStatus = ({ verified }) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            verified ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-600"
        }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${verified ? "bg-blue-500" : "bg-gray-400"}`}></span>
            {verified ? "Verified" : "Pending"}
        </span>
    );

    return (
        <Main defaultSelectedKey="1">
            <div className="p-6 bg-[#F8FAFC] min-h-screen">
                {/* Header Section */}
                <div className="mb-8 flex justify-between items-end px-2">
                    <div>
                        <h1 className="text-2xl font-black text-[#071C50] mb-1">
                            Welcome back, {user?.username || 'Accountant'}!
                        </h1>
                        <p className="text-gray-400 text-sm">Real-time revenue tracking and invoice verification engine.</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <Row gutter={[24, 24]} className="mb-8 px-2">
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="rounded-3xl shadow-sm border h-36 border-gray-100 hover:shadow-md transition-all">
                            <Statistic
                                title={<span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Revenue</span>}
                                value={stats.totalAmount}
                                precision={2}
                                valueStyle={{ color: '#071C50', fontWeight: 900, fontSize: '24px' }}
                                prefix={<IndianRupee className="text-black mr-2" />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="rounded-3xl shadow-sm border h-36 border-gray-100 hover:shadow-md transition-all">
                            <Statistic
                                title={<span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Settled Invoices</span>}
                                value={stats.paidCount}
                                valueStyle={{ color: '#10B981', fontWeight: 900, fontSize: '24px' }}
                                prefix={<CheckCircleOutlined className="mr-2" />}
                            />
                            <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Settlement Rate: {Math.round((stats.paidCount / (invoices.length || 1)) * 100)}%</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="rounded-3xl shadow-sm border h-36 border-gray-100 hover:shadow-md transition-all">
                            <Statistic
                                title={<span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Verification Queue</span>}
                                value={stats.pendingCount}
                                valueStyle={{ color: '#F59E0B', fontWeight: 900, fontSize: '24px' }}
                                prefix={<ClockCircleOutlined className="mr-2" />}
                            />
                            <div className="mt-2 text-[10px] text-blue-500 font-bold uppercase cursor-pointer hover:underline tracking-tighter">Action Required →</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card bordered={false} className="rounded-3xl shadow-sm h-36 border border-gray-100 hover:shadow-md transition-all">
                            <Statistic
                                title={<span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Documents Master</span>}
                                value={invoices.length}
                                valueStyle={{ color: '#6366F1', fontWeight: 900, fontSize: '24px' }}
                                prefix={<FileTextOutlined className="mr-2" />}
                            />
                            <div className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Live Database Count</div>
                        </Card>
                    </Col>
                </Row>

                {/* Charts and Tables */}
                <Row gutter={[24, 24]} className="px-2">
                    <Col xs={24} lg={15}>
                        <Card 
                            title={<span className="font-black text-[#071C50] flex items-center gap-2 tracking-tight"><PieChartOutlined /> Revenue Velocity</span>} 
                            bordered={false} 
                            className="rounded-3xl shadow-sm border border-gray-100 h-full overflow-hidden"
                        >
                            <div className="h-[300px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.monthlyRevenue}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 'bold'}} />
                                        <Tooltip 
                                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px'}}
                                            itemStyle={{color: '#071C50', fontWeight: 'bold'}}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={9}>
                        <Card 
                            title={<span className="font-black text-[#071C50] tracking-tight">Recent Ledger</span>} 
                            // extra={<Button type="link" className="p-0 text-blue-500 font-bold text-xs uppercase tracking-widest">History</Button>}
                            bordered={false} 
                            className="rounded-3xl shadow-sm border border-gray-100 h-full overflow-hidden"
                            bodyStyle={{ padding: 0 }}
                        >
                            {loading ? (
                                <div className="p-6"><Skeleton active /></div>
                            ) : invoices.length > 0 ? (
                                <Table
                                    dataSource={invoices.slice(0, 6)}
                                    columns={recentInvoicesColumns}
                                    pagination={false}
                                    size="middle"
                                    rowKey="id"
                                    className="custom-dashboard-table"
                                />
                            ) : (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-12" />
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>

            <style jsx>{`
                .custom-dashboard-table :global(.ant-table-thead > tr > th) {
                    background: #F8FAFC !important;
                    color: #94A3B8 !important;
                    font-size: 10px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    font-weight: 800 !important;
                    border-bottom: 2px solid #F1F5F9 !important;
                }
                .custom-dashboard-table :global(.ant-table-tbody > tr > td) {
                    border-bottom: 1px solid #F8FAFC !important;
                    padding: 16px !important;
                    font-size: 13px !important;
                }
                .custom-dashboard-table :global(.ant-table-tbody > tr:hover > td) {
                    background: #F1F5F9 !important;
                }
            `}</style>
        </Main>
    );
};

export default AccountantDashboard;
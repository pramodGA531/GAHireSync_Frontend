import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import SideNav from "../client/SideNav";
import {
    Typography,
    Alert,
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Spin,
    Result,
} from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined } from "@ant-design/icons";

import TopNav from "../client/TopNav";

const apiurl = import.meta.env.VITE_BACKEND_URL;

const Profile = ({ onBack }) => {
    const navigate = useNavigate();
    const { authToken, login, logout } = useContext(AuthContext);

    const [userDetails, setUserDetails] = useState({
        designation: null,
        contact_number: null,
        website_url: null,
        gst: null,
        company_pan: null,
        company_address: null,
        state: null,
        city: null,
    });

    const [user, setUser] = useState({
        username: null,
        email: null,
        role: null,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { Title } = Typography;

    const handleLogout = () => {
        sessionStorage.removeItem("authToken");
        logout();
        navigate("/");
    };

    const toggleProfile = () => {
        navigate("/edit_profile/");
    };
    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            login(token);
        }
    }, []);

    useEffect(() => {
        if (!authToken) {
            navigate("/login");
        } else {
            const fetchUserDetails = async () => {
                console.log("data from the user");
                try {
                    const response = await fetch(`${apiurl}/api/user_view/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error(
                            "Failed to fetch user details Here We stucked "
                        );
                    }

                    const data = await response.json();
                    setUser(data.data);

                    setUserDetails(data.role_data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserDetails();
        }
    }, [authToken]);

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (error) {
        return (
            <Result
                status="error"
                title="Error"
                subTitle={`Error: ${error}`}
                extra={[
                    <Button key="back" onClick={onBack}>
                        Back
                    </Button>,
                ]}
            />
        );
    }

    if (!user || !user.username) {
        return (
            <Result
                status="warning"
                title="No user details found"
                extra={[
                    <Button key="back" onClick={() => navigate(-1)}>
                        Back
                    </Button>,
                ]}
            />
        );
    }

    return (
        <div className="no_overflow">
            <TopNav />
            <div className="flex">
                <SideNav />
                <div className="flex flex-col items-center w-[85vw] max-h-[89vh] overflow-auto">
                    <img
                        src="../src/media/modi.png"
                        alt="profile img"
                        className="mt-[5px] h-[155px] w-[200px] bg-[#bbb] rounded-full inline-block"
                    />
                    <Card
                        style={{
                            width: "60vw",
                            margin: "20px auto",
                            padding: "20px",
                        }}
                    >
                        <Form layout="vertical">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Form.Item label="Name">
                                        <Input
                                            prefix={<UserOutlined />}
                                            value={user.username}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Designation">
                                        <Input
                                            prefix={<IdcardOutlined />}
                                            value={userDetails.designation}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Email">
                                        <Input
                                            prefix={<MailOutlined />}
                                            value={user.email}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Contact Number">
                                        <Input
                                            value={userDetails.contact_number}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="GST">
                                        <Input
                                            value={userDetails.gst}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Pan Number">
                                        <Input
                                            value={userDetails.company_pan}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Website URL">
                                        <Input
                                            value={userDetails.website_url}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Company address">
                                        <Input
                                            value={userDetails.company_address}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Form.Item label="City">
                                        <Input
                                            value={userDetails.city}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="State">
                                        <Input
                                            value={userDetails.state}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Role">
                                        <Input
                                            prefix={<IdcardOutlined />}
                                            value={user.role}
                                            readOnly
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    <div className="flex justify-between mt-5 w-full max-w-[600px] gap-4">
                        <Button
                            className="bg-[#6c757d] hover:bg-[#5a6268] text-white border-none"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                        <Button
                            className="bg-[#6c757d] hover:bg-[#5a6268] text-white border-none"
                            onClick={toggleProfile}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            className="bg-[#6c757d] hover:bg-[#5a6268] text-white border-none"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </Button>
                    </div>
                </div>
            </div>
            {/* <h1>ameer</h1> */}
        </div>
    );
};

export default Profile;

// import React, { useContext, useEffect } from "react";

// import { AuthContext } from "../../context/context";

// const Profile_sec = () => {
//   const { authToken, login, logout } = useContext(AuthContext);
//   useEffect(() => {
//     const token = sessionStorage.getItem("authToken");
//     // console.log(token);
//     login(token);
//   }, []);
// // console.log(authToken)

//   useEffect(()=>{
//     if(!authToken){
//       console.log("...loading I think try promise here");
//     }else{
//       console.log("yes got it",authToken)
//     }
//     },[authToken])

//   if (authToken) {
//     return <div>token got</div>;
//   } else {
//     return <div>...........loading </div>;
//   }
// };

// export default Profile_sec;

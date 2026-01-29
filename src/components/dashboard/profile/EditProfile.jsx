import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
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
import {
    UserOutlined,
    MailOutlined,
    IdcardOutlined,
    ArrowRightOutlined,
    FilterOutlined,
} from "@ant-design/icons";
import "./Profile_sec.css";
import TopNav from "../client/TopNav";
import SideNav from "../client/SideNav";
const apiurl = import.meta.env.VITE_BACKEND_URL;

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { authToken, login } = useContext(AuthContext);
    const { Title } = Typography;
    const [userDetails, setUserDetails] = useState({
        username: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            login(token);
        }
    }, []);

    useEffect(() => {
        if (authToken) {
            const fetchUserDetails = async () => {
                try {
                    const response = await fetch(`${apiurl}/api/user_view/`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch user details");
                    }

                    const data = await response.json();
                    setUserDetails(data.data);
                } catch (err) {
                    console.error(err);
                }
            };

            fetchUserDetails();
        }
    }, [authToken]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${apiurl}/api/update_details/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    email: userDetails.email,
                    role: userDetails.role,
                }),
            });
            if (!response.ok) {
                console.error("there is an error, changes not updataed");
            }
            console.log("changes updated");
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className=" no-overflow">
            <TopNav></TopNav>
            {/* <div className='topnavi'>
              <img src="../src/media/ga_orgsync.png" alt="Home page img" width={50} height={30} style={{ position: 'absolute',top: 0,left: 0,width: '70px', height: 'auto'}}/>
              <div>
              <Button variant="text" className="login-button button-secondary"onClick={clientInformation} style={{backgroundColor:"grey",borderColor:"white",left:400,top:3,textDecorationColor:'white'}}>Pending Interviews
              <FilterOutlined style={{ marginLeft: '8px' }}/>
              </Button>
              </div>
              <img src="../src/media/notif2.png" alt="Notif icon"  style={{position:'absolute',top:12, right:152,width: '40px',height:'30px' }}/>
             
              <Button variant="text" className="login-button button-secondary" onClick={handleBack} style={{backgroundColor:"white",borderColor:"white",margintop: '30px', position: 'absolute',top: 3,right: 8,width: '120px', height: 'auto'}}>
              <img src="../src/media/modi.png" alt="profile img" width={20} height={20}  style={{marginLeft:3, marginTop:5,borderRadius:50}}/>
              <ArrowRightOutlined style={{ marginLeft: '8px' }} />
              </Button>
          </div> */}
            <div className="flex ">
                <SideNav></SideNav>
                <div className="data-overflow  items-center">
                    <Title level={2}>Edit User Profile</Title>
                    <img
                        src="../src/media/modi.png"
                        alt="profile img"
                        width={100}
                        height={100}
                        style={{
                            marginLeft: 10,
                            marginTop: 5,
                            marginBottom: 10,
                            borderRadius: 50,
                        }}
                    />
                    <Card
                        style={{
                            maxWidth: 600,
                            margin: "0 auto",
                            padding: "20px",
                        }}
                    >
                        <Form layout="vertical">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Form.Item label="Name">
                                        <Input
                                            prefix={<UserOutlined />}
                                            name="username"
                                            value={userDetails.username}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Designation">
                                        <Input
                                            prefix={<IdcardOutlined />}
                                            name="designation"
                                            value={userDetails.designation}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Email">
                                        <Input
                                            prefix={<MailOutlined />}
                                            name="email"
                                            value={userDetails.email}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Contact Number">
                                        <Input
                                            name="contact_number"
                                            value={userDetails.contact_number}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="GST">
                                        <Input
                                            name="gst"
                                            value={userDetails.gst}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Pan Number">
                                        <Input
                                            name="company_pan"
                                            value={userDetails.company_pan}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Website URL">
                                        <Input
                                            name="website_url"
                                            value={userDetails.website_url}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Company address">
                                        <Input
                                            name="company_address"
                                            value={userDetails.company_address}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Form.Item label="City">
                                        <Input
                                            name="city"
                                            value={userDetails.city}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="State">
                                        <Input
                                            name="state"
                                            value={userDetails.state}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Form.Item label="Role">
                                        <Input
                                            name="role"
                                            prefix={<IdcardOutlined />}
                                            value={userDetails.role}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    {/* <p className="field">
                    <strong>Name:</strong> {userDetails.username} {loading && <span className="loading">loading...</span>}
                </p>
                <div className="field">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={userDetails.email} onChange={handleChange} />
                </div>
                <div className="field">
                    <label htmlFor="role">Role:</label>
                    <input type="text" id="role" name="role" value={userDetails.role} onChange={handleChange} />
                </div> */}
                    <div className="button-container">
                        <button className="button" onClick={handleSubmit}>
                            Submit
                        </button>
                        <button
                            className="button button-secondary"
                            onClick={handleBack}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;

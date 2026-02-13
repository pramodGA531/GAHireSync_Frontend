import { useAuth } from "../../useAuth";
import { message, Button, Avatar } from "antd";
import { useEffect, useState } from "react";
import Profile from "../../../../images/Client/profile.png";
import {
    PlusOutlined,
    LogoutOutlined,
    CameraOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Pageloading from "../../loading/Pageloading";

const ProfileCard = ({ hideEdit }) => {
    const { apiurl, token } = useAuth();
    const [data, setData] = useState(null);
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Fetch User Profile Data
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/get-user-details/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();

            if (result.error) {
                message.error(result.error);
            } else if (result.data) {
                setData(result.data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    // Handle File Selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (!file.type.startsWith("image/")) {
                message.error("Only image files are allowed!");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                message.error("File size should be less than 5MB!");
                return;
            }
            uploadProfileImage(file);
        }
    };

    // Upload Image to Backend
    const uploadProfileImage = async (file) => {
        const formData = new FormData();
        formData.append("profile", file);

        try {
            setLoading(true);
            const response = await fetch(`${apiurl}/add-profile/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                message.success("Profile picture updated successfully!");
                fetchData(); // Refresh profile data
            }
        } catch (e) {
            console.log(e);
            message.error("Failed to upload image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    return (
        <div className="w-full">
            {loading && !data ? (
                <div className="h-64 flex items-center justify-center">
                    <Pageloading />
                </div>
            ) : (
                <>
                    {data && (
                        <div className="bg-white m-6 rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-all hover:shadow-md">
                            {/* Background Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 z-0"></div>

                            <div className="relative z-10">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100">
                                        <img
                                            src={
                                                data.profile
                                                    ? `${apiurl}${data.profile}`
                                                    : Profile
                                            }
                                            alt={`${data.username}'s profile`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Hidden file input */}
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1681FF] text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#0061D5] transition-all transform hover:scale-110 z-20"
                                    >
                                        <CameraOutlined className="text-lg" />
                                    </label>
                                </div>
                            </div>

                            <div className="flex-1 m-2 text-center md:text-left relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <h2 className="text-2xl font-bold text-[#071C50]">
                                                {data.username}
                                            </h2>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm">
                                                <MailOutlined className="text-gray-400" />
                                                <span>{data.email}</span>
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-xs">
                                                <UserOutlined className="text-gray-300" />
                                                <span className="uppercase tracking-widest font-bold">
                                                    Role:{" "}
                                                    {data.role || "Member"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {/* {!hideEdit && (
                                            // <Button
                                            //     className="h-10 px-6 rounded-xl border-gray-200 text-gray-600 font-bold hover:text-[#1681FF] hover:border-[#1681FF] transition-all"
                                            //     onClick={() =>
                                            //         navigate("/profile/edit")
                                            //     }
                                            // >
                                            //     Edit Profile
                                            // </Button>
                                        )} */}
                                        <Button
                                            danger
                                            className="h-10 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-red-50"
                                            onClick={() => {
                                                handleLogout();
                                                navigate("/login");
                                            }}
                                        >
                                            <LogoutOutlined /> Logout
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfileCard;

import { useAuth } from "../../useAuth";
import { message, Button, Input } from "antd";
import {
    PlusOutlined,
    LogoutOutlined,
    LockOutlined,
    MailOutlined,
    CameraOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePlaceholder from "../../../../images/Client/profile.png";

const IntProfileCard = () => {
    const { apiurl, token, handleLogout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${apiurl}/get-user-details/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await response.json();
            if (result.error) {
                message.error(result.error);
            } else {
                setUserData(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                message.error("Only image files are allowed!");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                message.error("File size should be less than 5MB!");
                return;
            }
            uploadProfile(file);
        }
    };

    const uploadProfile = async (file) => {
        const formData = new FormData();
        formData.append("profile", file);

        try {
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
                fetchUserData();
            }
        } catch (e) {
            console.log(e);
            message.error("Failed to upload image. Please try again.");
        }
    };

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError("Confirm password does not match new password.");
            return;
        }

        setPasswordError("");

        try {
            const response = await fetch(`${apiurl}/change-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    old_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                message.success(
                    data.message || "Password updated successfully!"
                );
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                message.error(data.error || "Failed to update password!");
            }
        } catch (error) {
            console.error(error);
            message.error("Something went wrong!");
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token]);

    return (
        <div className="w-full max-w-4xl mx-auto py-8 px-4">
            {userData && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row">
                    {/* Left Session: Profile Info */}
                    <div className="md:w-1/3 bg-[#F8FAFC] p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-100">
                        <div className="relative mb-6 group">
                            <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-gray-100 relative z-10">
                                <img
                                    src={
                                        userData.profile
                                            ? `${apiurl}${userData.profile}`
                                            : ProfilePlaceholder
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                            </div>
                            <input
                                type="file"
                                accept="image/png, image/jpeg"
                                id="profile-upload"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="profile-upload"
                                className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#1681FF] text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-[#0061D5] transition-all transform hover:scale-110 z-20"
                            >
                                <CameraOutlined className="text-lg" />
                            </label>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#071C50] mb-1">
                                {userData.username}
                            </h2>
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm justify-center mb-4">
                                <MailOutlined className="text-gray-400" />
                                <span>{userData.email}</span>
                            </div>
                            <span className="bg-blue-100/50 text-blue-700 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full border border-blue-200">
                                {userData.role || "Member"} Account
                            </span>
                        </div>

                        <Button
                            danger
                            className="w-full h-12 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-red-50 hover:bg-red-50 transition-all border-red-200"
                            onClick={() => {
                                handleLogout();
                                navigate("/login");
                            }}
                        >
                            <LogoutOutlined /> Logout
                        </Button>
                    </div>

                    {/* Right Section: Settings/Password Form */}
                    <div className="md:w-2/3 p-8 lg:p-12">
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-[#071C50] mb-2">
                                Security
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                Update your password.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1681FF] mb-2 block">
                                    Email
                                </label>
                                <Input
                                    prefix={
                                        <MailOutlined className="text-gray-300 mr-2" />
                                    }
                                    value={userData.email}
                                    disabled
                                    className="h-12 rounded-xl !bg-gray-50 !border-gray-200 !text-gray-400 font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                        Current Password
                                    </label>
                                    <Input.Password
                                        prefix={
                                            <LockOutlined className="text-gray-300 mr-2" />
                                        }
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) =>
                                            setCurrentPassword(e.target.value)
                                        }
                                        className="h-12 rounded-xl border-gray-200 focus:border-blue-500"
                                    />
                                    {passwordError && (
                                        <p className="text-red-500 text-[10px] font-bold mt-1 uppercase transform transition-all animate-bounce">
                                            {passwordError}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                            New Password
                                        </label>
                                        <Input.Password
                                            prefix={
                                                <LockOutlined className="text-gray-300 mr-2" />
                                            }
                                            placeholder="Create new"
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
                                            Confirm Password
                                        </label>
                                        <Input.Password
                                            prefix={
                                                <LockOutlined className="text-gray-300 mr-2" />
                                            }
                                            placeholder="Repeat new"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            className="h-12 rounded-xl border-gray-200 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="primary"
                                    onClick={handleSubmit}
                                    className="w-full md:w-auto h-12 px-10 rounded-2xl bg-[#1681FF] hover:bg-[#0061D5] font-bold shadow-lg shadow-blue-100 transition-all border-none"
                                >
                                    Update Password
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntProfileCard;

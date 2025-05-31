import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false); // 🔹 Loading state

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // 🔹 Start loading
        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/user/signup",
                {
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            console.log("Signup Response:", response.data);
            toast.success(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Signup Failed");
        } finally {
            setLoading(false); // 🔹 Stop loading
        }
    };

    return (
        <div className="bg-black h-screen flex justify-center items-center">
            <Toaster position="top-center" reverseOrder={false} />
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-4 rounded-lg text-white w-auto"
            >
                <h2 className="text-center text-xl font-bold mb-4">Signup</h2>

                <div className="mb-4">
                    <input
                        placeholder='firstname'
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <input
                        placeholder='lastname'
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <input
                        placeholder='email'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <input
                        placeholder='password'
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {loading ? 'Signing up...' : 'Signup'}
                </button>

                <p className="text-center text-sm mt-4">
                    By clicking Signup, you agree to our Terms, Privacy Policy, and Cookie Policy.
                </p>
                <p className="text-center text-sm mt-2 flex justify-between px-3">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Signup;

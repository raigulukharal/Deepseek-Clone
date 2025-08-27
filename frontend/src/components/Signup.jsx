import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { authAPI } from '../services/authAPI';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await authAPI.signup({
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
            });

            console.log("Signup Response:", response.data);
            toast.success(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Signup Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black min-h-screen flex justify-center items-center p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-lg text-white w-full max-w-md"
            >
                <h2 className="text-center text-2xl font-bold mb-6">Signup</h2>

                <div className="mb-4">
                    <input
                        placeholder='First Name'
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        placeholder='Last Name'
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        placeholder='Email'
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        placeholder='Password'
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded text-white font-semibold ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
                >
                    {loading ? 'Signing up...' : 'Signup'}
                </button>

                <p className="text-center text-sm mt-6 text-gray-400">
                    By clicking Signup, you agree to our Terms, Privacy Policy, and Cookie Policy.
                </p>
                <p className="text-center text-sm mt-4 flex justify-center gap-1">
                    <span className="text-gray-400">Already have an account?</span>
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
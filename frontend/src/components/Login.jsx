import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setlogin } from '../../redux/authSlice';
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
            const res = await axios.post(
                "http://localhost:4000/api/v1/user/login",
                {
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            console.log("Login Response:", res.data);
            toast.success(res.data.message);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            dispatch(setlogin({ 
                user: res.data.user, 
                token: res.data.token 
              }));
           
            
            navigate('/');
        } catch (error) {
            console.error("Login Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login Failed");
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
                <h2 className="text-center text-xl font-bold mb-4">Login</h2>

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
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-sm mt-4">
                    By clicking Login, you agree to our Terms, Privacy Policy, and Cookie Policy.
                </p>
                <p className="text-center text-sm mt-2 flex justify-between px-3">
                    Have not account?{' '}
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Signup
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;

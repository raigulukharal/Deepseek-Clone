import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setlogin } from '../../redux/authSlice';
import { authAPI } from '../services/authAPI';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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
            const res = await authAPI.login({
                email: formData.email,
                password: formData.password,
            });

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
                <h2 className="text-center text-2xl font-bold mb-6">Login</h2>

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
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p className="text-center text-sm mt-6 text-gray-400">
                    By clicking Login, you agree to our Terms, Privacy Policy, and Cookie Policy.
                </p>
                <p className="text-center text-sm mt-4 flex justify-center gap-1">
                    <span className="text-gray-400">Have not account?</span>
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Signup
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
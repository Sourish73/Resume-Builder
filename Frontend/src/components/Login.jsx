import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { validateEmail } from '../utils/helper';
import { Input } from '../components/Inputs';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const Login = ({ setCurrentPage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
    }
    if (!password || password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return;
    }

    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { 
            email, 
            password 
        });
        
        console.log("Full login response:", response); // Debug log
        console.log("Login response data:", response.data); // Debug log
        
        if (response.data && response.data.token) {
    const { token, _id, name, email } = response.data;
    console.log("User data from login:", { _id, name, email }); // Debug
    localStorage.setItem('token', token);
    updateUser({ _id, name, email });
    navigate('/dashboard');
} else {
            console.error("Unexpected login response structure:", response.data);
            setError('Authentication failed. Invalid response from server.');
        }
    } catch (error) {
        console.error("Login error:", error);
        console.error("Error response:", error.response?.data); // Debug log
        
        if (error.response) {
            if (error.response.status === 401) {
                setError('Invalid email or password');
            } else if (error.response.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError(error.response.data?.message || 'Something went wrong. Please try again.');
            }
        } else if (error.request) {
            setError('Network error. Please check your internet connection.');
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
    } finally {
        setIsLoading(false);
    }
};
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-auto">
            <div className="text-center mb-8">
                <h3 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Sign in to continue building amazing resumes
                </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your Email"
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                        required
                    />
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 8 Characters"
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors pr-10"
                        required
                        minLength="8"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md animate-fade-in">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-3.5 px-6 rounded-lg font-bold text-lg shadow-lg hover:from-purple-800 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center disabled:opacity-70"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin mr-2" />
                            Signing In...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <p className="text-md text-gray-700 text-center mt-8">
                    Don't have an account?{' '}
                    <button
                        onClick={() => setCurrentPage('signup')}
                        type="button"
                        className="text-purple-700 font-bold hover:text-indigo-700 hover:underline ml-2 transition-colors duration-200"
                    >
                        Sign Up
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;
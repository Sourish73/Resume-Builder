import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { Eye, EyeOff, AlertCircle, Loader2, CheckCircle, Server } from 'lucide-react';

const SignUp = ({ setCurrentPage }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!fullName.trim()) {
            setError('Please enter your full name.');
            return false;
        }
        
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return false;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        
        return true;
    };
const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            name: fullName,
            email,
            password,
        });
        updateUser(response.data);
        
        // Debug: Log the full response to see its structure
        console.log("Full API response:", response);
        console.log("Registration response:", response.data);
        
        // Check if response.data exists and has the expected structure
        if (response.data && response.data.token) {
            const { token, user: userData } = response.data;
            localStorage.setItem('token', token);
            updateUser(userData || response.data); // Handle both response structures
            setSuccess('Account created successfully! Redirecting...');
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } else {
            // Handle unexpected response structure
            setError('Unexpected response from server. Please try again.');
            console.error('Unexpected response structure:', response.data);
        }
    } catch (error) {
        console.error("API Registration Error:", error);
        
        if (error.code === 'ERR_NETWORK') {
            setError('Cannot connect to server. Please make sure your backend is running.');
        } else if (error.response) {
            // Handle different error status codes
            if (error.response.status === 409) {
                setError('An account with this email already exists.');
            } else if (error.response.status === 400) {
                setError(error.response.data.message || 'Invalid data submitted.');
            } else if (error.response.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError(error.response.data?.message || 'Something went wrong. Please try again.');
            }
        } else if (error.request) {
            setError('Network error. Please check your connection.');
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
                <h3 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Join thousands of professionals today</p>
            </div>
            
            <form onSubmit={handleSignup} className="w-full space-y-6">
                {/* Form fields remain the same as before */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Harry Sinha"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="harry@example.com"
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
                
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors pr-10"
                        required
                        minLength="8"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md">
                        <AlertCircle size={16} />
                        <div>{error}</div>
                    </div>
                )}
                
                {success && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium p-3 bg-green-50 rounded-md">
                        <CheckCircle size={16} />
                        {success}
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
                            Creating Account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
                
                <p className="text-md text-gray-700 text-center mt-8">
                    Already have an account?{' '}
                    <button
                        onClick={() => setCurrentPage('login')}
                        type="button"
                        className="text-purple-700 font-bold hover:text-indigo-700 hover:underline ml-2 transition-colors duration-200"
                    >
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
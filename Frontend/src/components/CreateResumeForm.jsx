import React, { useState } from 'react';
import { Input } from './Inputs'; // Make sure this import path is correct
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { Loader2 } from 'lucide-react'; // Import loader for better UX

export const CreateResumeForm = ({ onClose }) => {
    const [title, setTitle] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateResume = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            setError("Please enter resume title");
            return;
        }
        
        setError("");
        setIsLoading(true);
        
        try {
            const response = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
                title: title.trim(),
            });
            
            if (response.data?._id) {
                navigate(`/resume/${response.data._id}`); // Fixed: added slash at beginning
                if (onClose) onClose(); // Close modal if provided
            }
        } catch (error) {
            console.error("Create resume error:", error);
            
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.code === 'ERR_NETWORK') {
                setError('Network error. Please check your connection.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg'>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>Create New Resume</h3>
            <p className='text-gray-600 mb-8'>
                Give your resume a title to get started. You can customize everything later.
            </p>
            
            <form onSubmit={handleCreateResume}>
                <Input 
                    value={title} 
                    onChange={({ target }) => setTitle(target.value)}
                    label='Resume Title' 
                    placeholder='e.g., Harry, Software Engineer'
                    type='text'
                    disabled={isLoading}
                />
                
                {error && <p className='text-red-500 text-sm mb-4 mt-2'>{error}</p>}

                <button 
                    type='submit' 
                    disabled={isLoading}
                    className='w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center'
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={20} className="animate-spin mr-2" />
                            Creating...
                        </>
                    ) : (
                        'Create Resume'
                    )}
                </button>
            </form>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; //

const PasswordStrengthIndicator = ({ password }) => {

    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()]/.test(password);

    const Requirement = ({ label, isMet }) => (
        <li className={`flex items-center text-sm transition-colors ${isMet ? 'text-green-600 dark:text-green-400' : 'text-muted-light dark:text-muted-dark'}`}>
            {isMet ? (

                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ) : (

                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            {label}
        </li>
    );

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2 px-1">
            <Requirement label="At least 8 characters" isMet={hasLength} />
            <Requirement label="One lowercase letter" isMet={hasLowercase} />
            <Requirement label="One uppercase letter" isMet={hasUppercase} />
            <Requirement label="One number" isMet={hasNumber} />
            <Requirement label="One special character" isMet={hasSpecialChar} />
        </ul>
    );
};



const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();


    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'name':
                if (!value) error = 'Name is required.';
                else if (value.length < 2 || value.length > 50) error = 'Name must be 2-50 characters.';
                else if (!/^[a-zA-Z\s'-]+$/.test(value)) error = 'Name can only contain letters, spaces, hyphens, or apostrophes.';
                break;
            case 'email':
                if (!value) error = 'Email is required.';
                else if (!/^[a-zA-Z0-9._%+-]+@.+\.edu\.in$/.test(value)) error = 'Must be a valid .edu.in email address.';
                break;
            case 'password':
                if (!value) error = 'Password is required.';


                else if (value.length < 8) error = 'Password must be at least 8 characters long.';
                break;
            default:
                break;
        }

        setFormErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };


    const validateForm = () => {
        const { name, email, password } = formData;
        const errors = {};


        if (!name) errors.name = 'Name is required.';
        else if (name.length < 2 || name.length > 50) errors.name = 'Name must be 2-50 characters.';
        else if (!/^[a-zA-Z\s'-]+$/.test(name)) errors.name = 'Invalid characters in name.';


        if (!email) errors.email = 'Email is required.';
        else if (!/^[a-zA-Z0-9._%+-]+@.+\.edu\.in$/.test(email)) errors.email = 'Must be a valid .edu.in email address.';


        if (!password) errors.password = 'Password is required.';
        else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
        else if (!/[a-z]/.test(password)) errors.password = 'Password needs a lowercase letter.';
        else if (!/[A-Z]/.test(password)) errors.password = 'Password needs an uppercase letter.';
        else if (!/\d/.test(password)) errors.password = 'Password needs a number.';
        else if (!/[!@#$%^&*()]/.test(password)) errors.password = 'Password needs a special character.';

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!validateForm()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });


            login(
                { id: response.data.id, name: response.data.name, email: response.data.email },
                response.data.token
            );

            toast.success("Account created successfully!");
            navigate('/');

        } catch (err) {

            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            console.error("Registration error:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-background-light dark:bg-slate-900 px-4 py-12">
            <div className="w-full max-w-md bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-xl border border-border-light dark:border-border-dark">
                {/* Logo and Title */}
                <div className="flex flex-col items-center mb-8">
                     <div className="bg-gradient-to-br from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 p-3 rounded-full shadow-lg mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark">Create Account</h2>
                    <p className="text-muted-light dark:text-muted-dark text-sm mt-1">Join the ToolSwap community</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name" // Make sure 'name' matches state key
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={(e) => validateField(e.target.name, e.target.value)} // Also validate on blur
                            placeholder="Your Name"
                            // Conditionally apply error styles
                            className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:border-transparent transition duration-150 ease-in-out placeholder:text-muted-light dark:placeholder:text-muted-dark ${
                                formErrors.name ? 'border-red-500 dark:border-red-600 ring-1 ring-red-500' : 'border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-light'
                            }`}
                        />
                        {/* Show error message below the field */}
                        {formErrors.name && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{formErrors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5" htmlFor="email">
                            University Email (.edu.in)
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                            placeholder="you@university.edu.in"
                            className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:border-transparent transition duration-150 ease-in-out placeholder:text-muted-light dark:placeholder:text-muted-dark ${
                                formErrors.email ? 'border-red-500 dark:border-red-600 ring-1 ring-red-500' : 'border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-light'
                            }`}
                        />
                        {formErrors.email && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{formErrors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-1.5" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={(e) => validateField(e.target.name, e.target.value)}
                            placeholder="••••••••"
                            className={`w-full px-3 py-2.5 bg-white dark:bg-slate-800 border rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:border-transparent transition duration-150 ease-in-out placeholder:text-muted-light dark:placeholder:text-muted-dark ${
                                formErrors.password ? 'border-red-500 dark:border-red-600 ring-1 ring-red-500' : 'border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary dark:focus:ring-primary-light'
                            }`}
                        />
                        {/* Show password strength indicator only if user starts typing */}
                        {formData.password && <PasswordStrengthIndicator password={formData.password} />}
                        {/* Show general password error from submit validation */}
                        {formErrors.password && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{formErrors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700 text-white py-2.5 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-opacity duration-150 ease-in-out font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>


                <p className="text-center text-muted-light dark:text-muted-dark text-sm mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary dark:text-primary-light hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
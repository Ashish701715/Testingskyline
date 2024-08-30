import React, { useState } from 'react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header>
            <div className="relative bg-white">
                <div className="relative px-4 mx-auto sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-center h-16 lg:h-20 ">
                        <button onClick={toggleMobileMenu} type="button" className="inline-flex p-2 text-white transition-all duration-200 rounded-md lg:hidden focus:bg-gray-800 hover:bg-gray-800">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>

                        <div className="hidden lg:flex lg:items-center lg:space-x-10 font-black-a">
                            <div className="flex-shrink-0">
                                <a href="#" title="" className="flex">
                                    <img className="w-auto h- lg:h-12" src="https://skylineimmigration.com/wp-content/uploads/2024/01/skyline-immigration-logo.png" alt="Logo" />
                                </a>
                            </div>
                            <a href="#" title="" className="text-base font-medium text-white">
                               Home
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                               About Us
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Study Abroad
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Collages
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Documentation
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Courses
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Our Services
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Media
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Contact Us
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Login
                            </a>

                            <a
                                className="items-center singup-button"
                                role="button"
                            >
                                Sign up
                            </a>
                        </div>
                    </nav>
                </div>
            </div>

            {isMobileMenuOpen && (
                <nav className="flex flex-col justify-between w-full max-w-xs min-h-screen px-4 py-10 bg-black sm:px-6 lg:hidden">
                    <button onClick={toggleMobileMenu} type="button" className="inline-flex p-2 text-white transition-all duration-200 rounded-md focus:bg-gray-800 hover:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex flex-col flex-grow h-full">
                        <nav className="flex flex-col flex-1 mt-10 space-y-2">
                            <a href="#" title="" className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70">
                                Features
                            </a>
                            <a href="#" title="" className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70">
                                Solutions
                            </a>
                            <a href="#" title="" className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70">
                                Resources
                            </a>
                            <a href="#" title="" className="flex w-full py-2 font-medium text-white transition-all duration-200 focus:text-opacity-70">
                                Pricing
                            </a>
                        </nav>

                        <div className="flex flex-col items-start">
                            <a
                                href="#"
                                title=""
                                className="inline-flex items-center justify-center w-auto px-6 py-3 mt-auto text-base font-semibold text-black transition-all duration-200 bg-yellow-400 border border-transparent rounded-full hover:bg-yellow-500 focus:bg-yellow-500"
                                role="button"
                            >
                                Join Now
                            </a>
                        </div>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;

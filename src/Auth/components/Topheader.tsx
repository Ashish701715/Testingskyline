import React, { useState } from 'react';

const TopHeader = () => {
    

    return (
        <header>
            <div className="relative bg-white">
                <div className="relative px-4 mx-auto sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-center h-16 lg:h-20 ">
                       
                        <div className="hidden lg:flex lg:items-center lg:space-x-10 font-black-a">
                            <a href="#" title="" className="text-base font-medium text-white">
                               Address Section
                            </a>
                            <a href="#" title="" className="text-base font-medium text-white">
                                Login
                            </a>
                        </div>
                    </nav>
                </div>
            </div>          
        </header>
    );
};

export default TopHeader;

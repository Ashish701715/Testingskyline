import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Avatar } from 'primereact/avatar';
import { useParams } from "react-router-dom";
export default function BasicDemo() {
    const [visible, setVisible] = useState<boolean>(false);
  
    return (
        <div className="card flex justify-content-center">
            <Sidebar  position="right" className="w-full md:w-[80%] lg:w-[90%]" visible={visible} onHide={() => setVisible(false)} >
                <h2>Sidebar</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="mt-auto">
                    <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                    <a v-ripple className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                        <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                        <span className="font-bold">Amy Elsner</span>
                    </a>
                </div>
                <footer className='absolute inset-x-0 bottom-0 h-16 border w-[100%]'>
                    <div className='flex justify-end'>
                        <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" onClick={() => setVisible(false)} autoFocus />
                    </div>
                </footer>
            </Sidebar>
            <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
        </div>
    )
}
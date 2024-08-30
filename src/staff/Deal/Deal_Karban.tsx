import { useState } from 'react';
import Dealstyle from './css/style.css';
// import Tab from './Helper/Tabs';
import DragData from './Helper/Deal_Drag';
import Applicationtable from './Helper/Dealtable';
import { Tabs, Tab } from "@nextui-org/react";
export default function LoadPage() {
    const [isloader, setLoader] = useState(true);
    return (
        <div className={`${Dealstyle}`}>
            <Tabs key="default" aria-label="Tabs colors" radius="full">
                <Tab key="List" title="List" >
                    <Applicationtable />
                </Tab>
                <Tab key="Karban" title="Karban" className="text-white">
                    {isloader ? (
                        <>
                            <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                                <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-20 h-20 inline-block align-middle m-auto mb-10"></span>
                            </div>
                        </>
                    ) : (
                        <>

                        </>
                    )}
                    <DragData setLoader={setLoader} />
                </Tab>

            </Tabs>


        </div>
    );
}

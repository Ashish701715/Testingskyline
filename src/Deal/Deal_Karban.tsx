import { useState } from 'react';
import './css/style.css';
import Deal_category from './Helper/deal_category';
import Table from '../pages/agent/student/student_record';
import { Tabs, Tab } from "@nextui-org/react";
import Create_Button from './Button/Create_Deal';
import DragData from './Helper/Deal_Drag';
import { NavLink } from 'react-router-dom';
export default function LoadPage() {
    const [isloader, setLoader] = useState(true);
    return (
        <>

            <Tabs key="default" aria-label="Tabs colors" radius="full">
                <Tab key="List" title="List" >
                    <br></br>
                    <Table />
                </Tab>
                <Tab key="Karban" title="Karban" className="text-white">
                    {isloader ? (
                        <>
                            <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                                <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-20 h-20 inline-block align-middle m-auto mb-10"></span>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                    <DragData setLoader={setLoader} />
                </Tab>

            </Tabs>



        </>
    );
}
const top100Films = [
    { title: 'Pending', year: 1994 },
    { title: 'In-progress', year: 1972 },
];

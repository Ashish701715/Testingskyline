import React, { useState, useEffect, lazy } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Card, CardBody, Tabs, Tab, Button } from "@nextui-org/react";
import "../Task&Project/Task_style.css";
import "./user/style.css";


const Leaveslist = lazy(() => import("./Leaves/leaveslist"));
// const approval = lazy(() => import("./Leaves/ApproviedLeaves"));
const Addleave = lazy(() => import("./Leaves/ApproviedLeaves"));
export default function User() {
    const { TABNAME } = useParams();
    const [showAddDepartment, setShowAddDepartment] = useState(false);

    function handleinviteuser() {
        if (showAddDepartment == false) {
            setShowAddDepartment(true);
        } else {
            setShowAddDepartment(false);
            setTimeout(() => {
                setShowAddDepartment(true);
            }, 10);
        }
    }


    // console.log(location.pathname);
    return (
        <>
            <div className='grid gap-4'>
                {/* <div className="flex flex-wrap gap-12 card-white">
                    <ul className="list" id="table-list">
                        <NavLink to="/admin/HRM/Company/leave">
                            <li className={`list-name font-medium text-lg-200 ${location.pathname == '/admin/HRM/Company/leave' ? 'HRM_active' : ''}`} title="USER">
                                Leave List
                            </li>
                        </NavLink>
                        <NavLink to="/admin/HRM/Company/User/leave">
                            <li className={`list-name font-medium text-lg-200 ${location.pathname == '/admin/HRM/Company/User/leave' ? 'HRM_active' : ''}`} title="USER">
                                Leave Manage
                            </li>
                        </NavLink>

                       
                        <li
                            className="list-name font-medium text-lg-200"
                            title="Department"
                            onClick={handleinviteuser}
                        >
                            Add Leave
                        </li>

                    </ul>
                </div> */}

                {/* <Card className="p-5"> */}

                {/* {showAddDepartment && (<Addleave />)} */}
                <Addleave />

                {/* </Card> */}
            </div>
        </>
    );
}

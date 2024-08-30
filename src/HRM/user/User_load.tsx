import React, { useState, useEffect, lazy, Suspense } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Card, CardBody, Tabs, Tab, Button } from "@nextui-org/react";
import DepartmentAdd from './Department_Add';
import InviteUser from './Invite_user';
import Token from '../../getLoggedUser/GetUserInfomation';
import "../../Task&Project/Task_style.css";
import '../../Deal/css/style.css';

const Departmentlist = lazy(() => import("./departmentlist"));
const Userlist = lazy(() => import("./userlist"));
export default function User() {
    const token = Token('jwt');


    const { TABNAME } = useParams();
    const { user_copy } = useParams();
    const [activeTab, setActiveTab] = useState('userList');
    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [showInviteuser, setShowinviteuser] = useState(false);
    const [Tabchanges, Settab] = useState('User_list');
    const handleTabChange = (tabKey: any) => {
        setActiveTab(tabKey);
    };




    function handleinviteuser() {
        if (showInviteuser == false) {
            setShowinviteuser(true);
        } else {
            setShowinviteuser(false);
            setTimeout(() => {
                setShowinviteuser(true);
            }, 10);
        }
    }

    function handledepartment() {
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
            {showAddDepartment && (<DepartmentAdd />)}
            {/* invite user component show */}
            {showInviteuser && (<InviteUser />)}

            <div className='pagetitle py-5 flex justify-between'>

                <Tabs aria-label="Options" onSelectionChange={(Key: any) => Settab(Key)}>
                    <Tab key="User_list" title="User List">
                    </Tab>
                    <Tab key="Country_list" title="Country List">
                    </Tab>
                </Tabs>


                <div className='flex gap-4'>
                    <Button color="primary" variant="solid" onClick={handleinviteuser}>Add Team Member</Button>
                    <Button color="primary" variant="solid" onClick={handledepartment}>Add Country</Button>
                </div>

            </div >

            {Tabchanges == 'User_list' ?
                <Userlist />
                :
                <Departmentlist />
            }




        </>
    );
}

import React, { useEffect, useState } from "react";
import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, Input, Badge, Avatar, Dropdown as Dropdowns
} from "@nextui-org/react";

import './dashboard.css'
import IconSearch from '../components/Icon/IconSearch';
import IconBell from '../components/Icon/IconBell';
import Home from '../components/Icon/Home';
import Applications from '../components/Icon/Applications';
import University from '../components/Icon/University';
import Hrm from '../components/Icon/Hrm';
import DollerMenu from '../components/Icon/DollerMenu';
import Settings from '../components/Icon/Settings';
import Announcement from '../components/Icon/Announcement';
import IconMinus from '../components/Icon/IconMinus';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Token from '../getLoggedUser/GetUserInfomation';
export default function App() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isInvisible, setIsInvisible] = React.useState(false);
    const [Userdata, setuserdata]: any = React.useState([]);


    const JwtToken = Token('jwt');
    const UserValition = async () => {
        fetch(`https://jwt-brown.vercel.app/validate-token?token=${JwtToken}`, {
            method: 'GET',
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.isValid !== true) {
                    window.location.href = '/auth/agent/signin';
                } else {
                    window.globalVariable = data.data;

                }
                setuserdata(data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        UserValition();
    }, [location.pathname]);



    type MenuItem = Required<MenuProps>['items'][number];
    const items: MenuItem[] = [
        {
            key: 'sub1',
            label: <span>Dashboard</span>,
            icon: <Home />,
            className: 'sidebar_link Acvite'

        },
        {
            key: 'sub2',
            label: <span>Announcement</span>,
            icon: <Announcement />,
            className: 'sidebar_link'
        },
        {
            key: 'sub4',
            label: <span>Applications Management</span>,
            icon: <Applications />,
            className: 'sidebar_link',
            children: [
                {
                    key: '9',
                    label: 'Applications',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
                {
                    key: '10',
                    label: 'Offer Letter',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
                {
                    key: '11',
                    label: 'Other Service',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
            ],
        },
        {
            key: 'sub5',
            label: <span>University</span>,
            icon: <University />,
            className: 'sidebar_link'
        },
        {
            key: 'sub6',
            label: <span>HRM</span>,
            icon: <Hrm />,
            className: 'sidebar_link',
            children: [
                {
                    key: '12',
                    label: 'User Records',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
                {
                    key: '13',
                    label: 'Leave Requests',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
                {
                    key: '14',
                    label: 'Inventory',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
                {
                    key: '15',
                    label: 'Attendance Report',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
            ],
        },
        {
            key: 'sub7',
            label: <span>Commission Management</span>,
            icon: <DollerMenu />,
            className: 'sidebar_link',
            children: [
                {
                    key: '16',
                    label: 'Manage - Comission',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
                {
                    key: '17',
                    label: 'Pay & Comission',
                    icon: <IconMinus />,
                    className: 'sidebar_sub_link',
                },
            ],
        },
        {
            key: 'grp',
            label: 'Settings',
            type: 'group',
            className: 'sidebar_link'
        },
        {
            key: 'sub8',
            label: <span>Settings</span>,
            icon: <Settings />,
            className: 'sidebar_link'
        },

    ];
    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            className="navcolor grid grid-flow-col justify-stretch "
            position="sticky"
            maxWidth="full"
        >
            <NavbarContent className="sm:hidden toggleicon" justify="start">
                <NavbarMenuToggle className="" aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <img className="logo_dashboard" src="/public/edunetwork-white.png" alt="logo" />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarBrand className="logo_column">
                    <img className="logo_dashboard2" src="/public/edunetwork-white.png" alt="logo" />
                </NavbarBrand>
                <NavbarItem>
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="search_bg "
                        classNames={{

                            input: [
                                "placeholder:text-white", // Sets the placeholder text color to white
                                "border-radius-none"
                            ]
                        }}
                        startContent={
                            <IconSearch className="text-white" />
                        }
                    />
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">

                <NavbarItem className="hidden lg:flex border-right">
                    <p className="nav_text">5:15<sup>pm</sup></p>
                    <p className="icon">
                        <Badge
                            content={5}
                            isInvisible={isInvisible}
                            shape="circle"
                            className="icon"
                        >
                            {/* <NotificationIcon className="fill-current" size={30} /> */}
                            <IconBell className="fill-current" />
                        </Badge>
                    </p>
                </NavbarItem>
                <NavbarItem className="flex">
                    {/* <Button as={Link} color="warning" href="#" variant="flat">
            Sign Up
          </Button> */}
                    <Avatar className="mr-3" color="success" src={Userdata?.ProfileUrl} />
                    <p className="nav_text2">{Userdata?.ClientName} <br></br><span>{Userdata?.ROLE?.toUpperCase()}</span></p>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu className="phone_view_nav">
                <Input
                    type="text"
                    placeholder="Search..."
                    color="secondary"
                    className=" "
                    startContent={
                        <IconSearch className="text-secondary " />
                    }
                />
                <Menu items={items} className="sidebar_aside" mode="inline" style={{ width: 276 }} />
            </NavbarMenu>
        </Navbar>
    );
}

import React, { useEffect, useState } from "react";
import './dashboard.css';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';

// Import your icons
import Home from '../components/Icon/Home';
import Applications from '../components/Icon/Applications';
import University from '../components/Icon/University';
import Hrm from '../components/Icon/Hrm';
import DollerMenu from '../components/Icon/DollerMenu';
import Settings from '../components/Icon/Settings';
import Announcement from '../components/Icon/Announcement';
import IconMinus from '../components/Icon/IconMinus';

// Map your icons
const iconMap: Record<string, React.ReactNode> = {
    Home: <Home />,
    Announcement: <Announcement />,
    Applications: <Applications />,
    University: <University />,
    Hrm: <Hrm />,
    DollerMenu: <DollerMenu />,
    Settings: <Settings />,
    IconMinus: <IconMinus />
};

interface Route {
    RoutePath: string;
    text: string;
    isChild: boolean;
    Routetype: string;
    icon: string;
    type?: 'group';
    ChildComponent?: Route[];
}
export default function App({ userdata }: any) {
    if (!userdata) {
        return null; // or a loading indicator if needed
    }
    type MenuItem = Required<MenuProps>['items'][number];
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const location = useLocation(); // Get the current location
    useEffect(() => {
        const fetchRoutes = async (): Promise<Route[]> => {
            const response = await fetch('/dummyroute.json'); // Adjust the path as needed
            const data = await response.json();
            return data.Route;
        };

        const generateMenuItems = (routes: Route[], role: string): MenuItem[] => {
            const filteredRoutes = routes.filter(route => route.Routetype === role);

            const createMenuItem = (route: Route): MenuItem => {
                const children = route.ChildComponent ? route.ChildComponent.map(child => createMenuItem(child)) : [];

                if (route.type === 'group') {
                    return {
                        key: route.RoutePath,
                        label: route.text,
                        type: 'group',
                        className: 'sidebar_link',
                        children: children.length > 0 ? children : undefined
                    };
                }

                return {
                    key: route.RoutePath,
                    label: route.RoutePath === '#' ? <span>{route.text}</span> : <NavLink to={route.RoutePath}>{route.text}</NavLink>,
                    icon: iconMap[route.icon] || null,
                    className: 'sidebar_link',
                    children: children.length > 0 ? children : undefined
                };
            };

            return filteredRoutes.map(route => createMenuItem(route));
        };

        const loadRoutes = async () => {
            const routes = await fetchRoutes();
            const role = userdata.ROLE; // Replace with actual role or dynamic logic
            setMenuItems(generateMenuItems(routes, role));
        };

        loadRoutes();
    }, [userdata]);
    const selectedKeys = [location.pathname];
    return (
        <Menu items={menuItems} className="sidebar_aside" mode="inline" selectedKeys={selectedKeys} />
    );
}

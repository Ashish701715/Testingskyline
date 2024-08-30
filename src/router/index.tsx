import { useEffect, useState } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import getCookie from '../getLoggedUser/GetUserInfomation';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import { AdminRoute } from './RouteComponents/AdminRoutes';
import { AuthRoutes } from './RouteComponents/AuthRoutes';
import { AgentRoute } from './RouteComponents/AgentRouters';
import { StaffRoute } from './RouteComponents/StaffRouters';
let Cookies = getCookie('jwt');
const UserValition = async () => {
    try {
        const res = await fetch(`https://jwt-brown.vercel.app/validate-token?token=${Cookies}`, {
            method: 'GET',
        });
        let data = await res.json();
        return data.data.ROLE;
    } catch (err) {
        return '';
    }
};
let Role = (await UserValition()) || 'demo';
let routes = [];

if (Role === 'admin') {
    routes = [...AdminRoute, ...AuthRoutes];
} else if (Role === 'agent') {
    routes = [...AgentRoute, ...AuthRoutes];
} else if (Role === 'staff') {
    routes = [...StaffRoute, ...AuthRoutes];
} else {
    routes = [...AuthRoutes];
}
let routerArray: any = [];

let finalRoutes = routes.map((route) => {
    let path = route.path;
    let element = route.element;
    let layout = route.layout;

    routerArray.push({
        path: layout === 'blank' ? path : Role + '/' + path,
        element: element,
        layout: layout,
    });
});
let FinalRoutes = routerArray.map((route: any) => {
    return {
        ...route,
        element: route.layout === 'blank' ? <BlankLayout>{route.element}</BlankLayout> : <DefaultLayout>{route.element}</DefaultLayout>,
    };
});
const router = createBrowserRouter(FinalRoutes);
export default router;

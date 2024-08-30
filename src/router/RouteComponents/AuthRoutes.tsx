import { lazy, useEffect } from 'react';

const Twofactor = lazy(() => import('../../pages/Authentication/TwoFactor'));
const LoginCover = lazy(() => import('../../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../../pages/Authentication/AgnetSingup'));
const Login = lazy(() => import('../../pages/Authentication/Login'));
const Home = lazy(() => import('../../pages/dashboard/Home'));
const Thankspage = lazy(() => import('../../pages/dashboard/ThanksPage'));
const Error404 = lazy(() => import('../../pages/dashboard/404page'));
const Dashboard = lazy(() => import('../../dashboard/dashboard'));
const AuthRoutes = [

    {
        path: 'admin/dashboard',
        element: <Dashboard />,
        layout: 'blank',
        type: 'Auth',
    },
    {
        path: 'auth/agent/signin',
        element: <LoginCover />,
        layout: 'blank',
        type: 'Auth',
    },
    {
        path: 'auth/agent/singup',
        element: <RegisterCover />,
        layout: 'blank',
        type: 'Auth',
    },
    {
        path: 'user/two-factor/:ClientToken',
        element: <Twofactor />,
        layout: 'blank',
        type: 'Auth',
    },
    {
        path: 'login',
        element: <Login />,
        layout: 'blank',
        type: 'Auth',
    },
    {
        path: '',
        element: <Home />,
        layout: 'blank',
        type: 'Auth',
    },
    {
        path: 'thanks',
        element: <Thankspage />,
        layout: 'blank',
        type: 'Auth',
    },
    {
        path: '*',
        element: <Error404 />,
        layout: 'blank',
        type: 'Auth',
    },
];

export { AuthRoutes };

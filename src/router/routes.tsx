import { lazy, useEffect } from 'react';

var IsLoggedIn = false;
const isLooged = localStorage.getItem('USERID');
IsLoggedIn = isLooged !== null ? true : false;


const Analytics = lazy(() => import('../pages/Analytics'));
const Tabs = lazy(() => import('../pages/Components/Tabs'));
const Accordians = lazy(() => import('../pages/Components/Accordians'));
const Modals = lazy(() => import('../pages/Components/Modals'));
const Cards = lazy(() => import('../pages/Components/Cards'));
const Carousel = lazy(() => import('../pages/Components/Carousel'));
const Countdown = lazy(() => import('../pages/Components/Countdown'));
const Counter = lazy(() => import('../pages/Components/Counter'));
const SweetAlert = lazy(() => import('../pages/Components/SweetAlert'));
const Timeline = lazy(() => import('../pages/Components/Timeline'));
const Notification = lazy(() => import('../pages/Components/Notification'));
const MediaObject = lazy(() => import('../pages/Components/MediaObject'));
const ListGroup = lazy(() => import('../pages/Components/ListGroup'));
const PricingTable = lazy(() => import('../pages/Components/PricingTable'));
const LightBox = lazy(() => import('../pages/Components/LightBox'));
const Tables = lazy(() => import('../pages/Tables'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/AgnetSingup'));
const Welcome = lazy(() => import('../pages/dashboard/weblcome'));
//leads 
const Lead = lazy(() => import('../pages/lead/lead'));
const AI = lazy(() => import('../pages/AI/AI'));
const Twofactor = lazy(() => import('../pages/Authentication/TwoFactor'));
const Thankspage = lazy(() => import('../pages/dashboard/ThanksPage'));
//Agent Route
const Profile = lazy(() => import('../pages/agent/client_detail'));

const Notes = lazy(() => import('../pages/agent/Notes'));
const Commision = lazy(() => import('../pages/agent/commision'));
const Calendar = lazy(() => import('../pages/agent/Calendar'));
const ClientForm = lazy(() => import('../pages/agent/ClientForm'));
const Mailbox = lazy(() => import('../pages/agent/Mailbox'));
const Chat = lazy(() => import('../pages/agent/Chat'));
const Profile2 = lazy(() => import('../pages/Users/Profile'));
const Students = lazy(() => import('../pages/agent/Students'));

//Staff Route
const Basic = lazy(() => import('../pages/staff/userlist'));

//Admin Route
const UserList = lazy(() => import('../pages/admin/userlist'));
const Add = lazy(() => import('../pages/admin/Invoice/Add'));
const Edit = lazy(() => import('../pages/admin/Invoice/Edit'));
const Preview = lazy(() => import('../pages/admin/Invoice/Preview'));
const CreateTask = lazy(() => import('./../pages/Task/TaskData'));

//Task Routes
const Task = lazy(() => import('../Task&Project/Task'));
const Edittask = lazy(() => import('../Task&Project/API_HELPER/Edit_task'));
const TaskRecycle = lazy(() => import('../Task&Project/Task_Recycle'));

//HRM Routes
const Leave = lazy(() => import('../HRM/Leaves'));
const ManageLeave = lazy(() => import('../HRM/Leaves/ApproviedLeaves'));
const Inventory = lazy(() => import('../HRM/Inventory/Inventory'));
const Clocklist = lazy(() => import('../HRM/Clocklist'));
const HMRUSER = lazy(() => import('../HRM/user/User_load'));



// University Route

// Lazy load the component for the university dashboard.
// URL: /page/univeristy/add_univeristy
const University = lazy(() => import('./../pages/university/add_univeristy'));
const University_View = lazy(() => import('./../pages/university/view_university'));
const Cources_view = lazy(() => import('./../pages/university/cources_view'));

const ClientRecord = lazy(() => import('./../pages/agent/student/student_record'));
const Deal = lazy(() => import('./../Deal/Deal_Karban'));

const ClientView = lazy(() => import('../pages/agent/student/student_application'));

const routes = [
    {
        path: '/cource/view',
        element: (IsLoggedIn) ? <Cources_view /> : <LoginCover />,
        layout: '',
    },
    {
        path: '/',
        element: (IsLoggedIn) ? <Analytics /> : <LoginCover />,
        layout: '',
    },
    {
        path: '/thanks',
        element: <Thankspage />,
        layout: 'blank',
    },
    {
        path: '/ai',
        element: (IsLoggedIn) ? <AI /> : <LoginCover />,
        layout: 'default',
    },
    {
        path: '/analytics',
        element: <Analytics />,
        layout: 'default',
    },
    {
        path: '/auth/agent/signin',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/auth/agent/singup',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/user/two-factor/:ClientToken',
        element: <Twofactor />,
        layout: 'blank',
    },

    //Admin dashboard Route 
    {
        path: 'admin/userlist',
        element: <UserList />,
        layout: 'default',
    },
    {
        path: 'admin/Invoice/add',
        element: <Add />,
        layout: 'default',
    },

    {
        path: 'admin/Invoice/edit',
        element: <Edit />,
        layout: 'default',
    },

    {
        path: 'admin/Invoice/preview',
        element: <Preview />,
        layout: 'default',
    },

    {
        path: 'task/create',
        element: <CreateTask />,
        layout: 'default',
    },


    // Define route for adding a university
    // Path: /university/add
    // Element: University component
    // Layout: default layout

    {
        path: 'university/add',
        element: <University />,
        layout: 'default',
    },
    {
        path: 'university/courcesview',
        element: <University />,
        layout: 'default',
    },
    {
        path: 'university/view',
        element: <University_View />,
        layout: 'default',
    },



    //Agents path

    {
        path: 'agent/Students',
        element: <Students />,
    },
    {
        path: 'agent/Profile',
        element: <Profile />,
    },
    {
        path: 'users/Profile',
        element: <Profile2 />,
    },
    {
        path: 'agent/Mailbox',
        element: <Mailbox />,
    },
    {
        path: 'agent/Chat',
        element: <Chat />,
    },
    {
        path: 'agent/Task',
        element: <Task />,
    },
    {
        path: 'agent/Notes',
        element: <Notes />,
    },
    {
        path: 'agent/Commision',
        element: <Commision />,
    },
    {
        path: 'agent/Calendar',
        element: <Calendar />,
    },
    {
        path: 'agent/ClientForm',
        element: <ClientForm />,
    },


    //Stff Paths
    {
        path: 'staff/table',
        element: <Basic />,
    },
    {
        path: '/HRM/Company',
        element: <HMRUSER />,
    },
    {
        path: '/test',
        element: <HMRUSER />,
        layout: 'blank_page',
    },

    //HRM USER & Deopartment routes
    {
        path: '/HRM/Company/:TABNAME',
        element: <HMRUSER />,
    },
    {
        path: '/HRM/Company/leave',
        element: <Leave />,
    },
    {
        path: '/HRM/Company/User/leave',
        element: <ManageLeave />,
    },
    {
        path: '/HRM/Company/inventory',
        element: <Inventory />,
    },
    {
        path: '/HRM/Company/clocklist',
        element: <Clocklist />,
    },


    //task path
    {
        path: '/page/company/task/:TabsnameID',
        element: <Task />,
        layout: ''
    },
    {
        path: '/page/company/task/View/:TASKTOKEN/:EncryptId',
        element: <Edittask />,
    },
    {
        path: '/client/record',
        element: <ClientRecord />,
    },
    {
        path: '/deal',
        element: <Deal />,
    },
    {
        path: '/client/view/:client_id/:encrypt_id',
        element: <ClientView />,
    },
];

export { routes };

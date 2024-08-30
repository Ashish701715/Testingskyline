import { lazy, useEffect } from 'react';
const Analytics = lazy(() => import('../../pages/dashboard/AgentDashboard'));
//Agent Route
const Profile = lazy(() => import('../../pages/agent/client_detail'));
const Notes = lazy(() => import('../../pages/agent/Notes'));
const Commision = lazy(() => import('../../pages/agent/commision'));
const Calendar = lazy(() => import('../../pages/agent/Calendar'));
const ClientForm = lazy(() => import('../../pages/agent/ClientForm'));
const Mailbox = lazy(() => import('../../pages/agent/Mailbox'));
const Chat = lazy(() => import('../../pages/agent/Chat'));
const Profile2 = lazy(() => import('../../pages/Users/Profile'));
const Students = lazy(() => import('../../pages/agent/Students'));

// Lazy load the component for the university dashboard.
// URL: /page/univeristy/add_univeristy 
const University = lazy(() => import('./../../pages/university/add_univeristy'));
const University_View = lazy(() => import('./../../pages/university/view_university'));
const Cources_view = lazy(() => import('./../../pages/university/cources_view'));

const ClientRecord = lazy(() => import('./../../pages/agent/student/student_record'));
const Deal = lazy(() => import('./../../Deal/Deal_Karban'));

const ClientView = lazy(() => import('../../pages/agent/student/student_application'));
// const Notes = lazy(() => import('../../pages/agent/Notes/Note'));

const Courses = lazy(() => import('../../pages/university/view_university'));

const Task = lazy(() => import('../../pages/agent/student/Application/Taskreport'));
const Commission = lazy(() => import('../../pages/agent/student/Application/Commission'));
const ViewAnnouncement = lazy(() => import('../../staff/Viewannouncement'));

const AgentRoute = [
    {
        path: '/',
        element: <Analytics />,
        layout: '',
    },
    {
        path: 'cource/view',
        element: <Cources_view />,
        layout: '',
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
        path: 'course',
        element: <Courses />,
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
        path: 'Note',
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
    {
        path: 'client/record',
        element: <ClientRecord />,
    },
    {
        path: 'lead',
        element: <Deal />,
    },
    {
        path: 'client/view/:client_id/:encrypt_id',
        element: <ClientView />,
    },
    {
        path: 'Task',
        element: <Task />,
    },
    {
        path: 'Commission',
        element: <Commission />,
    },
    {
        path: 'viewAnnouncement',
        element: <ViewAnnouncement />,
    },
];

export { AgentRoute };

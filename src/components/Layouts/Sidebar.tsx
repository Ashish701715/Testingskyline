import PerfectScrollbar from 'react-perfect-scrollbar';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import IconServer from '../Icon/IconServer';
import './style.css';

import Logo from '../../../public/edunetwork.png';

const Sidebar = ({ userdata }: any) => {
    if (!userdata) {
        return null; // or a loading indicator if needed
    }
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const [Route, setRoute] = useState([]);
    const debouncedRoutes = debounce(async () => {
        const filterData = { Routetype: userdata.ROLE };
        try {
            let res: any = await fetch('/routes.json?Routetype=admin');
            let data = await res.json();
            let FilterArray = data.Route;
            let FilterRoutes = FilterArray.filter((route: any) => route.Routetype === userdata.ROLE);
            setRoute(FilterRoutes);
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    }, 300);

    useEffect(() => {
        debouncedRoutes();
    }, [userdata]);


    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">

                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            {/* compnay logo insert this tag */}
                            <img className="w-40 ml-[5px] flex-none" src={Logo} alt="logo" />
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {Route.map((route: any, index) => {
                                if (!route.isChild) {
                                    return (

                                        <ul className="text-gray-500" key={index}>
                                            <li className="nav-item">
                                                <NavLink to={route.RoutePath} className="group">
                                                    <div className="flex items-center">
                                                        <IconServer className="shrink-0 icon-hover-color" />
                                                        <span className="font-black text-md  ltr:pl-3 rtl:pr-3 text-black dark:text-[#3067E2] dark::text-white-dark sidebar-content">{t(route.text)}</span>
                                                    </div>
                                                </NavLink>
                                            </li>

                                        </ul>


                                    );
                                } else {
                                    return (
                                        <li className="menu nav-item" key={index}>
                                            <button type="button" className={`active menu nav-item navbar-li-color  color-black navbar-li-color-changed nav-link group w-full`} onClick={() => toggleMenu(route.text)}>
                                                <div className="flex items-center">
                                                    <IconServer />    <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#3067E2] dark::text-white-dark">{t(route.text)}</span>
                                                </div>

                                                <div className={'rtl:rotate-90 -rotate-90'}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>

                                            <AnimateHeight duration={300} height={currentMenu === (route.text) ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {route.ChildComponent &&
                                                        route.ChildComponent.map((child: any, subIndex: any) => (
                                                            <li key={subIndex}>
                                                                <NavLink to={child.RoutePath} className="color-black hover-black font-black text-md">{child.text}</NavLink>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </AnimateHeight>
                                        </li >
                                    );
                                }
                            })}

                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

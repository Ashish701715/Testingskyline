import { PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import App from '../../App';
import { IRootState } from '../../store';
import { toggleSidebar } from '../../store/themeConfigSlice';
import Footer from './Footer';
// import Header from './Header';
// import Sidebar from './Sidebar';

import Header from '../../dashboard/Header';
import Sidebar from '../../dashboard/Sidebar';
import Portals from '../../components/Portals';

const DefaultLayout = ({ children }: PropsWithChildren) => {

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    const [userdata, setuserdata] = useState({});
    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const onScrollHandler = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler);

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

        return () => {
            window.removeEventListener('onscroll', onScrollHandler);
        };
    }, []);

    //Get jwt
    const getCookie = (name: any) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === name) {
                return cookie[1];
            }
        }
        return null;
    };

    const TokenData = getCookie('jwt');
    const UserValition = async () => {
        fetch(`https://jwt-brown.vercel.app/validate-token?token=${TokenData}`, {
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
                    setuserdata(data.data);
                }
                // setuserdata(data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        UserValition();
    }, [location.pathname]);
    return (
        // <App>
        //     {/* BEGIN MAIN CONTAINER */}
        //     <div className="relative">
        //         {/* sidebar menu overlay */}
        //         <div className={`${(!themeConfig.sidebar && 'hidden') || ''} fixed inset-0 bg-[black]/60 z-50 lg:hidden`} onClick={() => dispatch(toggleSidebar())}></div>
        //         {/* screen loader */}
        //         {showLoader && (
        //             <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
        //                 <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-20 h-20 inline-block align-middle m-auto mb-10"></span>
        //             </div>
        //         )}

        //         {/* BEGIN APP SETTING LAUNCHER */}
        //         {/* END APP SETTING LAUNCHER */}

        //         <div className={`${themeConfig.navbar} main-container text-black dark:text-white-dark min-h-screen`}>
        //             {/* BEGIN SIDEBAR */}
        //             <Sidebar userdata={userdata} />
        //             {/* END SIDEBAR */}

        //             <div className="main-content flex flex-col min-h-screen">
        //                 {/* BEGIN TOP NAVBAR */}
        //                 <Header />
        //                 {/* END TOP NAVBAR */}

        //                 {/* BEGIN CONTENT AREA */}
        //                 <Suspense>
        //                     <div className={`${themeConfig.animation} p-6`}>{children}</div>
        //                 </Suspense>
        //                 {/* END CONTENT AREA */}

        //                 {/* BEGIN FOOTER */}
        //                 <Footer />
        //                 {/* END FOOTER */}
        //                 <Portals />
        //             </div>
        //         </div>
        //     </div>
        // </App>



        <div className="dashboard_page_bg">
            <Header />

            <div className="dashboard_inner_page">
                <Sidebar userdata={userdata} />
                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <Suspense>
                        <div className={`${themeConfig.animation} p-6`}>{children}</div>
                    </Suspense>
                </main>
            </div>
        </div>

    );
};

export default DefaultLayout;

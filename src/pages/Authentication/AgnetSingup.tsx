import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Input, Checkbox, Link, Button, RadioGroup, Radio } from '@nextui-org/react';
import './style-two.css';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
//Google Api
import { auth } from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { OAuthCredential } from 'firebase/auth';
//#end Google Componets
import { generateJWT } from './JWT';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { APIURL } from '../../APIurl/url';

const LoginCover = () => {
    //sweet alert javscript code
    const MySwal = withReactContent(Swal);

    //#JWT token store

    const [isSubmitting, setIsSubmitting] = useState(false);
    //Store data
    const [formData, setFormData] = useState({
        Country: '',
        Branch: '',
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Sign-Up'));
    });
    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    //Token garnate

    const generateRandomToken = (length: number): string => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            token += characters[randomIndex];
        }

        return token;
    };

    //# GoogleLoginAuth handler

    const handleGoogleSignin = async () => {
        setIsSubmitting(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const username = user.displayName;
            const useremail = user.email;
            const profile = user.photoURL;
            const LocalID = user.uid;
            const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
            const JWTtoken = credential?.idToken;
            if (user.emailVerified == true) {
                fetch(APIURL, {
                    method: 'POST',
                    body: JSON.stringify({
                        IsGoogle: true,
                        Name: username,
                        Email: useremail,
                        Profile: profile,
                        LocalID: LocalID,
                        TOKEN: generateRandomToken(64),
                        PAGE_REQUEST: 'Google_Agent_Singup',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authenticate: `Bearer ${JWTtoken}`,
                    },
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        if (data.status == true) {
                            MySwal.fire({
                                title: data.message,
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 20000,
                                showCloseButton: true,
                                customClass: {
                                    popup: `color-suucess`,
                                },
                            });

                            setIsSubmitting(false);
                        } else {
                            MySwal.fire({
                                title: data.message,
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 20000,
                                showCloseButton: true,
                                customClass: {
                                    popup: `color-danger`,
                                },
                            });
                            setIsSubmitting(false);
                        }
                    })
                    .catch((error) => {
                        MySwal.fire({
                            title: error,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 20000,
                            showCloseButton: true,
                            customClass: {
                                popup: `color-danger`,
                            },
                        });
                        setIsSubmitting(false);
                    });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailInput = document.getElementById('Email') as HTMLInputElement;
        const userEmail = emailInput ? emailInput.value : '';
        const passwordInputvalue = document.getElementById('Password') as HTMLInputElement;
        const passwordInputValues = passwordInputvalue ? passwordInputvalue.value : '';

        const payload = { useremail: userEmail, password: passwordInputValues };
        const secretKey = 'JwtSecret';
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

        const token = generateJWT(payload, secretKey, expiresIn);
        token
            .then((JwtToken) => {
                setIsSubmitting(true);
                const FORMDATA = Object.fromEntries(Object.entries(formData).filter(([key, value]) => value !== undefined));
                const token = generateRandomToken(64);
                FORMDATA['TOKEN'] = token;
                FORMDATA['PAGE_REQUEST'] = 'Type_Agent_Singup';
                fetch(APIURL, {
                    method: 'POST',
                    body: JSON.stringify(FORMDATA),
                    headers: {
                        'Content-Type': 'application/json',
                        Authenticate: `Bearer ${JwtToken}`,
                    },
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        if (data.status == true) {
                            const UserTokenGet = data.access_infomtion;
                            const usertoken = UserTokenGet.usertoken;
                            const useremail = UserTokenGet.useremail;
                            const jwt = UserTokenGet.jwt;
                            navigate(`/user/two-factor/${usertoken}?action=two-factor&jwt=${jwt}&email=${useremail}`);
                            const form = e.target as HTMLFormElement;
                            form.reset();
                        } else {
                            MySwal.fire({
                                title: data.message,
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 20000,
                                showCloseButton: true,
                                customClass: {
                                    popup: `color-danger`,
                                },
                            });
                            setIsSubmitting(false);
                        }
                    })
                    .catch((error) => {
                        MySwal.fire({
                            title: error,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 20000,
                            showCloseButton: true,
                            customClass: {
                                popup: `color-danger`,
                            },
                        });
                        setIsSubmitting(false);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <>
            <div className="flex justify-center top_bar_bg_color">
                <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-8 md:gap-2">
                    <div className="flex gap-2 set_font_top">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="svg_size">
                            <path
                                fill-rule="evenodd"
                                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        SCO 43, Sector 42C, Chandigarh - 160036
                    </div>
                    <div className="flex gap-2 justify-center set_font_top">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="svg_size">
                            <path
                                fillRule="evenodd"
                                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Make a call : +91-9872311555
                    </div>
                    <div className="flex gap-2 set_font_top">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="svg_size">
                            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                        </svg>
                        s.dudani@skylineimmigration.com
                    </div>
                </div>
            </div>
            <header>
                <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <a href="#" className="flex items-center">
                            <img src="/edunetwork.png" className="header_logo" alt="Logo" />
                        </a>
                        <div className="flex items-center lg:order-2">
                            <NavLink
                                to="/auth/agent/signin"
                                className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                            >
                                Log in
                            </NavLink>
                            <a href="#" className="design_btn">
                                Sign Up
                            </a>
                            <button
                                data-collapse-toggle="mobile-menu-2"
                                type="button"
                                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mobile-menu-2"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                                <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1 md:order-2" id="mobile-menu-2">
                            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-2 xl:space-x-4 lg:mt-0">
                                <li>
                                    <a href="#" className="design_menu" aria-current="page">
                                        Home
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        About US
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        Study Abroad
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        Colleges
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        Courses
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        Our Services
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        Media
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="design_menu">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            {/* header end */}
            <div className="flex justify-center design_hero_section">
                <div className="self-center grid xl:grid-cols-6 lg:grid-cols-6 gap-8">
                    <div className="col-start-2 col-span-2 column_first">
                        <h1 className="">You’re where you need to be</h1>
                        <p className="p_tag_first">
                            If you have an account, Let <span><NavLink to={`/auth/agent/signin`}>Login Now </NavLink></span>
                        </p>
                        <img src="/hero.png" />
                    </div>
                    <div className="xxl:col-end-2 xxl:col-span-3 xl:col-span-2 lg:col-span-3">
                        <div className="column_secend">
                            <div className="column_secend_inner">
                                <form onSubmit={submitForm}>
                                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-8">
                                        <div className="xl:col-span-2 sm:col-span-2 xxl:col-span-2 lg:col-span-2">
                                            <h2 className="">Sign Up</h2>
                                        </div>
                                        <div className="xl:col-span-2 sm:col-span-2 xxl:col-span-2 lg:col-span-2 text-end">
                                            <Link href="#" onClick={handleGoogleSignin}>
                                                <p className="p_tag_secend">
                                                    Sign Up with
                                                    <img src="/google-icon.png" />
                                                </p>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 mb-3">
                                        <div className="set_padding_form_fild_singup">
                                            <label className="design_label">
                                                Name <span className="text-danger">*</span>
                                            </label>
                                            <Input onChange={handleChange} id="Name" type="text" placeholder="Harry Polim" className="design_input bg-white input-login-form" />
                                        </div>
                                        <div className="set_padding_form_fild_singup">
                                            <label className="design_label">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                            <Input type="email" id="Email" placeholder="junior@nextui.org" className="design_input bg-white input-login-form" onChange={handleChange} />
                                        </div>
                                        <div className="set_padding_form_fild_singup">
                                            <label className="design_label">
                                                Password <span className="text-danger">*</span>
                                            </label>
                                            <Input
                                                id="Password"
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter your password"
                                                endContent={
                                                    <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                                        {isVisible ? (
                                                            <EyeOutlined className="text-2xl text-default-400 pointer-events-none" />
                                                        ) : (
                                                            <EyeInvisibleOutlined className="text-2xl text-default-400 pointer-events-none" />
                                                        )}
                                                    </button>
                                                }
                                                type={isVisible ? 'text' : 'password'}
                                                className="design_input bg-white input-login-form"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 gap-4">
                                        <div className=" col-span-3">
                                            <Checkbox defaultSelected color="primary">
                                                Remember me
                                            </Checkbox>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1">
                                        <div className="col-start-1 col-end-7">
                                            <Button type="submit" color="primary" variant="solid" className="set_width_btn" disabled={isSubmitting}>
                                                {isSubmitting ? 'Please wait...' : 'SIGNUP'}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* hero section end */}
            {/* 3rd section start */}
            <section className="bg_3rd_section">
                <div className="grid grid-cols-5 gap-4">
                    <div className="col-start-2 col-span-3 third_section">
                        <h3>
                            Open Doors to Quality <span>International Education</span>
                        </h3>
                        <p>
                            We provide best study visa consultation. Skyline Immigration believe in quality work and we make your study visa process hassle free and superfast. We serve across the
                            globe with Students, Universities, and Recruitment Partners in our network
                        </p>
                    </div>
                </div>
                <div className="flex justify-center grid grid-rows-1  grid-flow-col gap-4">
                    <div className="there_box">
                        <p className="p_tag_box_number">250K+</p>
                        <p className="p_tag_box">Students Helped</p>
                    </div>
                    <div className="there_box">
                        <p className="p_tag_box_number">35K+</p>
                        <p className="p_tag_box">Recruitment Partners</p>
                    </div>
                    <div className="there_box">
                        <p className="p_tag_box_number">750+</p>
                        <p className="p_tag_box">Partner Universities</p>
                    </div>
                </div>
            </section>
            {/* 3rd section end */}
            {/* 4th section start */}
            <div className="justify-center grid grid-rows-1 grid-flow-col gap-4 fourth_section">
                <div className="fourth_col1">
                    <h3>
                        Find out <span>why you should Learn</span> with us.
                    </h3>
                    <p className="">
                        We provide complete assistance with student/study visa application. We help students to apply for study visa in local embassies and give them best study visa consultation.
                    </p>

                    <p>
                        Skyline Immigration considered as the top study visa consultants in Chandigarh and we help you choose the destination, course and institution that matches your personal
                        circumstance such as education and financial background. Our highly expert study visa consultants are always ready to help you and provide you the best visa consultation. We
                        provide you complete solutions for your study visa process and we have partnership with top-notch universities.
                    </p>
                    <a href="#" className="margin1">
                        FIND PERFECT TEACHER
                    </a>
                    <div className="grid grid-cols-2 gap-4 fourth_s_secend_part">
                        <div className="four_box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <g clip-path="url(#clip0_93_578)">
                                    <path
                                        d="M24.4775 12.616L30.0583 7.96541H37.3646V0.384766H19.1711V7.96541H24.4775V12.616ZM20.6872 6.44928V1.90089H35.8485V6.44928H29.5097L25.9937 9.37938V6.44928H20.6872Z"
                                        fill="#006ED9"
                                    />
                                    <path d="M22.2031 3.41797H23.7193V4.9341H22.2031V3.41797Z" fill="#006ED9" />
                                    <path d="M25.2354 3.41797H31.2999V4.9341H25.2354V3.41797Z" fill="#006ED9" />
                                    <path d="M32.8164 3.41797H34.3325V4.9341H32.8164V3.41797Z" fill="#006ED9" />
                                    <path
                                        d="M39.5667 45.8686L38.9537 39.7319C41.4848 39.3318 43.4292 37.1402 43.4292 34.4977V24.6428H40.3969V23.5953C40.3969 22.5648 39.8306 21.6394 38.92 21.1649C39.8254 20.3332 40.3969 19.1439 40.3969 17.8203V16.3041C40.3969 13.7956 38.357 11.7557 35.8485 11.7557C33.34 11.7557 31.3001 13.7956 31.3001 16.3041V17.8203C31.3001 19.7828 32.5516 21.4536 34.2968 22.0903L30.2282 26.159H25.977C25.8922 24.8953 25.0243 23.7937 23.7946 23.4421L20.6872 22.5552V21.2012C21.6152 20.368 22.2033 19.1635 22.2033 17.8203V16.3041C22.2033 13.7956 20.1635 11.7557 17.655 11.7557C15.1465 11.7557 13.1066 13.7956 13.1066 16.3041V17.8203C13.1066 19.1628 13.6947 20.3672 14.6227 21.2012V22.5559L11.5153 23.4428C10.2205 23.8119 9.31625 25.0111 9.31625 26.3585V29.1912H6.28399V33.7396H7.80012V45.8686H0.977539V47.3848H47.9775V45.8686H39.5667ZM32.8163 33.7396V30.2632L38.1879 24.8916C38.5761 24.5033 38.8071 23.9817 38.8589 23.4376C38.8656 23.4906 38.8808 23.5405 38.8808 23.5953V32.9815C38.8808 34.2352 37.8603 35.2557 36.6066 35.2557H30.5421V33.7396H32.8163ZM30.5421 39.8041H34.4046L35.0109 45.8686H30.5421V39.8041ZM35.9281 39.8041H37.4368L38.0431 45.8686H36.5344L35.9281 39.8041ZM40.3969 32.9815V26.159H41.913V34.4977C41.913 36.5875 40.2126 38.288 38.1227 38.288H30.5421V36.7719H36.6066C38.6964 36.7719 40.3969 35.0714 40.3969 32.9815ZM32.8163 17.8203V16.3041C32.8163 14.6318 34.1762 13.2719 35.8485 13.2719C37.5208 13.2719 38.8808 14.6318 38.8808 16.3041V17.8203C38.8808 19.4926 37.5208 20.8525 35.8485 20.8525C34.1762 20.8525 32.8163 19.4926 32.8163 17.8203ZM30.8559 27.6751L35.9137 22.6174C36.0721 22.459 36.2912 22.3686 36.5148 22.3686C36.9834 22.3686 37.3646 22.7499 37.3646 23.2185C37.3646 23.4421 37.2743 23.6612 37.1159 23.8196L31.7443 29.1912H23.7195C23.3012 29.1912 22.9614 28.8514 22.9614 28.4332C22.9614 28.0149 23.3012 27.6751 23.7195 27.6751H30.8559ZM14.6227 16.3041C14.6227 14.6318 15.9826 13.2719 17.655 13.2719C19.3273 13.2719 20.6872 14.6318 20.6872 16.3041V17.8203C20.6872 19.4926 19.3273 20.8525 17.655 20.8525C15.9826 20.8525 14.6227 19.4926 14.6227 17.8203V16.3041ZM17.655 22.3686C18.1872 22.3686 18.6958 22.2717 19.1711 22.1032V22.9176C18.9831 23.2078 18.4608 23.8848 17.655 23.8848C16.8491 23.8848 16.3269 23.2078 16.1388 22.9176V22.1032C16.6141 22.2717 17.1227 22.3686 17.655 22.3686ZM10.8324 26.3585C10.8324 25.6844 11.2851 25.0855 11.9317 24.9005L15.0547 24.0084C15.4944 24.5814 16.3502 25.4009 17.655 25.4009C18.9597 25.4009 19.8155 24.5814 20.2553 24.0077L23.3782 24.8997C23.959 25.0659 24.3639 25.5708 24.445 26.1582H23.7195C22.4658 26.1582 21.4453 27.1787 21.4453 28.4324C21.4453 28.6993 21.4997 28.9525 21.5848 29.1905H10.8324V26.3585ZM7.80012 30.7073H31.3001V32.2235H7.80012V30.7073ZM9.31625 36.7719H11.5904V35.2557H9.31625V33.7396H29.0259V35.2557H13.1066V36.7719H29.0259V45.8686H27.2203L25.7042 42.8364H12.638L11.1218 45.8686H9.31625V36.7719ZM25.5251 45.8686H12.8171L13.5752 44.3525H24.767L25.5251 45.8686Z"
                                        fill="#006ED9"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_93_578">
                                        <rect width="47" height="47" fill="white" transform="translate(0.977539 0.384766)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>Study overseas destination</p>
                        </div>
                        <div className="four_box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                <g clip-path="url(#clip0_93_578)">
                                    <path
                                        d="M24.4775 12.616L30.0583 7.96541H37.3646V0.384766H19.1711V7.96541H24.4775V12.616ZM20.6872 6.44928V1.90089H35.8485V6.44928H29.5097L25.9937 9.37938V6.44928H20.6872Z"
                                        fill="#006ED9"
                                    />
                                    <path d="M22.2031 3.41797H23.7193V4.9341H22.2031V3.41797Z" fill="#006ED9" />
                                    <path d="M25.2354 3.41797H31.2999V4.9341H25.2354V3.41797Z" fill="#006ED9" />
                                    <path d="M32.8164 3.41797H34.3325V4.9341H32.8164V3.41797Z" fill="#006ED9" />
                                    <path
                                        d="M39.5667 45.8686L38.9537 39.7319C41.4848 39.3318 43.4292 37.1402 43.4292 34.4977V24.6428H40.3969V23.5953C40.3969 22.5648 39.8306 21.6394 38.92 21.1649C39.8254 20.3332 40.3969 19.1439 40.3969 17.8203V16.3041C40.3969 13.7956 38.357 11.7557 35.8485 11.7557C33.34 11.7557 31.3001 13.7956 31.3001 16.3041V17.8203C31.3001 19.7828 32.5516 21.4536 34.2968 22.0903L30.2282 26.159H25.977C25.8922 24.8953 25.0243 23.7937 23.7946 23.4421L20.6872 22.5552V21.2012C21.6152 20.368 22.2033 19.1635 22.2033 17.8203V16.3041C22.2033 13.7956 20.1635 11.7557 17.655 11.7557C15.1465 11.7557 13.1066 13.7956 13.1066 16.3041V17.8203C13.1066 19.1628 13.6947 20.3672 14.6227 21.2012V22.5559L11.5153 23.4428C10.2205 23.8119 9.31625 25.0111 9.31625 26.3585V29.1912H6.28399V33.7396H7.80012V45.8686H0.977539V47.3848H47.9775V45.8686H39.5667ZM32.8163 33.7396V30.2632L38.1879 24.8916C38.5761 24.5033 38.8071 23.9817 38.8589 23.4376C38.8656 23.4906 38.8808 23.5405 38.8808 23.5953V32.9815C38.8808 34.2352 37.8603 35.2557 36.6066 35.2557H30.5421V33.7396H32.8163ZM30.5421 39.8041H34.4046L35.0109 45.8686H30.5421V39.8041ZM35.9281 39.8041H37.4368L38.0431 45.8686H36.5344L35.9281 39.8041ZM40.3969 32.9815V26.159H41.913V34.4977C41.913 36.5875 40.2126 38.288 38.1227 38.288H30.5421V36.7719H36.6066C38.6964 36.7719 40.3969 35.0714 40.3969 32.9815ZM32.8163 17.8203V16.3041C32.8163 14.6318 34.1762 13.2719 35.8485 13.2719C37.5208 13.2719 38.8808 14.6318 38.8808 16.3041V17.8203C38.8808 19.4926 37.5208 20.8525 35.8485 20.8525C34.1762 20.8525 32.8163 19.4926 32.8163 17.8203ZM30.8559 27.6751L35.9137 22.6174C36.0721 22.459 36.2912 22.3686 36.5148 22.3686C36.9834 22.3686 37.3646 22.7499 37.3646 23.2185C37.3646 23.4421 37.2743 23.6612 37.1159 23.8196L31.7443 29.1912H23.7195C23.3012 29.1912 22.9614 28.8514 22.9614 28.4332C22.9614 28.0149 23.3012 27.6751 23.7195 27.6751H30.8559ZM14.6227 16.3041C14.6227 14.6318 15.9826 13.2719 17.655 13.2719C19.3273 13.2719 20.6872 14.6318 20.6872 16.3041V17.8203C20.6872 19.4926 19.3273 20.8525 17.655 20.8525C15.9826 20.8525 14.6227 19.4926 14.6227 17.8203V16.3041ZM17.655 22.3686C18.1872 22.3686 18.6958 22.2717 19.1711 22.1032V22.9176C18.9831 23.2078 18.4608 23.8848 17.655 23.8848C16.8491 23.8848 16.3269 23.2078 16.1388 22.9176V22.1032C16.6141 22.2717 17.1227 22.3686 17.655 22.3686ZM10.8324 26.3585C10.8324 25.6844 11.2851 25.0855 11.9317 24.9005L15.0547 24.0084C15.4944 24.5814 16.3502 25.4009 17.655 25.4009C18.9597 25.4009 19.8155 24.5814 20.2553 24.0077L23.3782 24.8997C23.959 25.0659 24.3639 25.5708 24.445 26.1582H23.7195C22.4658 26.1582 21.4453 27.1787 21.4453 28.4324C21.4453 28.6993 21.4997 28.9525 21.5848 29.1905H10.8324V26.3585ZM7.80012 30.7073H31.3001V32.2235H7.80012V30.7073ZM9.31625 36.7719H11.5904V35.2557H9.31625V33.7396H29.0259V35.2557H13.1066V36.7719H29.0259V45.8686H27.2203L25.7042 42.8364H12.638L11.1218 45.8686H9.31625V36.7719ZM25.5251 45.8686H12.8171L13.5752 44.3525H24.767L25.5251 45.8686Z"
                                        fill="#006ED9"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_93_578">
                                        <rect width="47" height="47" fill="white" transform="translate(0.977539 0.384766)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>Expert guidance</p>
                        </div>
                        <div className="four_box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                <g clip-path="url(#clip0_93_570)">
                                    <path
                                        d="M40.765 15.421C40.7691 17.2539 40.4096 19.0393 39.6965 20.7278C39.6061 20.9417 39.3984 21.0703 39.1799 21.0703C39.1072 21.0703 39.0332 21.0561 38.962 21.026C38.6767 20.9056 38.5433 20.5767 38.6637 20.2916C39.3178 18.7428 39.6477 17.1049 39.6439 15.4235C39.6316 9.91432 35.9936 5.03068 30.8315 3.36778L31.1079 3.67215C31.316 3.90134 31.2989 4.25584 31.0697 4.46397C30.8406 4.67209 30.486 4.65503 30.2779 4.42577L28.7684 2.76335C28.641 2.62313 28.5931 2.42798 28.641 2.24468C28.689 2.06138 28.8263 1.91468 29.0059 1.85478L31.1924 1.12551C31.486 1.02757 31.8036 1.18621 31.9015 1.47986C31.9994 1.7735 31.8408 2.09101 31.5471 2.18895L31.1938 2.30682C36.8016 4.12291 40.7515 9.43225 40.7649 15.4211L40.765 15.421ZM14.5663 26.2189C14.5094 26.5232 14.7098 26.816 15.0142 26.8729L17.2172 27.2853C17.2515 27.2917 17.286 27.2949 17.3203 27.2949C17.47 27.2949 17.6152 27.2348 17.7217 27.1256C17.8525 26.9913 17.9076 26.8005 17.8684 26.6172L17.4268 24.5504C17.3621 24.2477 17.0643 24.0545 16.7615 24.1195C16.4588 24.1842 16.2658 24.482 16.3305 24.7848L16.4004 25.1113C15.108 23.7264 14.1079 22.0795 13.4822 20.2957C13.3798 20.0036 13.0601 19.8499 12.7678 19.9522C12.4757 20.0547 12.3219 20.3745 12.4243 20.6667C13.0943 22.5768 14.1613 24.342 15.5384 25.8304L15.2206 25.7709C14.9164 25.7139 14.6234 25.9145 14.5665 26.2188L14.5663 26.2189ZM39.3287 25.8071C38.8508 26.9746 35.6555 30.2452 34.0509 31.7367C32.5672 33.1161 31.3464 34.1422 29.1394 34.7862C28.092 35.0917 26.9811 35.2955 25.9068 35.4926C25.4557 35.5754 25.0297 35.6534 24.6266 35.7361C22.8881 36.0922 21.5519 36.4919 20.4784 37.291C20.5608 37.4228 20.6241 37.5675 20.6655 37.7221C20.7748 38.1299 20.7192 38.5549 20.5091 38.9189L19.5648 40.5546C19.2833 41.0421 18.7707 41.315 18.2446 41.315C17.9866 41.315 17.7255 41.2495 17.4865 41.1115L11.5222 37.668C10.7956 37.2484 10.5458 36.3162 10.9652 35.5896L11.9096 33.9539C12.2386 33.3843 12.8715 33.0981 13.4864 33.18C14.8857 30.2607 16.1444 28.6087 17.5457 27.8445C18.9554 27.0758 20.3563 27.261 21.9785 27.4754C23.7315 27.7071 25.718 27.9697 28.4763 27.2324C29.1528 27.0277 29.8585 27.2006 30.3665 27.6959C30.6714 27.9933 30.861 28.365 30.9239 28.762C32.9129 27.3093 35.4087 25.1369 36.401 24.1447C37.2618 23.2841 38.2443 23.296 38.8362 23.6897C39.4851 24.1214 39.6785 24.9524 39.3287 25.807V25.8071ZM19.3712 37.7347L13.5041 34.3474C13.4324 34.306 13.354 34.2863 13.2766 34.2863C13.1187 34.2863 12.9649 34.3682 12.8805 34.5146L11.9361 36.1502C11.883 36.2422 11.8691 36.35 11.8969 36.4538C11.9247 36.5576 11.9907 36.644 12.0827 36.6972L18.047 40.1407C18.2382 40.2511 18.4836 40.1853 18.594 39.9941L19.5383 38.3585C19.6642 38.1404 19.5892 37.8607 19.3712 37.7348V37.7347ZM38.2153 24.6232C38.0108 24.4871 37.6039 24.5275 37.1937 24.9375C35.8661 26.2651 32.1418 29.4633 30.0406 30.7052L30.0389 30.7024C28.315 32.0024 24.5972 32.2824 23.3395 32.0036C23.0372 31.9366 22.8465 31.6373 22.9135 31.335C22.9805 31.0327 23.2797 30.8419 23.5821 30.909C24.8786 31.1964 28.3576 30.702 29.4702 29.7401V29.74C29.4702 29.74 29.4707 29.7397 29.471 29.7395C29.6361 29.5966 29.7494 29.4435 29.7951 29.2811C29.8749 28.9978 29.7958 28.7053 29.5838 28.4985C29.3717 28.2918 29.0772 28.2201 28.7961 28.3069C28.7894 28.309 28.7826 28.3109 28.7758 28.3128C25.7971 29.1109 23.5983 28.8202 21.8316 28.5867C20.287 28.3825 19.1711 28.235 18.0825 28.8287C16.9198 29.4628 15.7808 30.9945 14.5118 33.6346L19.5876 36.5651C21.0214 35.4074 22.8144 34.9628 24.4016 34.6377C24.816 34.5528 25.2476 34.4736 25.7046 34.3899C26.7511 34.1979 27.8333 33.9994 28.8255 33.7099C30.8004 33.1337 31.8745 32.2295 33.2877 30.9156C35.2901 29.0543 37.9685 26.171 38.2912 25.3824C38.434 25.0336 38.4057 24.7498 38.2153 24.6232V24.6232ZM31.4681 12.2762V9.06766L30.5213 9.32135V10.7721C30.5213 10.969 30.418 11.1514 30.2492 11.2527C30.2279 11.2654 30.2062 11.2773 30.1848 11.2898C30.2945 11.656 30.3513 12.0359 30.3513 12.4253C30.3513 13.761 29.6857 14.9436 28.6695 15.6612L29.8528 15.9522C30.8232 16.2005 31.7377 16.4502 32.3158 16.7892C33.1931 17.3035 33.5218 17.9016 33.6185 19.1594C33.6188 19.1635 33.6191 19.1675 33.6193 19.1716C33.6927 20.5031 33.6952 21.8718 33.6274 23.479C33.5754 24.7092 32.5703 25.6727 31.3391 25.6727H21.4436C20.2124 25.6727 19.2072 24.7092 19.1553 23.479C19.0875 21.8723 19.09 20.5035 19.1634 19.1716C19.1636 19.1675 19.1639 19.1635 19.1642 19.1594C19.2609 17.9016 19.5896 17.3035 20.4669 16.7892C21.0449 16.4503 21.9594 16.2005 22.9248 15.9535L24.1131 15.6612C23.0969 14.9436 22.4314 13.761 22.4314 12.4253C22.4314 12.0359 22.4881 11.656 22.5979 11.2898C22.5765 11.2773 22.5546 11.2655 22.5334 11.2527C22.3646 11.1513 22.2614 10.969 22.2614 10.772V9.32135L20.6089 8.87851C20.2588 8.78474 20.0143 8.46611 20.0143 8.10368C20.0143 7.74124 20.2589 7.42261 20.6089 7.32884L25.9492 5.89785C26.2467 5.81809 26.5359 5.81809 26.8335 5.89785L32.1738 7.32884C32.5239 7.42261 32.7684 7.74124 32.7684 8.10368C32.7684 8.2921 32.7019 8.46827 32.5893 8.60753V12.2761C32.5893 12.5857 32.3383 12.8367 32.0287 12.8367C31.7192 12.8367 31.4682 12.5857 31.4682 12.2761L31.4681 12.2762ZM26.3683 16.3846C26.1417 16.3859 25.9142 16.4075 25.6806 16.4468L26.3912 17.1812L27.1019 16.4468C26.8682 16.4075 26.6407 16.3859 26.4141 16.3846C26.4065 16.3846 26.3989 16.3852 26.3913 16.3852C26.3837 16.3852 26.3761 16.3846 26.3685 16.3846H26.3683ZM28.3748 16.7432L27.1795 17.9786L27.667 18.4607L28.5334 16.7822L28.3748 16.7432ZM24.249 16.7822L25.1154 18.4607L25.6029 17.9785L24.4076 16.7431L24.2491 16.7821L24.249 16.7822ZM31.7487 17.7563C31.2761 17.4792 30.3198 17.2291 29.6526 17.0582L28.3134 19.6528C28.2316 19.8113 28.0792 19.9214 27.903 19.9493C27.8737 19.954 27.8444 19.9562 27.8152 19.9562C27.6688 19.9562 27.5268 19.8988 27.421 19.7942L26.3912 18.7756L25.3613 19.7942C25.2555 19.8988 25.1135 19.9562 24.9671 19.9562C24.9379 19.9562 24.9086 19.954 24.8793 19.9493C24.7031 19.9214 24.5507 19.8113 24.469 19.6528L23.1297 17.0582C22.4668 17.2279 21.5072 17.4786 21.0336 17.7563C20.5602 18.0338 20.3593 18.2461 20.2821 19.2394C20.2111 20.5324 20.2089 21.8646 20.2751 23.4317C20.3016 24.0596 20.8148 24.5516 21.4434 24.5516H21.772V20.8705C21.772 20.5609 22.023 20.3099 22.3326 20.3099C22.6421 20.3099 22.8931 20.5609 22.8931 20.8705V24.5516H29.889V20.8705C29.889 20.5609 30.14 20.3099 30.4496 20.3099C30.7592 20.3099 31.0101 20.5609 31.0101 20.8705V24.5516H31.3389C31.9674 24.5516 32.4805 24.0596 32.5071 23.4317C32.5733 21.8642 32.571 20.5319 32.5002 19.2394C32.423 18.2461 32.222 18.0338 31.7487 17.7563ZM29.1571 11.785C28.2951 12.118 27.3571 12.2914 26.3912 12.2914C25.4252 12.2914 24.4873 12.118 23.6252 11.785C23.5772 11.9932 23.5522 12.2071 23.5522 12.4253C23.5522 13.9776 24.805 15.2423 26.3526 15.2631C26.3783 15.263 26.404 15.263 26.4297 15.2631C27.9773 15.2423 29.23 13.9777 29.23 12.4253C29.23 12.2071 29.205 11.9932 29.1571 11.785H29.1571ZM29.4002 9.62172L26.8333 10.3095C26.6846 10.3494 26.5379 10.3693 26.3912 10.3693C26.2445 10.3693 26.0977 10.3494 25.949 10.3095L23.3823 9.62172V10.445C24.2798 10.9203 25.3133 11.1703 26.3912 11.1703C27.4692 11.1703 28.5027 10.9203 29.4002 10.445V9.62172ZM30.734 8.10368L26.5432 6.98074C26.4351 6.95183 26.3471 6.95183 26.2392 6.98074L22.0485 8.10368L26.2392 9.22661C26.3474 9.25552 26.4353 9.25552 26.5431 9.22661L30.734 8.10368ZM7.8831 19.7572C7.23879 19.7572 6.53427 19.7272 5.76295 19.6679C5.52648 20.2414 4.96209 20.6464 4.30425 20.6464H2.41553C1.57655 20.6464 0.894043 19.9639 0.894043 19.1249V12.238C0.894043 11.3991 1.57655 10.7165 2.41553 10.7165H4.30425C4.72458 10.7165 5.12041 10.8809 5.41894 11.1795C5.53209 11.2926 5.62578 11.4199 5.69873 11.557C6.92761 11.027 7.94188 10.0696 9.11943 8.74214C9.39241 8.43448 9.67301 8.10472 9.9701 7.75558C10.6781 6.92357 11.4101 6.06329 12.1985 5.30895C13.8597 3.71956 15.3588 3.17535 17.2952 2.58005C19.3892 1.9363 23.8198 0.804077 25.0692 0.974243C25.9842 1.0986 26.6074 1.68157 26.6567 2.45937C26.7017 3.16886 26.2208 4.0257 25.0451 4.34081C23.6897 4.70404 20.5605 5.77933 18.3079 6.7755C18.6201 7.02855 18.8474 7.37857 18.9525 7.79137C19.1275 8.47892 18.9242 9.17657 18.4087 9.66C16.3911 11.68 15.6253 13.5318 14.9494 15.1658C14.324 16.6778 13.784 17.9836 12.4134 18.8201C11.3764 19.4528 9.93534 19.7571 7.88318 19.7571L7.8831 19.7572ZM5.88187 12.6915V18.5525C8.8028 18.7736 10.6987 18.5532 11.8293 17.8632C12.8877 17.2174 13.3178 16.1771 13.9134 14.7374C14.5945 13.0906 15.4422 11.0411 17.6227 8.86058C17.6276 8.85561 17.6328 8.85065 17.6379 8.84592C17.8537 8.64581 17.9389 8.35504 17.8659 8.06796C17.7928 7.78096 17.579 7.56627 17.2938 7.49372C17.1302 7.45208 16.9409 7.4737 16.7345 7.54529C16.7344 7.54537 16.7341 7.54553 16.7339 7.54569C15.3448 8.02824 13.177 10.7937 12.7776 12.0604C12.6844 12.3557 12.3696 12.5194 12.0744 12.4264C11.7791 12.3332 11.6153 12.0184 11.7084 11.7232C12.0959 10.4946 14.1971 7.41501 16.185 6.57202L16.1834 6.56914C18.3096 5.37029 22.9414 3.74414 24.7548 3.25815C25.315 3.108 25.5534 2.77576 25.5378 2.53064C25.5233 2.30258 25.2918 2.1361 24.9183 2.08533C24.0735 1.97098 20.2378 2.84847 17.6247 3.65181C15.7803 4.21885 14.4602 4.69683 12.9736 6.1191C12.2267 6.83364 11.5136 7.67174 10.824 8.48221C10.523 8.83591 10.2388 9.16992 9.95817 9.48631C8.88296 10.6983 7.60147 12.0288 5.88195 12.6917L5.88187 12.6915ZM4.76078 12.2942C4.76078 12.1733 4.71297 12.059 4.62624 11.9722C4.53944 11.8854 4.42509 11.8376 4.30425 11.8376H2.41561C2.19483 11.8376 2.01522 12.0172 2.01522 12.238V19.1249C2.01522 19.3457 2.19483 19.5253 2.41561 19.5253H4.30425C4.55602 19.5253 4.76078 19.3205 4.76078 19.0688V12.2941V12.2942Z"
                                        fill="#006ED9"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_93_570">
                                        <rect width="41" height="41" fill="white" transform="translate(0.32959 0.636719)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>Supportive faculty for education</p>
                        </div>
                        <div className="four_box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="37" height="42" viewBox="0 0 37 42" fill="none">
                                <g clip-path="url(#clip0_93_588)">
                                    <mask id="mask0_93_588" maskUnits="userSpaceOnUse" x="-5" y="0" width="42" height="42">
                                        <path d="M-4.03711 0.636723H36.9629V41.6367H-4.03711V0.636723Z" fill="white" />
                                    </mask>
                                    <g mask="url(#mask0_93_588)">
                                        <path
                                            d="M24.7008 5.02448L16.6114 1.27073C16.5173 1.22701 16.4086 1.22701 16.3144 1.27073L4.35276 6.82135C4.08033 6.94779 4.08033 7.33505 4.35276 7.46149L16.3144 13.0122C16.4086 13.0558 16.5173 13.0558 16.6114 13.0122L28.5731 7.46149C28.8456 7.33505 28.8456 6.94779 28.5731 6.82135L27.2326 6.1993"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M7.81788 13.6297L7.68607 14.1225C7.63394 14.3173 7.71073 14.5239 7.87754 14.6374L8.50046 15.0613C13.3056 18.3311 19.6211 18.3311 24.4261 15.0613L25.0491 14.6374C25.2158 14.5239 25.2926 14.3173 25.2406 14.1225L24.0238 9.57274"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path d="M8.90276 9.57138L8.54785 10.8984" stroke="#006ED9" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path
                                            d="M16.4629 7.14137L21.826 10.3642C21.959 10.4441 22.0403 10.5879 22.0403 10.7431V18.4531"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M22.9778 20.5039H21.1017C21.0531 20.5039 21.0137 20.4645 21.0137 20.4158V19.4778C21.0137 18.9111 21.4731 18.4517 22.0397 18.4517C22.6064 18.4517 23.0659 18.9111 23.0659 19.4778V20.4158C23.0659 20.4645 23.0264 20.5039 22.9778 20.5039Z"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M23.4434 23.1139L22.9721 20.5046H21.1083L20.637 23.1139C20.6258 23.176 20.6559 23.2383 20.7117 23.2679C21.5421 23.7102 22.5383 23.7102 23.3687 23.2679C23.4245 23.2383 23.4547 23.176 23.4434 23.1139Z"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M21.9907 18.4531C21.8105 17.8093 21.6086 17.1991 21.3877 16.6281"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M22.8743 23.4732C22.9535 24.3893 22.9952 25.3366 22.9952 26.3056C22.9952 34.4407 20.0707 41.0352 16.4625 41.0352C12.8541 41.0352 9.92969 34.4407 9.92969 26.3056C9.92969 23.7151 10.226 21.2799 10.7473 19.165C10.9715 18.2561 11.2366 17.4057 11.5377 16.6281"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path d="M1.7334 26.3066H31.1922" stroke="#006ED9" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16.4628 17.5128V41.0371" stroke="#006ED9" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        <path
                                            d="M5.99219 15.9459C7.39596 17.364 9.01674 18.4371 10.7472 19.165C14.0104 20.5367 17.6684 20.6809 21.014 19.5966"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M26.9326 15.9469C25.7138 17.1777 24.3325 18.1483 22.8574 18.8594"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M26.9332 36.666C21.1673 30.8405 11.759 30.8405 5.99316 36.666"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M27.6736 16.752C26.9426 15.8951 26.1151 15.1232 25.208 14.4528"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                        <path
                                            d="M7.71788 14.4521C4.08762 17.1347 1.7334 21.4453 1.7334 26.3057C1.7334 34.4406 8.32799 41.0352 16.4628 41.0352C24.5976 41.0352 31.1923 34.4406 31.1923 26.3057C31.1923 23.6815 30.506 21.2176 29.3032 19.0837"
                                            stroke="#006ED9"
                                            stroke-width="1.5"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="clip0_93_588">
                                        <rect width="41" height="41" fill="white" transform="translate(-4.03711 0.636719)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>Developing Academically Education</p>
                        </div>
                    </div>
                </div>
                <div className="fourth_col2">
                    <img src="/right-side-img.png" />
                </div>
            </div>
            <div className="justify-center grid grid-cols-4 gap-0 fourth_section1">
                <div className="col-start-2 col-span-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                        <path d="M37.2493 10.08C37.8705 10.5148 38.2432 11.2603 38.2432 12.0678V34.68" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M4.01489 34.6808V12.0687C4.01489 10.702 5.13307 9.58386 6.49974 9.58386H21.9679"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M25.3844 34.6796V36.2947C25.3844 36.8538 24.9496 37.2887 24.3905 37.2887H17.9299C17.3708 37.2887 16.9359 36.8538 16.9359 36.2947V34.6796H1.90259V37.5993C1.90259 38.8417 2.89653 39.8356 4.13895 39.8356H38.1814C39.4238 39.8356 40.4177 38.8417 40.4177 37.5993V34.6796H25.3844Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M14.6995 15.5487V31.2654" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M17.6961 30.5977C21.6905 28.942 23.5863 24.3618 21.9307 20.3674C20.275 16.3731 15.6948 14.4772 11.7004 16.1329C7.70607 17.7886 5.8102 22.3688 7.46586 26.3631C9.12153 30.3575 13.7018 32.2534 17.6961 30.5977Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M14.6995 31.2033C16.9982 31.2033 18.8616 27.6989 18.8616 23.376C18.8616 19.0531 16.9982 15.5487 14.6995 15.5487C12.4008 15.5487 10.5374 19.0531 10.5374 23.376C10.5374 27.6989 12.4008 31.2033 14.6995 31.2033Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M14.6991 27.537C19.022 27.537 22.5264 25.6736 22.5264 23.3749C22.5264 21.0762 19.022 19.2128 14.6991 19.2128C10.3762 19.2128 6.87183 21.0762 6.87183 23.3749C6.87183 25.6736 10.3762 27.537 14.6991 27.537Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M6.80981 23.3749H22.5265" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M29.6089 1.50769C25.3847 1.50769 21.968 4.92436 21.968 9.1486C21.968 10.6395 22.4029 12.0683 23.1483 13.2486L22.5271 16.7895L26.3786 16.1062C27.3726 16.541 28.4286 16.7895 29.6089 16.7895C33.8332 16.7895 37.2498 13.3728 37.2498 9.1486C37.2498 4.92436 33.8332 1.50769 29.6089 1.50769Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M33.0254 8.3413V12.3171C30.7269 12.7519 28.3042 12.7519 25.9436 12.3171V8.27917L29.5466 9.70796L33.0254 8.3413Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M34.7024 7.71863V11.2595" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M29.5466 9.7073L24.3284 7.6573L29.5466 5.6073L34.7026 7.6573L29.5466 9.7073Z" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M29.1738 21.9455C29.1738 23.1258 28.1799 24.1198 26.9996 24.1198C25.8193 24.1198 24.8253 23.1258 24.8253 21.9455C24.8253 20.7652 25.8193 19.7713 26.9996 19.7713C28.1799 19.7713 29.1738 20.7652 29.1738 21.9455Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M29.1739 29.0276C29.1739 30.2079 28.18 31.2019 26.9997 31.2019C25.8194 31.2019 24.8254 30.2079 24.8254 29.0276C24.8254 27.8473 25.8194 26.8534 26.9997 26.8534C28.18 26.8534 29.1739 27.8473 29.1739 29.0276Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M31.7825 20.703H34.2673" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31.7825 23.1874H35.634" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31.7825 27.785H34.2673" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31.7825 30.332H35.634" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M37.2493 10.08C37.8705 10.5148 38.2432 11.2603 38.2432 12.0678V34.68" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M4.01489 34.6808V12.0687C4.01489 10.702 5.13307 9.58386 6.49974 9.58386H21.9679"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M25.3844 34.6796V36.2947C25.3844 36.8538 24.9496 37.2887 24.3905 37.2887H17.9299C17.3708 37.2887 16.9359 36.8538 16.9359 36.2947V34.6796H1.90259V37.5993C1.90259 38.8417 2.89653 39.8356 4.13895 39.8356H38.1814C39.4238 39.8356 40.4177 38.8417 40.4177 37.5993V34.6796H25.3844Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M14.6995 15.5487V31.2654" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M17.6961 30.5977C21.6905 28.942 23.5863 24.3618 21.9307 20.3674C20.275 16.3731 15.6948 14.4772 11.7004 16.1329C7.70607 17.7886 5.8102 22.3688 7.46586 26.3631C9.12153 30.3575 13.7018 32.2534 17.6961 30.5977Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M14.6995 31.2033C16.9982 31.2033 18.8616 27.6989 18.8616 23.376C18.8616 19.0531 16.9982 15.5487 14.6995 15.5487C12.4008 15.5487 10.5374 19.0531 10.5374 23.376C10.5374 27.6989 12.4008 31.2033 14.6995 31.2033Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M14.6991 27.537C19.022 27.537 22.5264 25.6736 22.5264 23.3749C22.5264 21.0762 19.022 19.2128 14.6991 19.2128C10.3762 19.2128 6.87183 21.0762 6.87183 23.3749C6.87183 25.6736 10.3762 27.537 14.6991 27.537Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M6.80981 23.3749H22.5265" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M29.6089 1.50769C25.3847 1.50769 21.968 4.92436 21.968 9.1486C21.968 10.6395 22.4029 12.0683 23.1483 13.2486L22.5271 16.7895L26.3786 16.1062C27.3726 16.541 28.4286 16.7895 29.6089 16.7895C33.8332 16.7895 37.2498 13.3728 37.2498 9.1486C37.2498 4.92436 33.8332 1.50769 29.6089 1.50769Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M33.0254 8.3413V12.3171C30.7269 12.7519 28.3042 12.7519 25.9436 12.3171V8.27917L29.5466 9.70796L33.0254 8.3413Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M34.7024 7.71863V11.2595" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M29.5466 9.7073L24.3284 7.6573L29.5466 5.6073L34.7026 7.6573L29.5466 9.7073Z" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path
                            d="M29.1738 21.9455C29.1738 23.1258 28.1799 24.1198 26.9996 24.1198C25.8193 24.1198 24.8253 23.1258 24.8253 21.9455C24.8253 20.7652 25.8193 19.7713 26.9996 19.7713C28.1799 19.7713 29.1738 20.7652 29.1738 21.9455Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path
                            d="M29.1739 29.0276C29.1739 30.2079 28.18 31.2019 26.9997 31.2019C25.8194 31.2019 24.8254 30.2079 24.8254 29.0276C24.8254 27.8473 25.8194 26.8534 26.9997 26.8534C28.18 26.8534 29.1739 27.8473 29.1739 29.0276Z"
                            stroke="#006ED9"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                        <path d="M31.7825 20.703H34.2673" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31.7825 23.1874H35.634" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31.7825 27.785H34.2673" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M31.7825 30.332H35.634" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <h4>ABOUT SKYLINE</h4>
                    <p>Skyline Consultants is the Best study visa consultants in Chandigarh for students who want to study abroad.</p>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                        <g clip-path="url(#clip0_93_681)">
                            <path
                                d="M40.499 26.8765C39.7735 25.6193 38.1591 25.1804 36.825 25.8779L28.4473 30.2534C28.3872 30.0596 28.3055 29.8714 28.2014 29.6912C27.8395 29.0642 27.2573 28.6166 26.563 28.4308L14.2919 25.1428C14.1509 25.1044 14.1501 25.1044 13.2028 25.4119C12.0577 25.7842 9.88275 26.4905 8.8065 26.8164V25.1804C8.8065 24.9154 8.59109 24.7 8.32604 24.7H1.94141C1.67635 24.7 1.46094 24.9154 1.46094 25.1804V39.8203C1.46094 40.0854 1.67635 40.3008 1.94141 40.3008H8.32604C8.59109 40.3008 8.8065 40.0854 8.8065 39.8203V38.1347L13.664 39.0956C14.0084 39.1637 14.3215 39.1949 14.665 39.1949C14.7019 39.1949 14.7395 39.1949 14.7771 39.1941L24.1335 39.0171C24.6115 39.0195 25.0848 38.8962 25.4996 38.6568L39.5093 30.5681C40.8001 29.8234 41.2437 28.1674 40.499 26.8765ZM7.84557 39.3399H2.42187V25.6609H7.84557V39.3399ZM39.0296 29.7361L25.0191 37.8248C24.7509 37.9793 24.4474 38.0626 24.1359 38.0562C24.1311 38.0562 24.1262 38.0562 24.1214 38.0562L14.7587 38.2332C14.4376 38.2396 14.1661 38.2156 13.8506 38.1531L8.8065 37.1553V27.819C9.76103 27.5403 12.1538 26.7628 13.4991 26.3256C13.7786 26.2351 14.0324 26.1526 14.1757 26.1061L26.314 29.3589C26.7608 29.479 27.1356 29.7673 27.3694 30.1717C27.6032 30.5761 27.6657 31.0454 27.5456 31.4922C27.4255 31.939 27.1372 32.3138 26.7328 32.5476C26.3284 32.7815 25.8591 32.8439 25.4123 32.7238L17.1338 30.5056C16.8776 30.4376 16.6141 30.5889 16.5453 30.8452C16.4764 31.1014 16.6285 31.3649 16.8848 31.4337L25.1633 33.6519C25.8583 33.8377 26.5862 33.7416 27.2125 33.3796C27.8395 33.0177 28.2871 32.4355 28.4729 31.7412C28.5137 31.5891 28.541 31.4353 28.5546 31.2816L37.2687 26.7308C38.1455 26.2727 39.1978 26.549 39.6654 27.3586C40.1467 28.189 39.8608 29.2564 39.0296 29.7361ZM10.7788 24.0537C11.3378 24.2035 11.9047 24.2772 12.4677 24.2772C13.5912 24.2772 14.7003 23.9825 15.6996 23.4059C18.7962 21.6178 19.8613 17.6435 18.0731 14.5469C16.285 11.4502 12.3107 10.3852 9.2141 12.1734C7.71424 13.0398 6.64039 14.438 6.19275 16.1116C5.74432 17.7852 5.97414 19.5325 6.84059 21.0324C7.70703 22.5323 9.106 23.6053 10.7788 24.0537ZM7.12166 16.3598C7.50363 14.9344 8.41732 13.7429 9.69537 13.0054C10.5634 12.5041 11.5115 12.2662 12.4485 12.2662C14.3591 12.2662 16.2201 13.2576 17.2419 15.0273C18.765 17.6651 17.8577 21.0508 15.22 22.5739C14.3519 23.0752 13.4038 23.313 12.4669 23.313C10.5562 23.313 8.69519 22.3217 7.6734 20.5519C6.93508 19.2739 6.73969 17.7852 7.12166 16.3598ZM13.5671 19.3307C13.5671 18.8471 13.375 18.2697 12.4581 18.2697C11.2008 18.2697 10.388 17.4761 10.388 16.2477C10.388 15.2948 11.0671 14.494 11.9776 14.2818V13.6276C11.9776 13.3625 12.193 13.1471 12.4581 13.1471C12.7231 13.1471 12.9385 13.3625 12.9385 13.6276V14.2818C13.849 14.494 14.5281 15.2948 14.5281 16.2477C14.5281 16.5128 14.3127 16.7282 14.0476 16.7282C13.7826 16.7282 13.5671 16.5128 13.5671 16.2477C13.5671 15.6632 13.0699 15.1867 12.4581 15.1867C11.8463 15.1867 11.349 15.6624 11.349 16.2477C11.349 16.7314 11.5412 17.3088 12.4581 17.3088C13.7153 17.3088 14.5281 18.1023 14.5281 19.3307C14.5281 20.2837 13.849 21.0844 12.9385 21.2967V21.9509C12.9385 22.216 12.7231 22.4314 12.4581 22.4314C12.193 22.4314 11.9776 22.216 11.9776 21.9509V21.2967C11.0671 21.0844 10.388 20.2837 10.388 19.3307C10.388 19.0657 10.6035 18.8503 10.8685 18.8503C11.1336 18.8503 11.349 19.0657 11.349 19.3307C11.349 19.9153 11.8463 20.3918 12.4581 20.3918C13.0699 20.3918 13.5671 19.9153 13.5671 19.3307ZM28.6691 12.9701C28.4064 12.6186 27.922 12.5193 27.5416 12.7387L26.077 13.5843C25.6966 13.8037 25.5404 14.273 25.7142 14.6766C25.8119 14.9032 25.7735 15.1386 25.6093 15.322C25.3923 15.5655 25.1921 15.8265 25.0135 16.098C24.8782 16.3038 24.6612 16.4015 24.4177 16.3662C23.9829 16.303 23.5705 16.576 23.4568 16.9997L23.0188 18.6341C22.9051 19.0577 23.1269 19.5005 23.5337 19.6631C23.7619 19.7543 23.9012 19.9473 23.9156 20.1932C23.9349 20.5175 23.9773 20.8442 24.0438 21.1629C24.0934 21.404 24.0093 21.6274 23.8115 21.7747C23.46 22.0374 23.3607 22.5218 23.5801 22.9022L24.4257 24.3668C24.6452 24.7472 25.1144 24.9034 25.518 24.7296C25.7446 24.6319 25.9801 24.6703 26.1634 24.8345C26.4061 25.0515 26.6671 25.2517 26.9394 25.4303C27.1452 25.5656 27.2429 25.7826 27.2077 26.0261C27.1452 26.4601 27.4175 26.8733 27.8411 26.987L29.4747 27.425C29.5491 27.4451 29.6252 27.4547 29.6989 27.4547C30.0456 27.4547 30.3691 27.2449 30.5029 26.9093C30.5942 26.6811 30.7871 26.5418 31.033 26.5274C31.3573 26.5081 31.6832 26.4657 32.0027 26.3992C32.2438 26.3496 32.4672 26.4337 32.6145 26.6315C32.8772 26.983 33.3617 27.0831 33.742 26.8637L35.2067 26.0181C35.5862 25.7994 35.744 25.3334 35.575 24.9354C35.4789 24.7104 35.5174 24.4758 35.6799 24.2932C35.8985 24.0465 36.1003 23.7823 36.2797 23.5068C36.4126 23.3034 36.6264 23.2049 36.8675 23.2353C37.3103 23.2938 37.7147 23.0263 37.8276 22.6027L38.2656 20.9683C38.381 20.5375 38.1591 20.0947 37.7499 19.9377C37.5177 19.8488 37.3752 19.6559 37.3592 19.4068C37.3391 19.0865 37.2951 18.7638 37.2294 18.4483C37.1782 18.2056 37.2639 17.9814 37.4625 17.8341C37.8204 17.569 37.9237 17.0813 37.7035 16.7002L36.8579 15.2355C36.6361 14.852 36.1516 14.6942 35.7544 14.8768C35.5254 14.9817 35.2851 14.9465 35.097 14.7791C34.8591 14.5685 34.6045 14.3739 34.3402 14.1993C34.1304 14.0608 34.0335 13.8398 34.0744 13.5915C34.1472 13.1503 33.8758 12.7307 33.4433 12.6146L31.8089 12.1766C31.3853 12.0628 30.9425 12.2847 30.7799 12.6915C30.6887 12.9197 30.4957 13.059 30.2498 13.0734C29.9247 13.0926 29.5988 13.1359 29.2801 13.2016C29.039 13.2528 28.8164 13.1679 28.6691 12.9701ZM29.4755 14.1433C29.7485 14.0864 30.028 14.0496 30.3059 14.0336C30.892 13.9991 31.3957 13.654 31.6392 13.1263L33.1142 13.5211C33.0486 14.1104 33.3112 14.6718 33.8117 15.0017C34.0383 15.1507 34.2561 15.318 34.4595 15.4982C34.908 15.8954 35.5158 16.0019 36.0667 15.7873L36.8298 17.1086C36.3734 17.4809 36.1668 18.0631 36.2885 18.6453C36.3454 18.9159 36.383 19.1922 36.3998 19.4661C36.4367 20.0546 36.785 20.5567 37.3159 20.797L36.9203 22.2736C36.3342 22.2224 35.7984 22.4834 35.4741 22.9807C35.3204 23.2161 35.1474 23.4427 34.9608 23.6542C34.5748 24.089 34.4627 24.6832 34.6573 25.2245L33.3328 25.9892C32.9605 25.5416 32.3847 25.3382 31.8081 25.4575C31.5343 25.5144 31.2556 25.5512 30.9777 25.5672C30.3916 25.6017 29.8879 25.9468 29.6444 26.4745L28.1686 26.0789C28.2222 25.5 27.958 24.949 27.4679 24.6263C27.2349 24.4734 27.0115 24.3012 26.8033 24.1162C26.3644 23.7246 25.7638 23.6125 25.2177 23.8143L24.4538 22.4906C24.9014 22.1183 25.1048 21.5425 24.9855 20.9667C24.9286 20.6937 24.8918 20.4142 24.8758 20.1363C24.8413 19.5501 24.4962 19.0465 23.9685 18.803L24.3641 17.3272C24.943 17.3808 25.494 17.1174 25.8167 16.6265C25.9696 16.3943 26.141 16.1709 26.3268 15.9618C26.7184 15.523 26.8305 14.9224 26.6287 14.3763L27.9524 13.6124C28.3231 14.06 28.8997 14.2626 29.4755 14.1433ZM26.0009 19.8008C26.0009 22.3601 28.0829 24.4421 30.6422 24.4421C33.2015 24.4421 35.2835 22.3601 35.2835 19.8008C35.2835 17.2415 33.2015 15.1595 30.6422 15.1595C28.0829 15.1595 26.0009 17.2415 26.0009 19.8008ZM28.4032 16.8827L28.4817 17.0181C28.5706 17.1718 28.7323 17.2583 28.8981 17.2583C28.9798 17.2583 29.0623 17.2375 29.1375 17.1943C29.3674 17.0613 29.4458 16.7674 29.3137 16.5376L29.2344 16.4007C29.5267 16.279 29.8374 16.1949 30.1617 16.1524V16.3102C30.1617 16.5752 30.3771 16.7907 30.6422 16.7907C30.9073 16.7907 31.1227 16.5752 31.1227 16.3102V16.1524C31.447 16.1949 31.7577 16.279 32.05 16.4007L31.9707 16.5376C31.8378 16.7674 31.917 17.0613 32.1469 17.1943C32.2221 17.2383 32.3054 17.2583 32.3863 17.2583C32.5521 17.2583 32.7138 17.1718 32.8027 17.0181L32.8812 16.8827C33.1358 17.0781 33.3641 17.3064 33.5594 17.561L33.4241 17.6395C33.1943 17.7724 33.1158 18.0663 33.2479 18.2961C33.3368 18.4499 33.4986 18.5364 33.6644 18.5364C33.746 18.5364 33.8285 18.5155 33.9038 18.4723L34.0407 18.393C34.1624 18.6853 34.2465 18.996 34.289 19.3203H34.1312C33.8661 19.3203 33.6507 19.5357 33.6507 19.8008C33.6507 20.0659 33.8661 20.2813 34.1312 20.2813H34.289C34.2465 20.6056 34.1624 20.9163 34.0407 21.2086L33.9038 21.1293C33.674 20.9964 33.3801 21.0756 33.2471 21.3055C33.1142 21.5353 33.1935 21.8292 33.4233 21.9621L33.5586 22.0406C33.3633 22.2952 33.135 22.5235 32.8804 22.7188L32.8019 22.5835C32.669 22.3537 32.3751 22.2752 32.1453 22.4073C31.9154 22.5403 31.837 22.8342 31.9691 23.064L32.0484 23.2009C31.7561 23.3226 31.4454 23.4067 31.1211 23.4492V23.2914C31.1211 23.0263 30.9057 22.8109 30.6406 22.8109C30.3755 22.8109 30.1601 23.0263 30.1601 23.2914V23.4492C29.8358 23.4067 29.5251 23.3226 29.2328 23.2009L29.3121 23.064C29.445 22.8342 29.3658 22.5403 29.1359 22.4073C28.9061 22.2744 28.6122 22.3537 28.4793 22.5835L28.4008 22.7188C28.1462 22.5235 27.9179 22.2952 27.7226 22.0406L27.8579 21.9621C28.0877 21.8292 28.1662 21.5353 28.0341 21.3055C27.9019 21.0756 27.6072 20.9972 27.3774 21.1293L27.2405 21.2086C27.1188 20.9163 27.0347 20.6056 26.9922 20.2813H27.15C27.4151 20.2813 27.6305 20.0659 27.6305 19.8008C27.6305 19.5357 27.4151 19.3203 27.15 19.3203H26.9922C27.0347 18.996 27.1188 18.6853 27.2405 18.393L27.3774 18.4723C27.4535 18.5163 27.536 18.5364 27.6169 18.5364C27.7826 18.5364 27.9444 18.4499 28.0333 18.2961C28.1662 18.0663 28.0869 17.7724 27.8571 17.6395L27.7218 17.561C27.9203 17.3072 28.1486 17.0789 28.4032 16.8827ZM30.1617 19.8008V17.6251C30.1617 17.36 30.3771 17.1446 30.6422 17.1446C30.9073 17.1446 31.1227 17.36 31.1227 17.6251V19.3203H32.1084C32.3735 19.3203 32.5889 19.5357 32.5889 19.8008C32.5889 20.0659 32.3735 20.2813 32.1084 20.2813H30.6422C30.3763 20.2813 30.1617 20.0659 30.1617 19.8008ZM22.2716 13.8718C23.9325 13.8718 25.5933 13.2392 26.8585 11.9748C28.0837 10.7496 28.758 9.12077 28.758 7.38788C28.758 5.65499 28.0829 4.0262 26.8585 2.80101C24.3296 0.272141 20.2144 0.272141 17.6856 2.80101C16.4604 4.0262 15.7861 5.65499 15.7861 7.38788C15.7861 9.12077 16.4612 10.7496 17.6856 11.9748C18.95 13.24 20.6108 13.8718 22.2716 13.8718ZM18.9436 11.7986C19.2375 10.4981 20.4042 9.54679 21.7607 9.54679H22.7825C24.1391 9.54679 25.3058 10.4981 25.5997 11.7986C23.6378 13.2808 20.9055 13.2808 18.9436 11.7986ZM22.2716 8.37605C21.3443 8.37605 20.59 7.62171 20.59 6.69441C20.59 5.7671 21.3443 5.01277 22.2716 5.01277C23.1989 5.01277 23.9533 5.7671 23.9533 6.69441C23.9533 7.62171 23.1989 8.37605 22.2716 8.37605ZM18.3646 3.48167C19.4417 2.40462 20.8567 1.8657 22.2716 1.8657C23.6866 1.8657 25.1016 2.40462 26.1787 3.48167C27.2221 4.52509 27.797 5.91284 27.797 7.38868C27.797 8.76443 27.2973 10.0633 26.3845 11.0779C25.964 9.9664 25.0455 9.10876 23.9188 8.75802C24.525 8.27355 24.9142 7.52882 24.9142 6.69441C24.9142 5.23779 23.7291 4.05183 22.2716 4.05183C20.8142 4.05183 19.6291 5.23698 19.6291 6.69441C19.6291 7.52882 20.0182 8.27355 20.6244 8.75802C19.4969 9.10876 18.5784 9.9656 18.1588 11.0779C17.2459 10.0625 16.7462 8.76363 16.7462 7.38868C16.7462 5.91284 17.3212 4.52509 18.3646 3.48167Z"
                                fill="#006ED9"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_93_681">
                                <rect width="41" height="41" fill="white" transform="translate(0.660156 0.101562)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <h4>SERVICES</h4>
                    <p>Counseling with a global perspective : Applying for higher education abroad is a huge decision, both…</p>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="41" viewBox="0 0 42 41" fill="none">
                        <g clip-path="url(#clip0_93_686)">
                            <path d="M33.1299 3.58398H38.3703" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M30.1543 3.58398H30.7931" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M30.1543 6.4043H38.3706" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <mask id="mask0_93_686" maskUnits="userSpaceOnUse" x="0" y="0" width="42" height="41">
                                <path d="M0.660156 3.8147e-06H41.6602V41H0.660156V3.8147e-06Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0_93_686)">
                                <path
                                    d="M25.9378 14.4685V16.9259C25.9378 17.9409 25.1149 18.7637 24.0999 18.7637H22.585"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M30.915 37.7922H2.55216C1.8389 37.7922 1.26074 38.3704 1.26074 39.0837C1.26074 39.7968 1.8389 40.375 2.55216 40.375H30.915C31.6283 40.375 32.2065 39.7968 32.2065 39.0837C32.2065 38.3704 31.6283 37.7922 30.915 37.7922Z"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path d="M4.35645 35.4493L4.48361 37.793" stroke="#006ED9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path
                                    d="M28.9827 37.793L29.5779 26.8269C29.6351 25.771 28.7945 24.8834 27.737 24.8834H5.72935C4.67191 24.8834 3.83117 25.771 3.88851 26.8269L4.20514 32.6619"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M31.7263 38.0801V35.5643C31.7263 33.1411 30.8843 30.8851 29.4551 29.1029"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M4.01239 29.1029C2.58315 30.8851 1.74121 33.1411 1.74121 35.5643V38.0801"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M22.8476 5.55156H22.7803C22.4075 5.55156 22.1053 5.24942 22.1053 4.87666C22.1053 3.77294 21.2107 2.87823 20.1069 2.87823H13.7464C10.9157 2.87823 8.62109 5.17287 8.62109 8.00355V11.3906C8.62109 11.8881 8.93588 12.3312 9.40578 12.4948L10.6682 12.9344C11.1095 13.088 11.5704 12.7599 11.5697 12.2927L11.5668 9.90428C11.562 8.74275 12.4883 7.79711 13.6358 7.79214L13.6608 7.79206C14.0121 7.79054 14.3595 7.84507 14.6913 7.95174C15.2793 8.14064 15.8885 8.25515 16.5061 8.25251H16.961C17.5786 8.25515 18.1878 8.14064 18.7757 7.95174C19.1076 7.84507 19.4549 7.79054 19.8062 7.79206L19.8312 7.79214C20.9787 7.79711 21.905 8.74275 21.9002 9.90428L21.8979 12.2929C21.8972 12.7601 22.3581 13.088 22.7992 12.9344L24.0614 12.4948C24.5312 12.3312 24.846 11.8882 24.846 11.3907V7.54998C24.846 6.44627 23.9512 5.55156 22.8476 5.55156Z"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M10.1787 15.9787H10.1899C10.2341 17.7207 10.9644 19.3946 12.2759 20.5279C13.3318 21.4403 14.8139 22.2343 16.7674 22.248C18.7206 22.2176 20.1962 21.411 21.2443 20.4896C22.5205 19.3679 23.2322 17.7315 23.2881 16.0262"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M8.6214 11.1286C8.00024 11.243 7.5293 11.7862 7.5293 12.4405V14.7216C7.5293 15.4589 8.127 16.0566 8.86436 16.0566H10.1792V12.7651"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M23.2881 12.7653V16.0566H24.6029C25.3402 16.0566 25.938 15.4589 25.938 14.7217V12.4406C25.938 11.7863 25.467 11.243 24.8458 11.1287"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M21.2663 19.7051H19.759C19.184 19.7051 18.7178 19.2389 18.7178 18.6639C18.7178 18.0888 19.184 17.6226 19.759 17.6226H21.2663C21.8413 17.6226 22.3074 18.0888 22.3074 18.6639C22.3074 19.2389 21.8413 19.7051 21.2663 19.7051Z"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M20.9933 24.8828C20.4415 24.5836 20.0771 24.0018 20.0771 23.3465V21.3333"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M13.3905 21.3269V23.3464C13.3905 24.0129 13.0155 24.5874 12.4725 24.8827"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path
                                    d="M41.0593 3.53492V2.37251C41.0593 1.40789 40.2773 0.625924 39.3126 0.625924H29.2115C28.2468 0.625924 27.4648 1.40789 27.4648 2.37251V7.42448C27.4648 8.3891 28.2468 9.17106 29.2115 9.17106C29.7749 9.17106 30.2315 9.62775 30.2315 10.1911V13.3153C30.2315 13.712 30.7539 13.8566 30.9579 13.5164L33.2666 9.6665C33.4508 9.35916 33.783 9.17106 34.1414 9.17106H39.3126C40.2773 9.17106 41.0593 8.3891 41.0593 7.42448V6.34278"
                                    stroke="#006ED9"
                                    stroke-miterlimit="10"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_93_686">
                                <rect width="41" height="41" fill="white" transform="translate(0.660156)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <h4>CONTACT US</h4>
                    <p>If you have any further queries in addition to that, our study visa experts will be more than happy to guide you…</p>
                </div>
            </div>
            {/* 3rd section start */}
            <section className="bg_5th_section">
                <div className="grid grid-cols-5 gap-4">
                    <div className="col-start-2 col-span-3 third_section">
                        <h3>
                            We connect<span> schools, students and recruitment partners </span>from every part of the world
                        </h3>
                        <img src="/map.png" className="img_map" />
                    </div>
                </div>
                <div className="flex justify-center grid grid-rows-1 grid-flow-col gap-4">
                    <div className="there_box2">
                        <p className="p_tag_box_number2 p_tag_box_number">250K+</p>
                        <p className="p_tag_box">Students Helped</p>
                    </div>
                    <div className="there_box2">
                        <p className="p_tag_box_number2 p_tag_box_number">250K+</p>
                        <p className="p_tag_box">Students Helped</p>
                    </div>
                    <div className="there_box2">
                        <p className="p_tag_box_number2 p_tag_box_number acvite">250K+</p>
                        <p className="p_tag_box">Students Helped</p>
                    </div>
                    <div className="there_box2">
                        <p className="p_tag_box_number2 p_tag_box_number">250K+</p>
                        <p className="p_tag_box">Students Helped</p>
                    </div>
                </div>
            </section>
            <footer className="footer_bg">
                <div className="justify-center grid xl:grid-rows-1 xxl:grid-rows-1 lg:grid-rows-1 sm:grid-rows-4 md:grid-rows-2 grid-flow-col gap-4">
                    <div className="there_box21">
                        <img src="/edunetwork.png" className="footer_logo" alt="Logo" />
                        <p className="footer_heading">ADDRESS</p>
                        <p className="footer_content">
                            SCO 43, Sector 42 C, Level II, <br></br>Chandigarh (India) - 160036
                        </p>
                        <p className="footer_heading">PHONE</p>
                        <p className="footer_content">+91-9872311555, +91-172-4014522</p>
                        <p className="footer_heading">EMAIL</p>
                        <p className="footer_content">
                            <a href="mailto:s.dudani@skylineimmigration.com" target="_blank">
                                s.dudani@skylineimmigration.com
                            </a>
                        </p>
                        <p className="footer_icon">
                            <a href="https://www.facebook.com/skylineimmigrationconsultant/">
                                <svg xmlns="http://www.w3.org/2000/svg" className="s_footer_icon" viewBox="0 0 301 301" fill="none">
                                    <path
                                        d="M300.266 150.648C300.266 233.564 233.049 300.781 150.133 300.781C67.2168 300.781 0 233.564 0 150.648C0 67.7324 67.2168 0.515625 150.133 0.515625C233.049 0.515625 300.266 67.7324 300.266 150.648Z"
                                        fill="#3B579D"
                                    />
                                    <path
                                        d="M150.133 227.148C108.166 227.148 74.1328 192.892 74.1328 150.648C74.1328 108.405 108.166 74.1484 150.133 74.1484C192.1 74.1484 226.133 108.405 226.133 150.648C226.133 192.892 192.1 227.148 150.133 227.148Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M169.893 227.148V167.892H189.653L192.617 144.804H169.893V130.055C169.893 123.369 171.732 118.809 181.262 118.809H193.407V98.1694C191.31 97.894 184.09 97.2667 175.699 97.2667C158.189 97.2667 146.196 108.023 146.196 127.79V144.819H126.39V167.907H146.196V227.148H169.893Z"
                                        fill="#3B579D"
                                    />
                                </svg>
                            </a>
                            <a href="https://twitter.com/SkylineImmigra1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="s_footer_icon" viewBox="0 0 301 301" fill="none">
                                    <path
                                        d="M300.721 150.648C300.721 233.564 233.504 300.781 150.588 300.781C67.6718 300.781 0.455078 233.564 0.455078 150.648C0.455078 67.7324 67.6718 0.515625 150.588 0.515625C233.504 0.515625 300.721 67.7324 300.721 150.648Z"
                                        fill="black"
                                    />
                                    <path
                                        d="M150.588 74.1484C108.34 74.1484 74.0879 108.4 74.0879 150.648C74.0879 192.897 108.34 227.148 150.588 227.148C192.836 227.148 227.088 192.897 227.088 150.648C227.088 108.4 192.836 74.1484 150.588 74.1484Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M158.957 143.725L191.706 105.658H183.945L155.51 138.711L132.798 105.658H106.603L140.947 155.641L106.603 195.561H114.364L144.393 160.655L168.378 195.561H194.573L158.955 143.725H158.957ZM117.16 111.5H129.08L183.949 189.984H172.029L117.16 111.5Z"
                                        fill="black"
                                    />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/channel/UCfi_sZoA9s9mGDxmrCW6fig?view_as=subscriber">
                                <svg xmlns="http://www.w3.org/2000/svg" className="s_footer_icon" viewBox="0 0 302 311" fill="none">
                                    <path
                                        d="M150.955 310.43C234.074 310.43 301.455 241.034 301.455 155.43C301.455 69.8256 234.074 0.429688 150.955 0.429688C67.8362 0.429688 0.455078 69.8256 0.455078 155.43C0.455078 241.034 67.8362 310.43 150.955 310.43Z"
                                        fill="#FF0000"
                                    />
                                    <path
                                        d="M200.204 97.1211H101.706C97.7697 97.1211 93.872 97.92 90.2356 99.472C86.5993 101.024 83.2955 103.299 80.513 106.166C77.7306 109.034 75.5241 112.438 74.0195 116.184C72.515 119.93 71.742 123.945 71.7446 127.999V182.861C71.742 186.915 72.515 190.929 74.0195 194.675C75.5241 198.422 77.7306 201.826 80.513 204.693C83.2955 207.561 86.5993 209.835 90.2356 211.387C93.872 212.939 97.7697 213.738 101.706 213.738H200.204C204.14 213.738 208.038 212.939 211.674 211.387C215.311 209.835 218.615 207.561 221.397 204.693C224.18 201.826 226.386 198.422 227.891 194.675C229.395 190.929 230.168 186.915 230.166 182.861V127.999C230.168 123.945 229.395 119.93 227.891 116.184C226.386 112.438 224.18 109.034 221.397 106.166C218.615 103.299 215.311 101.024 211.674 99.472C208.038 97.92 204.14 97.1211 200.204 97.1211ZM130.083 180.434V130.426L171.827 155.43L130.083 180.434Z"
                                        fill="white"
                                    />
                                </svg>
                            </a>
                            <a href="https://in.pinterest.com/skylineimmigration/">
                                <svg xmlns="http://www.w3.org/2000/svg" className="s_footer_icon" viewBox="0 0 301 301" fill="none">
                                    <path
                                        d="M300.631 150.133C300.631 233.049 233.414 300.266 150.498 300.266C67.582 300.266 0.365234 233.049 0.365234 150.133C0.365234 67.2168 67.582 0 150.498 0C233.414 0 300.631 67.2168 300.631 150.133Z"
                                        fill="#D0272C"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M150.955 73.6328C193.206 73.6328 227.455 107.882 227.455 150.133C227.455 192.384 193.206 226.633 150.955 226.633C108.704 226.633 74.4551 192.384 74.4551 150.133C74.4551 107.882 108.704 73.6328 150.955 73.6328Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M144.727 164.659C142.364 177.048 139.477 188.93 130.928 195.133C128.289 176.406 134.803 162.34 137.828 147.41C132.67 138.727 138.449 121.254 149.326 125.56C162.714 130.855 137.735 157.84 154.502 161.21C172.011 164.728 179.158 130.831 168.302 119.811C152.617 103.895 122.641 119.446 126.329 142.235C127.225 147.805 132.981 149.496 128.627 157.185C118.589 154.959 115.592 147.04 115.977 136.485C116.599 119.204 131.501 107.108 146.452 105.434C165.359 103.318 183.103 112.376 185.553 130.159C188.312 150.231 177.019 171.971 156.803 170.408C151.323 169.984 149.022 167.268 144.727 164.659Z"
                                        fill="url(#paint0_linear_203_50)"
                                    />
                                    <defs>
                                        <linearGradient id="paint0_linear_203_50" x1="150.955" y1="105.131" x2="150.955" y2="195.133" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#D0272C" />
                                            <stop offset="1" stop-color="#E62027" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/skylineimmigrationconsultants/">
                                <svg xmlns="http://www.w3.org/2000/svg" className="s_footer_icon" viewBox="0 0 301 301" fill="none">
                                    <path
                                        d="M300.721 150.648C300.721 233.564 233.504 300.781 150.588 300.781C67.6718 300.781 0.455078 233.564 0.455078 150.648C0.455078 67.7324 67.6718 0.515625 150.588 0.515625C233.504 0.515625 300.721 67.7324 300.721 150.648Z"
                                        fill="black"
                                    />
                                    <path
                                        d="M177.742 150.64C177.742 165.636 165.586 177.793 150.589 177.793C135.592 177.793 123.436 165.636 123.436 150.64C123.436 135.643 135.592 123.486 150.589 123.486C165.586 123.486 177.742 135.643 177.742 150.64Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M211.282 104.731C210.034 101.35 208.044 98.2902 205.458 95.7786C202.946 93.1925 199.888 91.2022 196.506 89.9547C193.762 88.8892 189.641 87.621 182.05 87.2755C173.839 86.901 171.377 86.8203 150.589 86.8203C129.799 86.8203 127.337 86.8989 119.127 87.2734C111.537 87.621 107.413 88.8892 104.672 89.9547C101.29 91.2022 98.2296 93.1925 95.7201 95.7786C93.134 98.2902 91.1437 101.348 89.8941 104.731C88.8286 107.474 87.5604 111.597 87.2149 119.188C86.8405 127.397 86.7598 129.859 86.7598 150.649C86.7598 171.438 86.8405 173.9 87.2149 182.111C87.5604 189.702 88.8286 193.823 89.8941 196.566C91.1437 199.949 93.1319 203.007 95.718 205.518C98.2296 208.104 101.287 210.095 104.67 211.342C107.413 212.41 111.537 213.678 119.127 214.023C127.337 214.398 129.797 214.477 150.587 214.477C171.379 214.477 173.841 214.398 182.048 214.023C189.639 213.678 193.762 212.41 196.506 211.342C203.296 208.723 208.662 203.356 211.282 196.566C212.347 193.823 213.615 189.702 213.963 182.111C214.337 173.9 214.416 171.438 214.416 150.649C214.416 129.859 214.337 127.397 213.963 119.188C213.617 111.597 212.349 107.474 211.282 104.731ZM150.589 190.626C128.508 190.626 110.608 172.729 110.608 150.647C110.608 128.566 128.508 110.668 150.589 110.668C172.668 110.668 190.568 128.566 190.568 150.647C190.568 172.729 172.668 190.626 150.589 190.626ZM192.149 118.431C186.989 118.431 182.806 114.247 182.806 109.088C182.806 103.928 186.989 99.7446 192.149 99.7446C197.308 99.7446 201.492 103.928 201.492 109.088C201.49 114.247 197.308 118.431 192.149 118.431Z"
                                        fill="white"
                                    />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/skyline-immigration-consultants/">
                                <svg xmlns="http://www.w3.org/2000/svg" className="s_footer_icon" viewBox="0 0 302 301" fill="none">
                                    <path
                                        d="M301.176 150.562C301.176 233.479 233.959 300.695 151.043 300.695C68.1269 300.695 0.910156 233.479 0.910156 150.562C0.910156 67.6464 68.1269 0.429688 151.043 0.429688C233.959 0.429688 301.176 67.6464 301.176 150.562Z"
                                        fill="#0077B7"
                                    />
                                    <path
                                        d="M200.188 90.5625H101.898C95.903 90.5625 91.043 95.4225 91.043 101.417V199.707C91.043 205.702 95.903 210.562 101.898 210.562H200.188C206.183 210.562 211.043 205.702 211.043 199.707V101.417C211.043 95.4225 206.183 90.5625 200.188 90.5625ZM128.176 194.178C128.176 195.923 126.762 197.337 125.017 197.337H111.57C109.825 197.337 108.411 195.923 108.411 194.178V137.81C108.411 136.065 109.825 134.651 111.57 134.651H125.017C126.762 134.651 128.176 136.065 128.176 137.81V194.178ZM118.294 129.337C111.238 129.337 105.519 123.617 105.519 116.562C105.519 109.507 111.238 103.788 118.294 103.788C125.349 103.788 131.068 109.507 131.068 116.562C131.068 123.617 125.349 129.337 118.294 129.337ZM198.449 194.433C198.449 196.037 197.149 197.337 195.545 197.337H181.115C179.511 197.337 178.211 196.037 178.211 194.433V167.993C178.211 164.048 179.368 150.709 167.903 150.709C159.01 150.709 157.206 159.839 156.844 163.937V194.433C156.844 196.037 155.544 197.337 153.94 197.337H139.984C138.38 197.337 137.079 196.037 137.079 194.433V137.555C137.079 135.951 138.38 134.651 139.984 134.651H153.94C155.544 134.651 156.844 135.951 156.844 137.555V142.473C160.142 137.524 165.042 133.705 175.476 133.705C198.581 133.705 198.449 155.291 198.449 167.151V194.433Z"
                                        fill="white"
                                    />
                                </svg>
                            </a>
                        </p>
                    </div>
                    <div className="there_box22">
                        <p className="footer_heading footer_heading2">Connect</p>
                        <br></br>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-uk/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In UK
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-usa/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In USA
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-australia/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In Australia
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-ireland/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In Ireland
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-canada/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In Canada
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-germany/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In Germany
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-new-zealand/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In New Zealand
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-france/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study In France
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-dubai/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Study in Dubai
                            </a>
                        </p>
                    </div>
                    <div className="there_box23">
                        <p className="footer_heading footer_heading2">Legal</p>
                        <br></br>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Terms of Service & Honor Code
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Privacy Policy
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Accessibility Policy
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Trademark Policy
                            </a>
                        </p>
                        <p className="footer_content">
                            <a href="https://skylineimmigration.com/study-in-canada/" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" className="set_footer_icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                                Sitemap
                            </a>
                        </p>
                    </div>
                    <div className="there_box24">
                        <p className="footer_heading footer_heading2">Location</p>
                        <br></br>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d54877.37404780033!2d76.744598!3d30.723014!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fedd1e7aec40d%3A0x7964fc96e71df42d!2sSkyline%20Immigration%20Consultants!5e0!3m2!1sen!2sus!4v1721210173439!5m2!1sen!2sus"
                            width="100%"
                            height="350"
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
                <div className="main_footer justify-center grid grid-rows-1 grid-flow-col gap-4">
                    <p>Copyright © 2024 Skyline Immigration Consultants, All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default LoginCover;

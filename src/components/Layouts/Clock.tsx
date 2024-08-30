import React, { useState, useEffect } from 'react';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { ClockAPI } from '../../APIurl/url';
import userInfo from '../../getLoggedUser/GetUserInfomation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
import debounce from 'lodash.debounce';
// Function to format the time string to display hours, minutes, and AM/PM in uppercase
const formatTime = (date: any) => {
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).replace('am', 'AM').replace('pm', 'PM');
};

//AUTH TOKEN

const authTokenLocalStorage = localStorage.getItem('auth_token');


const Clocked = () => {



    const [isStaff, setIsStaff] = useState('');
    const [ctime, setTime] = useState(formatTime(new Date()));
    const [clockInTime, setClockInTime] = useState(null);
    const [clockOutTime, setClockOutTime] = useState(null);
    const [ClockIN_ID, setClockIN_ID] = useState(null);
    const [clockedIn, setClockedIn]: any = useState();
    const token = userInfo('jwt');
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(formatTime(new Date()));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    //handal clock in time
    const GetStudentData = async () => {
        const parametter = `?onlyview=GETCLOCKTIME`;
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(
                ClockAPI + parametter,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ PAGE_REQUEST: 'GETCLOCKTIMES' }),
                }
            );
            const data = await responseData.json();
            console.log(data.status)
            if (data.status == true) {
                setClockIN_ID(data.data[0]['ID']);
                setClockedIn(true);
            } else {
                setClockedIn(false);
            }
        } catch (err) {

        }
    };

    const storedUserId = sessionStorage.getItem('studentdataloader');
    const debouncedGetStudentData = debounce(GetStudentData, 300);
    const globalVar = window.globalVariable;
    useEffect(() => {
        if (globalVar && globalVar.ROLE) {
            setIsStaff(globalVar.ROLE);
        }
    }, [globalVar]);
    useEffect(() => {
        debouncedGetStudentData();
        if (storedUserId) {
            sessionStorage.clear();
        }
    }, []);


    const handleClockIn = async () => {
        const parametter = `?onlyview=GETCLOCKTIME`;
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(
                ClockAPI + parametter,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ PAGE_REQUEST: 'INSERT.CLOCK.IN.DATA' }),
                }
            );
            const data = await responseData.json();
            if (data.status == true) {
                setClockedIn(true);
                MySwal.fire({
                    title: 'Clock IN.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                });
            } else {
                MySwal.fire({
                    title: '! Something went wrong',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                });
            }
        } catch (err) {

        }
    };

    const handleClockOut = async () => {
        const parametter = `?onlyview=GETCLOCKTIME`;
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(
                ClockAPI + parametter,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ PAGE_REQUEST: 'UPDATE.CLOCK.OUT.DATA' }),
                }
            );
            const data = await responseData.json();
            if (data.status == true) {
                setClockedIn(false);
                MySwal.fire({
                    title: 'Clock OUT.',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                });
            } else {
                MySwal.fire({
                    title: '! Something went wrong',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                });
            }
        } catch (err) {

        }
    };
    return (
        <div className='text-lg flex gap-1 py-0 cursor-pointer'>
            <h1 className='font-semibold'>{ctime}</h1>

            {isStaff == 'staff' ? (
                clockedIn == false ? (
                    <span className='text-sm' onClick={handleClockIn}>
                        <PlayCircleOutlineIcon /> Clock In
                    </span>

                ) : (
                    <span className='text-sm' onClick={handleClockOut}>
                        <PlayCircleOutlineIcon /> Clock Out
                    </span>
                )
            ) : (
                ''
            )}


            {/* {clockedIn ? (
                <span className='text-sm' onClick={handleClockOut} ><PlayCircleOutlineIcon />Clock Out</span>
            ) : (
                <span className='text-sm' onClick={handleClockIn}><PlayCircleOutlineIcon />Clock In</span>
            )} */}
        </div>
    );
};

export default Clocked;

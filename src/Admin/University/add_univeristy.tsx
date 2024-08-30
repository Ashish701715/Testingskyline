import { useEffect, useState } from 'react';
import './style.css';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Empty } from 'antd';
import { Pagination, Select, SelectItem } from "@nextui-org/react";
// Collapse components
import UniversityAPi from '../../__PrivateApi/University';
import debounce from 'lodash.debounce';
import { NavLink } from 'react-router-dom';
import AddUniversity from './modal/AddNewUniversity';
import Blank from '../../components/Blanktow';
//Edit Section
import EditUniversity from './modal/EditUniveristy';
import { users } from '../../pages/Task/data';

export default function App() {
    // Collapse states
    const [laoder, setloader] = useState(true);
    const [search_input, setsearchuniveristy] = useState('');
    const [UniversityData, setUniversityData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);


    const debouncedFetchData = debounce(async (search_input, currentPage, itemsPerPage, totalPages) => {
        setloader(true)
        try {
            const response = await UniversityAPi(search_input, currentPage, itemsPerPage, totalPages);
            setUniversityData(response?.data || []);
            setTotalPages(Math.ceil(response?.total / itemsPerPage));
        } catch (error) {
            console.error(error);
        }
        setloader(false);
    }, 30);

    useEffect(() => {
        if (laoder === true) {
            debouncedFetchData(search_input, currentPage, itemsPerPage, totalPages);
        }
    }, [laoder]);
    const HanldeSearch = () => {
        debouncedFetchData(search_input, currentPage, itemsPerPage, totalPages);
    }

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
        debouncedFetchData(search_input, page, itemsPerPage, totalPages);
    }

    const handleItemsPerPageChange = (value: any) => {
        setItemsPerPage(parseInt(value.target.value));
        setCurrentPage(1);
        debouncedFetchData(search_input, currentPage, itemsPerPage, totalPages);
    }
    const [total, settotal] = useState(0);
    const globalVar = window.globalVariable;
    return (
        <>
            <div className={`grid grid-cols-6 gap-0`}>
                <div className="col-span-8 ml-2">
                    <div className="coll card-content">
                        <div className="navbar-fix">

                            <div className="d-flex">

                                <div className="ul-list m-2 after-line">

                                    <form>
                                        <div className="grid grid-cols-12 gap-2">

                                            <div className="col-span-4" />
                                            <div className="flex col-span-6 gap-2 design_search_form">
                                                <input type="text" className="search_input" placeholder="Search from over 80,000 + courses" aria-label="First name" onChange={(e: any) => { setsearchuniveristy(e.target.value) }} />
                                                <button className="Search_btn" type='button' onClick={HanldeSearch}>Search</button>
                                            </div>
                                            <div className="flex col-span-2 gap-2">
                                                <AddUniversity />
                                                <a className="cursor-pointer mt-2" onClick={() => (laoder ? setloader(false) : setloader(true))}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <hr className="border-b-0.5 border-gray-300"></hr>
                            </div>
                            {laoder ? (
                                <Blank number={5} />
                            ) : (
                                (UniversityData.length > 0) ?
                                    UniversityData.map((value: any, index) => (
                                        <div className="grid grid-cols-8 gap-4 course-list2" key={index}>
                                            <div className="col-span-1 design_clg_img">
                                                <img
                                                    src={value.UNIVERSITY_LOGO}
                                                    className="university_logo"
                                                    loading="lazy"
                                                    onError={(e: any) => {
                                                        e.target.src = 'https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div className="col-span-5 pt-3">
                                                <h4 className="design_h4 cursor-pointer">{value.UNIVERSITY_NAME}</h4>
                                                <p className="text-md font-500">{value.UNIVERSITY_ADDRESS}</p>
                                                <p className="text-md font-500 truncate">{value.UNIVERSITY_DESCRIPTION ? value.UNIVERSITY_DESCRIPTION : 'empty'}</p>
                                                <div className="grup_btn">
                                                    <NavLink to={value.UNIVERSITY_WEBSITE} className=" ml-2 font-blue-200">
                                                        {value.UNIVERSITY_WEBSITE}
                                                    </NavLink>
                                                </div>
                                            </div>
                                            <div className="col-span-2 flex">
                                                <NavLink to={`/${globalVar.ROLE}/university/course/${value.UNIVERSITY_ID}`} className="btn btn-University_c w-2/3">
                                                    View programs
                                                </NavLink>
                                                <EditUniversity>{value}</EditUniversity>
                                            </div>
                                        </div>
                                    )) : <Empty className='h-[350px] mt-10' />
                            )}
                        </div>
                        <div className='flex justify-between'>
                            <div>
                                <Select
                                    label="Items Per Page"
                                    className='w-[200px]'
                                    placeholder={itemsPerPage.toString()}
                                    onChange={handleItemsPerPageChange}
                                >
                                    <SelectItem key="20">20</SelectItem>
                                    <SelectItem key="50">50</SelectItem>
                                    <SelectItem key="100">100</SelectItem>
                                </Select>
                            </div>
                            <Pagination
                                showControls
                                total={totalPages}
                                initialPage={1}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>



            </div>
        </>
    );
}

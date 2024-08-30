import { useEffect, useState } from 'react';
import './style.css';
import UniversityAPi from '../../__PrivateApi/ProgramApi';
import debounce from 'lodash.debounce';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import AddProgram from './modal/AddNewProgram';
import Blank from '../../components/Blanktow';
import EditProgram from './modal/EditCourse';
import { Empty } from 'antd';
import { Pagination, Select, SelectItem } from "@nextui-org/react";
export default function App() {
    //get routes
    //get action and data check request is send univeristy_again = false &and universityId
    //get data from api

    const { universityId } = useParams();
    const location = useLocation();
    const Search = location.search;
    const [UniversityData, setUniversityData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [search_input, setsearchuniveristy] = useState('');
    const debouncedFetchData = debounce(async (Search, currentPage, itemsPerPage, totalPages) => {

        try {
            const response = await UniversityAPi(universityId, Search, currentPage, itemsPerPage, totalPages);
            setUniversityData(response?.data || []);
            setTotalPages(Math.ceil(response?.totalRecords / itemsPerPage))
        } catch (error) {
            console.error(error);
        }
        setLoader(false);
    }, 500);
    const [loader, setLoader] = useState(true);
    useEffect(() => {
        if (loader === true) {
            debouncedFetchData(search_input, currentPage, itemsPerPage, totalPages);
        }
    }, [loader]);

    const handlePageChange = (page: any) => {

        setCurrentPage(page);
        setLoader(true)
        // debouncedFetchData(Search, page, itemsPerPage, totalPages);
    }

    const handleItemsPerPageChange = (value: any) => {
        setItemsPerPage(parseInt(value.target.value));
        setCurrentPage(1);
        setLoader(true)
        // debouncedFetchData(Search, currentPage, value.target.value, totalPages);
    }

    const HanldeSearch = () => {
        setLoader(true)
        // debouncedFetchData(search_input, currentPage, itemsPerPage, totalPages);
    }

    const globalVar = window.globalVariable;
    return (
        <>
            <div className="grid grid-cols-6 gap-0">
                <div className="col-span-8 ml-2">
                    <div className="coll card-content">
                        <div className="navbar-fix">
                            <div className="d-flex">
                                <div className="ul-list m-2 after-line">
                                    <form>
                                        <div className="grid grid-cols-12 gap-2">
                                            <div className="col-span-4 pt-5">
                                                <h2 className="design_h2">{/* Total Program: <span>28141</span> */}</h2>
                                            </div>
                                            <div className="flex col-span-6 gap-2 design_search_form">
                                                <input type="text" className="search_input" placeholder="Search from over 80,000 + courses" aria-label="First name" onChange={(e: any) => { setsearchuniveristy(e.target.value) }} />
                                                <button className="Search_btn" type='button' onClick={HanldeSearch}>Search</button>
                                            </div>
                                            <div className="flex col-span-2 gap-2">
                                                <AddProgram />
                                                <a className="cursor-pointer mt-2" onClick={() => (loader ? setLoader(false) : setLoader(true))}>
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
                            {loader ? (
                                <Blank number={5} />
                            ) : UniversityData.length > 0 ? (
                                UniversityData.map((value: any, index) => (
                                    <div className="grid grid-cols-8 gap-4 course-list2" key={index}>
                                        <div className="design_clg_img pt-3">
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
                                            <h4 className="design_h4 cursor-pointer">
                                                {value.PROGRAM_NAME} {value.PROGRAM_LEVEL && ' - (' + value.PROGRAM_LEVEL + ' )'}
                                            </h4>
                                            <p className="text-md font-500">
                                                <b>univeristy Name : </b> {value.UNIVERSITY_NAME}
                                            </p>
                                            <p className="text-md font-500">
                                                <b>Address : </b> {value.PROGRAM_ADDRESS}
                                            </p>
                                            <p className="text-md font-500">
                                                <b>City : </b> {value.PROGRAM_CITY}
                                            </p>
                                            <p className="text-md font-500 truncate">
                                                <b>Campus Name : </b> {value.PROGRAM_CAMPUS}
                                            </p>
                                            <div className="grup_btn">
                                                <NavLink to={value.UNIVERSITY_WEBSITE} className=" ml-2 font-blue-200">
                                                    <b>Site url : </b> <span className=""> {value.UNIVERSITY_WEBSITE} </span>
                                                </NavLink>
                                            </div>
                                        </div>
                                        <div className="col-span-2 flex">
                                            <div>
                                                <NavLink to={`/${globalVar.ROLE}/university/program/view/${value.IDS}`} className="btn btn-University_c w-2/3">
                                                    View course
                                                </NavLink>
                                            </div>
                                            <div className='Edit-program-btn'>

                                                <EditProgram>{value}</EditProgram>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Empty className="h-[500px] mt-10 font-semibold text-md" description="Not data found" />
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

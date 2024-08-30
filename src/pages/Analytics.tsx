import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { useEffect } from 'react';
import { setPageTitle } from '../store/themeConfigSlice';
import IconHorizontalDots from '../components/Icon/IconHorizontalDots';
import IconTrendingUp from '../components/Icon/IconTrendingUp';
import IconPlus from '../components/Icon/IconPlus';
import IconCreditCard from '../components/Icon/IconCreditCard';
import IconMail from '../components/Icon/IconMail';
import IconChecks from '../components/Icon/IconChecks';
import IconFile from '../components/Icon/IconFile';
import IconServer from '../components/Icon/IconServer';
import IconChrome from '../components/Icon/IconChrome';
import IconSafari from '../components/Icon/IconSafari';
import IconGlobe from '../components/Icon/IconGlobe';
import IconUsersGroup from '../components/Icon/IconUsersGroup';
import IconLink from '../components/Icon/IconLink';
import IconChatDots from '../components/Icon/IconChatDots';
import IconThumbUp from '../components/Icon/IconThumbUp';
import IconCaretsDown from '../components/Icon/IconCaretsDown';
import IconSquareCheck from '../components/Icon/IconSquareCheck';
import IconClock from '../components/Icon/IconClock';
import IconEye from '../components/Icon/IconEye';
import IconBitcoin from '../components/Icon/IconBitcoin';
import IconEthereum from '../components/Icon/IconEthereum';
import IconLitecoin from '../components/Icon/IconLitecoin';
import IconBinance from '../components/Icon/IconBinance';
import IconTether from '../components/Icon/IconTether';
import IconSolana from '../components/Icon/IconSolana';
import IconCircleCheck from '../components/Icon/IconCircleCheck';
import IconInfoCircle from '../components/Icon/IconInfoCircle';
import IconDollarSign from '../components/Icon/IconDollarSign';
import IconInbox from '../components/Icon/IconInbox';
import IconTag from '../components/Icon/IconTag';
import IconShoppingCart from '../components/Icon/IconShoppingCart';
import IconArrowLeft from '../components/Icon/IconArrowLeft';
import IconCashBanknotes from '../components/Icon/IconCashBanknotes';
import IconUser from '../components/Icon/IconUser';
import IconNetflix from '../components/Icon/IconNetflix';
import IconBolt from '../components/Icon/IconBolt';
import IconCaretDown from '../components/Icon/IconCaretDown';
import IconMultipleForwardRight from '../components/Icon/IconMultipleForwardRight';

const Analytics = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Analytics Admin'));
    });

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // totalVisitOptions
    const totalVisit: any = {
        series: [{ data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25] }],
        options: {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#009688',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#009688'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // paidVisitOptions
    const paidVisit: any = {
        series: [{ data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69] }],
        options: {
            chart: {
                height: 58,
                type: 'line',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
                dropShadow: {
                    enabled: true,
                    blur: 3,
                    color: '#e2a03f',
                    opacity: 0.4,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e2a03f'],
            grid: {
                padding: {
                    top: 5,
                    bottom: 5,
                    left: 5,
                    right: 5,
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // uniqueVisitorSeriesOptions
    const uniqueVisitorSeries: any = {
        series: [
            {
                name: 'Rejected',
                data: [58, 44, 55, 57, 56, 61, 58, 63, 60, 66, 56, 63],
            },
            {
                name: 'Accepted',
                data: [91, 76, 85, 101, 98, 87, 105, 91, 114, 94, 66, 70],
            },
        ],
        options: {
            chart: {
                height: 360,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                width: 2,
                colors: ['transparent'],
            },
            colors: ['#0069EC', '#ffbb44'],
            dropShadow: {
                enabled: true,
                blur: 3,
                color: '#515365',
                opacity: 0.4,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 8,
                    borderRadiusApplication: 'end',
                },
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                itemMargin: {
                    horizontal: 8,
                    vertical: 8,
                },
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                padding: {
                    left: 20,
                    right: 20,
                },
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisBorder: {
                    show: true,
                    color: isDark ? '#3b3f5c' : '#e0e6ed',
                },
            },
            yaxis: {
                tickAmount: 6,
                opposite: isRtl ? true : false,
                labels: {
                    offsetX: isRtl ? -10 : 0,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: isDark ? 'dark' : 'light',
                    type: 'vertical',
                    shadeIntensity: 0.3,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
            },
        },
    };
    // followersOptions
    const followers: any = {
        series: [
            {
                data: [38, 60, 38, 52, 36, 40, 28],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#4361ee'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // referralOptions
    const referral: any = {
        series: [
            {
                data: [60, 28, 52, 38, 40, 36, 38],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#e7515a'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    // engagementOptions
    const engagement: any = {
        series: [
            {
                name: 'Sales',
                data: [28, 50, 36, 60, 38, 52, 38],
            },
        ],
        options: {
            chart: {
                height: 160,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: ['#1abc9c'],
            grid: {
                padding: {
                    top: 5,
                },
            },
            yaxis: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    title: {
                        formatter: () => {
                            return '';
                        },
                    },
                },
            },
        },
    };
    return (
        <div>
            
            
            <div className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
                    <div className="panel bg-gradient-to-r from-blue-700 to-blue-400">
                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Number of Agents</div>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:opacity-80"
                                    button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                                >
                                    <ul className="text-black dark:text-white-dark">
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 5,000 </div>
                            <div className="badge bg-white/30">+ 2.35% </div>
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week 400
                        </div>
                    </div>

                    {/* Sessions */}
                    <div className="panel bg-gradient-to-r from-red-600 to-red-400">
                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Number of Staff</div>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:opacity-80"
                                    button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                                >
                                    <ul className="text-black dark:text-white-dark">
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 4,137 </div>
                            <div className="badge bg-white/30">- 2.35% </div>
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week 809
                        </div>
                    </div>

                    {/*  Time On-Site */}
                    <div className="panel bg-gradient-to-r from-green-600 to-green-400">

                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Number of Client</div>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:opacity-80"
                                    button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                                >
                                    <ul className="text-black dark:text-white-dark">
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 18,085 </div>
                            <div className="badge bg-white/30">+ 1.35% </div>
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week 1,894
                        </div>
                    </div>

                    {/* Bounce Rate */}
                    <div className="panel bg-gradient-to-r from-yellow-500 to-yellow-300">
                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Rejection Rate</div>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:opacity-80"
                                    button={<IconHorizontalDots className="hover:opacity-80 opacity-70" />}
                                >
                                    <ul className="text-black dark:text-white-dark">
                                        <li>
                                            <button type="button">View Report</button>
                                        </li>
                                        <li>
                                            <button type="button">Edit Report</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> 19.10% </div>
                            <div className="badge bg-white/30">- 0.35% </div>
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week 10.01%
                        </div>
                    </div>
                </div>

                
               
            </div>
            
            <div className="pt-5">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full sm:col-span-2 lg:col-span-1">
                        {/* statistics */}
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Statistics</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">This Week</button>
                                        </li>
                                        <li>
                                            <button type="button">Last Week</button>
                                        </li>
                                        <li>
                                            <button type="button">This Month</button>
                                        </li>
                                        <li>
                                            <button type="button">Last Month</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-8 text-sm text-[#515365] font-bold">
                            <div>
                                <div>
                                    <div>Total Files</div>
                                    <div className="text-[#f8538d] text-lg">2553</div>
                                </div>

                                <ReactApexChart series={totalVisit.series} options={totalVisit.options} type="line" height={58} className="overflow-hidden" />
                            </div>

                            <div>
                                <div>
                                    <div>Accepted Files</div>
                                    <div className="text-[#f8538d] text-lg">1989</div>
                                </div>

                                <ReactApexChart series={paidVisit.series} options={paidVisit.options} type="line" height={58} className="overflow-hidden" />
                            </div>
                        </div>
                    </div>

                    <div className="panel h-full">
                        <div className="flex justify-between dark:text-white-light mb-5">
                            <h5 className="font-semibold text-lg ">Files Recieved</h5>

                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">This Week</button>
                                        </li>
                                        <li>
                                            <button type="button">Last Week</button>
                                        </li>
                                        <li>
                                            <button type="button">This Month</button>
                                        </li>
                                        <li>
                                            <button type="button">Last Month</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className=" text-[#e95f2b] text-3xl font-bold my-10">
                            <span> 500 </span>
                            <span className="text-black text-sm dark:text-white-light ltr:mr-2 rtl:ml-2">this week</span>
                            <IconTrendingUp className="text-success inline" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-full rounded-full h-5 p-1 bg-blue-500-light overflow-hidden shadow-3xl dark:shadow-none dark:bg-blue-500-light/10">
                                <div
                                    className="bg-gradient-to-r from-[#4361ee] to-[#805dca] w-full h-full rounded-full relative before:absolute before:inset-y-0 ltr:before:right-0.5 rtl:before:left-0.5 before:bg-white before:w-2 before:h-2 before:rounded-full before:m-auto"
                                    style={{ width: '65%' }}
                                ></div>
                            </div>
                            <span className="ltr:ml-5 rtl:mr-5 dark:text-white-light">57%</span>
                        </div>
                    </div>

                    <div
                        className="panel h-full overflow-hidden before:bg-[#1937cc] before:absolute before:-right-44 before:top-0 before:bottom-0 before:m-auto before:rounded-full before:w-96 before:h-96 grid grid-cols-1 content-between"
                        style={{ background: 'linear-gradient(0deg, rgb(39 78 157) -227%, rgb(37 61 141))' }}
                    >
                        <div className="flex items-start justify-between text-white-light mb-16 z-[7]">
                            <h5 className="font-semibold text-lg">Total PR's</h5>

                            <div className="relative text-xl whitespace-nowrap">
                                1992
                                <span className="table text-[#d3d3d3] bg-[#4361ee] rounded p-1 text-xs mt-1 ltr:ml-auto rtl:mr-auto">+100</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between z-10">
                            <div className="flex items-center justify-between">
                                <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#1937cc] place-content-center ltr:mr-2 rtl:ml-2">
                                    <IconPlus />
                                </button>
                                <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#1937cc] grid place-content-center">
                                    <IconCreditCard />
                                </button>
                            </div>
                            <button type="button" className="shadow-[0_0_2px_0_#bfc9d4] rounded p-1 text-white-light hover:bg-[#4361ee] z-10">
                                Upgrade
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* <div className="panel h-full p-0 lg:col-span-2"> */}
                        {/* <div className="flex items-start justify-between dark:text-white-light mb-5 p-5 border-b  border-white-light dark:border-[#1b2e4b]"> */}
                            {/* <h5 className="font-semibold text-lg ">Files</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View</button>
                                        </li>
                                        <li>
                                            <button type="button">Update</button>
                                        </li>
                                        <li>
                                            <button type="button">Delete</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div> */}
                        {/* </div> */}

                        {/* <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} className="overflow-hidden" /> */}
                    {/* </div> */}
                    <div className="panel h-full w-full col-span-2">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Recent Payments</h5>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Agent</th>
                                        <th>Country</th>
                                        <th>Invoice</th>
                                        <th>Commision</th>
                                        <th className="ltr:rounded-r-md rtl:rounded-l-md">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="min-w-[150px] text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-6.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Luke Ivory</span>
                                            </div>
                                        </td>
                                        <td className="text-primary">Canada</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#46894</Link>
                                        </td>
                                        <td>$56.07</td>
                                        <td>
                                            <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-7.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Andy King</span>
                                            </div>
                                        </td>
                                        <td className="text-info">America</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#76894</Link>
                                        </td>
                                        <td>$126.04</td>
                                        <td>
                                            <span className="badge bg-blue-500 shadow-md dark:group-hover:bg-transparent">Shipped</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-8.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Laurie Fox</span>
                                            </div>
                                        </td>
                                        <td className="text-warning">South Africa</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#66894</Link>
                                        </td>
                                        <td>$56.07</td>
                                        <td>
                                            <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-9.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Ryan Collins</span>
                                            </div>
                                        </td>
                                        <td className="text-danger">Canada</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#75844</Link>
                                        </td>
                                        <td>$110.00</td>
                                        <td>
                                            <span className="badge bg-blue-500 shadow-md dark:group-hover:bg-transparent">Shipped</span>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex items-center">
                                                <img className="w-8 h-8 rounded-md ltr:mr-3 rtl:ml-3 object-cover" src="/assets/images/profile-10.jpeg" alt="avatar" />
                                                <span className="whitespace-nowrap">Irene Collins</span>
                                            </div>
                                        </td>
                                        <td className="text-secondary">India</td>
                                        <td>
                                            <Link to="/apps/invoice/preview">#46894</Link>
                                        </td>
                                        <td>$56.07</td>
                                        <td>
                                            <span className="badge bg-success shadow-md dark:group-hover:bg-transparent">Paid</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className="flex items-start justify-between dark:text-white-light mb-5 -mx-5 p-5 pt-0 border-b  border-white-light dark:border-[#1b2e4b]">
                            <h5 className="font-semibold text-lg ">Activity Log</h5>
                            <div className="dropdown">
                                <Dropdown
                                    offset={[0, 5]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="hover:text-primary"
                                    button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                >
                                    <ul>
                                        <li>
                                            <button type="button">View All</button>
                                        </li>
                                        <li>
                                            <button type="button">Mark as Read</button>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <PerfectScrollbar className="perfect-scrollbar relative h-[360px] ltr:pr-3 rtl:pl-3 ltr:-mr-3 rtl:-ml-3">
                            <div className="space-y-7">
                                <div className="flex">
                                    <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                        <div className="bg-blue-500 shadow shadow-secondary w-8 h-8 rounded-full flex items-center justify-center text-white">
                                            <IconPlus className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold dark:text-white-light">
                                            New file created :{' '}
                                            <button type="button" className="text-success">
                                                [Skyline]
                                            </button>
                                        </h5>
                                        <p className="text-white-dark text-xs">27 Feb, 2024</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                        <div className="bg-success shadow-success w-8 h-8 rounded-full flex items-center justify-center text-white">
                                            <IconMail className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold dark:text-white-light">
                                            Mail sent to{' '}
                                            <button type="button" className="text-white-dark">
                                                HR
                                            </button>{' '}
                                            and{' '}
                                            <button type="button" className="text-white-dark">
                                                Admin
                                            </button>
                                        </h5>
                                        <p className="text-white-dark text-xs">28 Feb, 2024</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                        <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
                                            <IconChecks className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold dark:text-white-light">Server Logs Updated</h5>
                                        <p className="text-white-dark text-xs">27 Feb, 2024</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                        <div className="bg-danger w-8 h-8 rounded-full flex items-center justify-center text-white">
                                            <IconChecks className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold dark:text-white-light">
                                            Task Completed :
                                            <button type="button" className="text-success ml-1">
                                                [Backup Files EOD]
                                            </button>
                                        </h5>
                                        <p className="text-white-dark text-xs">01 Mar, 2024</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="shrink-0 ltr:mr-2 rtl:ml-2 relative z-10 before:w-[2px] before:h-[calc(100%-24px)] before:bg-white-dark/30 before:absolute before:top-10 before:left-4">
                                        <div className="bg-warning w-8 h-8 rounded-full flex items-center justify-center text-white">
                                            <IconFile className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold dark:text-white-light">
                                            Documents Submitted from <button type="button">Sara</button>
                                        </h5>
                                        <p className="text-white-dark text-xs">10 Mar, 2024</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="ltr:mr-2 rtl:ml-2">
                                        <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
                                            <IconServer className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="font-semibold dark:text-white-light">Server rebooted successfully</h5>
                                        <p className="text-white-dark text-xs">06 Apr, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </PerfectScrollbar>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                    <div className="panel h-full w-full col-span-2">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Top PR Countries</h5>
                        </div>
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr className="border-b-0">
                                        <th className="ltr:rounded-l-md rtl:rounded-r-md">Countries</th>
                                        <th>Commision</th>
                                        <th>Discount</th>
                                        <th>Students</th>
                                        <th className="ltr:rounded-r-md rtl:rounded-l-md">Source</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="min-w-[150px] text-black dark:text-white">
                                            <div className="flex">
                                               
                                                <p className="whitespace-nowrap">
                                                    India
                                                    <span className="text-primary block text-xs"></span>
                                                </p>
                                            </div>
                                        </td>
                                        <td>$168.09</td>
                                        <td>$60.09</td>
                                        <td>170</td>
                                        <td>
                                            <Link className="text-danger flex items-center" to="/">
                                                <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                Direct
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex">
                                                <p className="whitespace-nowrap">
                                                    Canada <span className="text-warning block text-xs"></span>
                                                </p>
                                            </div>
                                        </td>
                                        <td>$126.04</td>
                                        <td>$47.09</td>
                                        <td>130</td>
                                        <td>
                                            <Link className="text-success flex items-center" to="/">
                                                <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                Google
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex">
                                                <p className="whitespace-nowrap">
                                                    Australia <span className="text-danger block text-xs"></span>
                                                </p>
                                            </div>
                                        </td>
                                        <td>$56.07</td>
                                        <td>$20.00</td>
                                        <td>66</td>
                                        <td>
                                            <Link className="text-warning flex items-center" to="/">
                                                <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                Ads
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex">
                                                <p className="whitespace-nowrap">
                                                    America <span className="text-primary block text-xs"></span>
                                                </p>
                                            </div>
                                        </td>
                                        <td>$110.00</td>
                                        <td>$33.00</td>
                                        <td>35</td>
                                        <td>
                                            <Link className="text-secondary flex items-center" to="/">
                                                <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                Email
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex">
                                                <p className="whitespace-nowrap">
                                                    South Africa <span className="text-primary block text-xs"></span>
                                                </p>
                                            </div>
                                        </td>
                                        <td>$56.07</td>
                                        <td>$26.04</td>
                                        <td>30</td>
                                        <td>
                                            <Link className="text-primary flex items-center" to="/">
                                                <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                Referral
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="text-white-dark hover:text-black dark:hover:text-white-light/90 group">
                                        <td className="text-black dark:text-white">
                                            <div className="flex">
                                                <p className="whitespace-nowrap">
                                                    singapore<span className="text-primary block text-xs"></span>
                                                </p>
                                            </div>
                                        </td>
                                        <td>$60.07</td>
                                        <td>$30.04</td>
                                        <td>10</td>
                                        <td>
                                            <Link className="text-primary flex items-center" to="/">
                                                <IconMultipleForwardRight className="rtl:rotate-180 ltr:mr-1 rtl:ml-1" />
                                                Referral
                                            </Link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="panel h-full">
                        <div className="flex items-start border-b  border-white-light dark:border-[#1b2e4b] -m-5 mb-5 p-5">
                            <div className="shrink-0 ring-2 ring-white-light dark:ring-dark rounded-full ltr:mr-4 rtl:ml-4">
                                <img src="/assets/images/profile-1.jpeg" alt="profile1" className="w-10 h-10 rounded-full object-cover" />
                            </div>
                            <div className="font-semibold">
                                <h6>Jimmy Turner</h6>
                                <p className="text-xs text-white-dark mt-1">Monday, Nov 18</p>
                            </div>
                        </div>
                        <div>
                            <div className="text-white-dark pb-8">
                                "Duis aute irure dolor" in reprehenderit in voluptate velit esse cillum "dolore eu fugiat" nulla pariatur. Excepteur sint occaecat cupidatat non proident.
                            </div>
                            <div className="w-full absolute bottom-0 flex items-center justify-between p-5 -mx-5">
                                <div className="flex items-center">
                                    <IconThumbUp className="w-5 h-5 text-info inline ltr:mr-1.5 rtl:ml-1.5 relative -top-0.5" />
                                    <span className="dark:text-info">551 Likes</span>
                                </div>
                                <button type="button" className="flex items-center bg-success/30 text-success rounded-md px-1.5 py-1 text-xs hover:shadow-[0_10px_20px_-10px] hover:shadow-success">
                                    Read More
                                    <IconCaretsDown className="w-4 h-4 rtl:rotate-90 -rotate-90 ltr:ml-1.5 rtl:mr-1.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Analytics;

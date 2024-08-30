import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconEye from '../../components/Icon/IconEye';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import Token from '../../getLoggedUser/GetUserInfomation';
import { v1Dashboard } from '../../APIurl/url';
import { debounce } from 'lodash';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spinner } from "@nextui-org/react";
const Analytics = () => {

    const [isOpen, setIsOpen] = useState(true); // Modal will open by default

    const closeModal = () => setIsOpen(false);


    const JwtToken = Token('jwt');
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Analytics Admin'));
    });
    const [loading] = useState(false);
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [AgentData, SetAgentData]: any = useState();
    const [Chartdata, Setchartdata]: any = useState();
    const [Announcement, SetAnnouncement]: any = useState([]);
    const [loader, Setloader]: any = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const Client = async () => {
            try {
                const responseData: any = await fetch(v1Dashboard + '?action=view.client.record', {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${JwtToken}`,
                        'x-token-access': 'true',
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'STAFFDATA_DASHBOARD.GET',
                        RequesterUser: 'staff',
                    }),
                });
                const data = await responseData.json();
                SetAgentData(await data.data[0])

            } catch (err) {
                console.error(err);

            }
        }

        const Chartback = async () => {
            try {
                const responseData: any = await fetch(v1Dashboard + '?action=view.client.record', {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${JwtToken}`,
                        'x-token-access': 'true',
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'STAFFDATA_DASHBOARD_CHART.GET',
                        RequesterUser: 'Staff',
                    }),
                });
                const data = await responseData.json();
                Setchartdata(await data.data)

            } catch (err) {
                console.error(err);

            }
        }
        Client();
        Chartback();

    }, []);

    const GETSTAFFAnnouncement = async () => {
        Setloader(true);
        try {
            const responseData: any = await fetch(
                `${v1Dashboard}?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}&sortField=id&sortOrder=desc`,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${JwtToken}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'GET.ANNOUNCEMENT.DATA',
                    }),
                }
            );
            const data = await responseData.json();
            SetAnnouncement(data.data);
            Setloader(false);
        } catch (err) {
            console.error(err);
            Setloader(false);
        }
    };


    const debouncedGetStaff = debounce(GETSTAFFAnnouncement, 300);

    useEffect(() => {
        debouncedGetStaff();
    }, []);
    const loadingState = loader ? "loading" : "idle";
    //Revenue Chart
    const revenueChart: any = {
        series: [
            {
                name: 'Accepted',
                data: Chartdata?.InHand || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: 'Rejected',
                data: Chartdata?.OnHold || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },
            {
                name: 'Completed',
                data: Chartdata?.OnHold || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            },

        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },

            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196F3', '#E7515A', '#2486c8'] : ['#2daa0f', '#E7515A', '#2486c8'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1B55E2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#E7515A',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                tickAmount: 7,
                labels: {
                    formatter: (value: number) => {
                        return value;
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191E3A' : '#E0E6ED',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
        },
    };

    return (
        <div>


            <div className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 text-white">
                    <div className="panel " style={{ background: 'linear-gradient(0deg, #006ed9 -227%, #006ed9)' }}>
                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Total Application</div>
                            <div className="dropdown">

                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{AgentData?.Total_Apllication || 0}</div>
                            {/* <div className="badge bg-white/30">+ 2.35% </div> */}
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week {AgentData?.Total_Apllication_last_week || 0}
                        </div>
                    </div>

                    {/* Sessions */}
                    <div className="panel " style={{ background: 'linear-gradient(0deg, #006ed9 -227%, #006ed9)' }}>
                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Applications Complete</div>
                            <div className="dropdown">
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3">{AgentData?.Total_Apllication_Complete || 0} </div>
                            {/* <div className="badge bg-white/30">- 2.35% </div> */}
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week {AgentData?.Total_Apllication_compelete_last_week || 0}
                        </div>
                    </div>

                    {/*  Time On-Site */}
                    <div className="panel " style={{ background: 'linear-gradient(0deg, #006ed9 -227%, #006ed9)' }}>

                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Application Accepted</div>
                            <div className="dropdown">

                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {AgentData?.Total_Apllication_Accepted || 0} </div>
                            {/* <div className="badge bg-white/30">+ 1.35% </div> */}
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week {AgentData?.Total_Apllication_Accepted_last_week || 0}
                        </div>
                    </div>

                    {/* Bounce Rate */}
                    <div className="panel " style={{ background: 'linear-gradient(0deg, #006ed9 -227%, #006ed9)' }}>
                        <div className="flex justify-between">
                            <div className="ltr:mr-1 rtl:ml-1 text-md font-semibold">Rejected</div>
                            <div className="dropdown">
                            </div>
                        </div>
                        <div className="flex items-center mt-5">
                            <div className="text-3xl font-bold ltr:mr-3 rtl:ml-3"> {AgentData?.Total_Apllication_Rejected || 0} </div>
                            {/* <div className="badge bg-white/30">- 0.35% </div> */}
                        </div>
                        <div className="flex items-center font-semibold mt-5">
                            <IconEye className="ltr:mr-2 rtl:ml-2 shrink-0" />
                            Last Week {AgentData?.Total_Apllication_Rejected_last_week || 0}
                        </div>
                    </div>


                </div>



            </div>

            <div className="pt-5">
                <div className="grid ">
                    <div className="grid  gap-6 mb-6">
                        <div className="panel h-full ">
                            <div className="flex items-center justify-between dark:text-white-light mb-5">
                                <h5 className="font-semibold text-lg">Accepted and Rejected</h5>
                                <div className="dropdown">
                                    {/* <Dropdown
                                        offset={[0, 1]}
                                        placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        button={<IconHorizontalDots className="text-black/70 dark:text-white/70 hover:!text-primary" />}
                                    >
                                        <ul>
                                            <li>
                                                <button type="button">Weekly</button>
                                            </li>
                                            <li>
                                                <button type="button">Monthly</button>
                                            </li>
                                            <li>
                                                <button type="button">Yearly</button>
                                            </li>
                                        </ul>
                                    </Dropdown> */}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                    {loading ? (
                                        <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                            <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                        </div>
                                    ) : (
                                        <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">

                </div>
                {Announcement.length > 0 ? (
                    <Modal isOpen={isOpen} onOpenChange={(visible) => setIsOpen(visible)} size='5xl'
                        scrollBehavior={'inside'}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Announcement </ModalHeader>
                                    <ModalBody>
                                        <Table aria-label="Example empty table">
                                            <TableHeader>
                                                <TableColumn>#</TableColumn>
                                                <TableColumn style={{ textAlign: 'left' }}>Announcement</TableColumn>

                                            </TableHeader>
                                            <TableBody emptyContent={"No rows to display."}
                                                loadingContent={<Spinner />}
                                                loadingState={loadingState}
                                            >
                                                {
                                                    Announcement.map((staff: any, index: any) => (
                                                        <TableRow key={staff.ID}>
                                                            <TableCell>{index + 1}.</TableCell>
                                                            <TableCell style={{ textAlign: 'left' }}>
                                                                <div><b>{staff.TITLE}</b></div>
                                                                <br />
                                                                <div dangerouslySetInnerHTML={{ __html: staff.DETAILS }} />
                                                            </TableCell>

                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" className='btn-primary'>
                                            <NavLink to={`/staff/viewAnnouncement`}>
                                                View All
                                            </NavLink>
                                        </Button>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>


                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                ) : (
                    ''
                )}


            </div>
        </div>
    );
};

export default Analytics;

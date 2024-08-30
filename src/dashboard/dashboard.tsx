import React, { useEffect, useState } from "react";
import {
  Link, Card, CardBody, Breadcrumbs,
  BreadcrumbItem, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown as Dropdowns
} from "@nextui-org/react";

import './dashboard.css'
import ReactApexChart from 'react-apexcharts';
import CustomIcon1 from '../components/Icon/CustomIcon1';
import CustomIcon2 from '../components/Icon/CustomIcon2';
import CustomIcon3 from '../components/Icon/CustomIcon3';
import CustomIcon4 from '../components/Icon/CustomIcon4';
import CustomIcon5 from '../components/Icon/CustomIcon5';

import Header from './Header';
import Sidebar from './Sidebar';
import Token from '../getLoggedUser/GetUserInfomation';
import { v1Dashboard } from '../APIurl/url';
import { debounce } from 'lodash';
import { format } from 'date-fns';
export default function App() {
  const globalVar = window.globalVariable;
  const JwtToken = Token('jwt');
  const [AdminCountry, Setadmincountry]: any = useState();
  const [AgentData, SetAgentData]: any = useState();
  const [AllCommission, SetallCommission]: any = useState([]);
  const [AllCountrys, Setallcountry]: any = useState([]);
  const [AllSTAFFS, Setallstaff]: any = useState([]);
  const [HISTORYCHART, Sethistorychart]: any = useState();
  const [PerformanceCHART, SetPerformancechart]: any = useState();

  const [HistoryuserID, SetHistoryuser]: any = useState();
  const [HistoryYear, SetHistoryYear]: any = useState();
  const [HistoryCountry, SetHistorycountry]: any = useState();

  const [PerformanceuserID, SetPerformanceuser]: any = useState();
  const [PerformanceYear, SetPerformanceYear]: any = useState();
  const [PerformanceCountry, SetPerformancecountry]: any = useState();


  const Defultcountry = (value: any) => {
    Setadmincountry(value);
    SetHistorycountry(value);
    SetPerformancecountry(value);
  }


  const [loading] = useState(false);


  const Allcountry = async () => {
    try {
      const responseData: any = await fetch(v1Dashboard, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
          'x-token-access': 'true',
        },
        body: JSON.stringify({
          PAGE_REQUEST: 'ADMIN.GETALLCOUNTRY',
          RequesterUser: 'Admin',
        }),
      });
      const data = await responseData.json();
      Setallcountry(data.data)

      // console.log(data.data.length)

    } catch (err) {
      console.error(err);

    }
  }

  const AllStaff = async () => {
    try {
      const responseData: any = await fetch(v1Dashboard, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
          'x-token-access': 'true',
        },
        body: JSON.stringify({
          PAGE_REQUEST: 'ADMIN.GETALLSTAFF',
          RequesterUser: 'Admin',
          AdminCountry: AdminCountry,
        }),
      });
      const data = await responseData.json();
      Setallstaff(data.data)


    } catch (err) {
      console.error(err);

    }
  }

  const Topbar = async () => {
    try {
      const responseData: any = await fetch(v1Dashboard, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
          'x-token-access': 'true',
        },
        body: JSON.stringify({
          PAGE_REQUEST: 'Admin.DASHBOARD.TOPBAR.',
          RequesterUser: 'Admin',
          AdminCountry: AdminCountry,
        }),
      });
      const data = await responseData.json();
      SetAgentData(await data)

    } catch (err) {
      console.error(err);

    }
  }



  const debouncedgettopbar = debounce(Topbar, 300);

  const DebounceAllcountry = debounce(Allcountry, 300);
  const DebounceAllstaff = debounce(AllStaff, 300);



  useEffect(() => {
    DebounceAllcountry();
    DebounceAllstaff();
    debouncedgettopbar();
  }, [AdminCountry]);


  const Historychart = async () => {
    try {
      const responseData: any = await fetch(v1Dashboard, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
          'x-token-access': 'true',
        },
        body: JSON.stringify({
          PAGE_REQUEST: 'ADMIN.DASHBOARD.HISTORYCHART',
          RequesterUser: 'ADMIN',
          Historyuser: HistoryuserID,
          HistoryYear: HistoryYear,
          HistoryCountry: HistoryCountry,
        }),
      });
      const data = await responseData.json();
      Sethistorychart(await data.data[0])

    } catch (err) {
      console.error(err);

    }
  }
  const debouncedhistorychart = debounce(Historychart, 300);

  useEffect(() => {
    debouncedhistorychart();
  }, [HistoryuserID, HistoryYear, HistoryCountry]);


  const Performancechart = async () => {
    try {
      const responseData: any = await fetch(v1Dashboard, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
          'x-token-access': 'true',
        },
        body: JSON.stringify({
          PAGE_REQUEST: 'ADMIN.DASHBOARD.PerformanceCHART',
          RequesterUser: 'ADMIN',
          PerformanceCountry: PerformanceCountry,
          PerformanceYear: PerformanceYear,
          Performanceuser: PerformanceuserID
        }),
      });
      const data = await responseData.json();
      SetPerformancechart(await data)

    } catch (err) {
      console.error(err);

    }
  }
  const debouncedPerformancechart = debounce(Performancechart, 300);

  useEffect(() => {
    debouncedPerformancechart();
  }, [PerformanceCountry, PerformanceYear, PerformanceuserID]);



  //Payment & Commission data show

  const Commission = async () => {
    try {
      const responseData: any = await fetch(v1Dashboard, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
          'x-token-access': 'true',
        },
        body: JSON.stringify({
          PAGE_REQUEST: 'ADMIN.DASHBOARD.Commission',
          RequesterUser: 'ADMIN',
        }),
      });
      const data = await responseData.json();
      SetallCommission(await data.data)

    } catch (err) {
      console.error(err);

    }
  }
  const debouncedCommission = debounce(Commission, 300);

  useEffect(() => {
    debouncedCommission();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);


  const salesByCategory: any = {
    series: [985, 737, 270],
    options: {
      chart: {
        type: 'donut',
        height: 260,
        fontFamily: 'Sora',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 20,
        colors: '#fff',
      },
      colors: ['#00CD69', '#0975DE', '#FF5C24'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 20,
        offsetY: 0,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '20px',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '20px',
                color: undefined,
                offsetY: 16,
                formatter: (val: any) => {
                  return val;
                },
              },
              total: {
                show: true,
                label: 'Total',
                color: '#888ea8',
                fontSize: '20px',
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      labels: ['Apparel', 'Sports', 'Others'],
      states: {
        hover: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
      },
    },
  };
  const uniqueVisitorSeries: any = {
    series: [
      {
        name: 'No. of Application Rejected',
        data: [HISTORYCHART?.TOTAL_Rejected],
      },
      {
        name: 'No. of Application Accepted',
        data: [HISTORYCHART?.TOTAL_Accepted],
      },
      {
        name: 'No. of Application Completed',
        data: [HISTORYCHART?.TOTAL_Complete],
      },

    ],
    options: {
      chart: {
        height: 360,
        type: 'bar',
        fontFamily: 'Sora',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 20,
        colors: ['transparent'],
      },
      colors: ['#FF5C24', '#0975DE', '#00CD69'],
      dropShadow: {
        enabled: true,
        color: '#515365',
        opacity: 2,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 0,
          borderRadiusApplication: 'end',
        },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        itemMargin: {
          horizontal: 3,
          vertical: 3,
        },
      },
      grid: {
        borderColor: '#e0e6ed',
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
        categories: ['All Staff'],
        axisBorder: {
          show: true,
          color: '#e0e6ed',
        },
      },
      yaxis: {
        tickAmount: 6,
        opposite: false,
        labels: {
          offsetX: 0,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.3,
          inverseColors: false,
          opacityFrom: 100,
          opacityTo: 100,
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
  const revenueChart: any = {
    series: [
      {
        name: 'All Staff',
        data: PerformanceCHART ? PerformanceCHART : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        height: 200,
        type: 'area',
        fontFamily: 'sora',
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
      colors: ['#1B55E2'],
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
          offsetX: 0,
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
            return Math.trunc(value);
          },
          offsetX: -10,
          offsetY: 0,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-title',
          },
        },
        opposite: false,
      },
      grid: {
        borderColor: '#E0E6ED',
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
          opacityFrom: 0.28,
          opacityTo: 0.05,
          stops: [45, 100],
        },
      },
    },
  };
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'fixed',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
  };
  return (
    <div className="dashboard_page_bg">
      <Header />

      <div className="dashboard_inner_page">

        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="flex flex-col flex-wrap gap-4">
              <h1 className="text-2xl font-bold mb-4 lg:mb-0">Welcome {globalVar?.ClientName ? globalVar?.ClientName : '-----'} !</h1>
              <Breadcrumbs >
                <BreadcrumbItem>Home</BreadcrumbItem>
                <BreadcrumbItem color="primary" >Dashboard </BreadcrumbItem>
              </Breadcrumbs>
            </div>
            <Select

              placeholder="All Countries "
              className="All_Countries w-[200px]"
              onChange={(e) => Defultcountry(e.target.value)}
            >
              {AllCountrys.length > 0 ? (
                AllCountrys.map((Country: any, i: any) => (
                  <SelectItem key={Country.ID}>
                    {Country.COUNTRY_NAME}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key={'Empty'}>
                  Empty Country
                </SelectItem>

              )}

            </Select>
            {/* <Button className="All_Countries">All Countries <IconCaretDown /></Button> */}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardBody className="flex flex-col items-center justify-center p-4">
                <CustomIcon1 />
                <div className="total_number">Total Students: <span className="">{AgentData?.Total_Student || 0}</span></div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col items-center justify-center p-4">
                <CustomIcon2 />
                <div className="total_number">Total Applications: <span className="">{AgentData?.Total_Application || 0}</span></div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col items-center justify-center p-4">
                <CustomIcon3 />
                <div className="total_number">Total Staff: <span className="">{AgentData?.Total_Staff || 0}</span></div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col items-center justify-center p-4">
                <CustomIcon4 />
                <div className="total_number">Total Agent: <span className="">{AgentData?.Total_Agent || 0}</span></div>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="flex flex-col items-center justify-center p-4">
                <CustomIcon5 />
                <div className="total_number">Total Universities: <span className="">{AgentData?.Total_Universities || 0}</span></div>
              </CardBody>
            </Card>
          </div>

          {/* Announcements and Leave Requests */}
          <div className="grid grid-cols-3 lg:grid-cols-3 gap-8">
            <Card className="col-span-2">
              <CardBody className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="graph_heading">Announcements</h3>
                  <Link href="#" className="text-blue-500 text-sm">View All</Link>
                </div>
                <ul className="space-y-2">
                  {AgentData?.Announcements.length > 0 ? (
                    AgentData.Announcements.map((Announcement: any, i: any) => (
                      <li key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm">
                        <span className="mb-1 sm:mb-0">New business announcement email</span>
                        <div className="flex items-center space-x-2">
                          <Link href="#" className="text-blue-500">View Announcement</Link>
                          <span className="text-gray-400">13/08/2024</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="flex justify-center items-center">No Announcement Data</li>
                  )}
                </ul>
              </CardBody>
            </Card>
            <Card className="col-span-1">
              <CardBody className="p-4">
                <h3 className="graph_heading">Leave Requests</h3>
                <ReactApexChart className="set_graph" series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
              </CardBody>
            </Card>
          </div>
          <div className="mt-3 grid grid-cols-2 lg:grid-cols-2 gap-8">

            <Card className="col-span-2">
              <CardBody className="p-4">
                <div className="grid grid-cols-9 gap-4">
                  <div className="col-span-6">
                    <h3 className="graph_heading">History</h3>
                    <p className="set_par_text">This is a dummy text placeholder</p>
                  </div>
                  <div className="col-span-1">
                    <Select
                      placeholder="All Staff"
                      className="bg-default"
                      onChange={(e) => SetHistoryuser(e.target.value)}
                    >
                      {AllSTAFFS.length > 0 ? (
                        AllSTAFFS.map((Staff: any, i: any) => (
                          <SelectItem key={Staff.AUTH_ID}>
                            {Staff.CLIENT_NAME}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key={'Empty'}>
                          Empty staff
                        </SelectItem>

                      )}
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Select
                      placeholder="2024"
                      className="bg-default"
                      onChange={(e) => SetHistoryYear(e.target.value)}
                    >
                      <SelectItem key={'2024'}>
                        2024
                      </SelectItem>
                      <SelectItem key={'2023'}>
                        2023
                      </SelectItem>
                      <SelectItem key={'2022'}>
                        2022
                      </SelectItem>
                      <SelectItem key={'2021'}>
                        2021
                      </SelectItem>
                      <SelectItem key={'2020'}>
                        2020
                      </SelectItem>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Select
                      placeholder="All Countries "
                      className="bg-default"
                      onChange={(e) => SetHistorycountry(e.target.value)}
                    >
                      {AllCountrys.length > 0 ? (
                        AllCountrys.map((Country: any, i: any) => (
                          <SelectItem key={Country.ID}>
                            {Country.COUNTRY_NAME}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key={'Empty'}>
                          Empty Country
                        </SelectItem>

                      )}

                    </Select>
                  </div>
                </div>
                <ReactApexChart options={uniqueVisitorSeries.options} series={uniqueVisitorSeries.series} type="bar" height={360} className="overflow-hidden" />
              </CardBody>
            </Card>
          </div>
          <div className="mt-3 grid grid-cols-2 lg:grid-cols-2 gap-8">

            <Card className="col-span-2">
              <CardBody className="p-4">
                <div className="grid grid-cols-9 gap-4">
                  <div className="col-span-6">
                    <h3 className="graph_heading">Performance</h3>
                    <p className="set_par_text">This is a dummy text placeholder</p>
                  </div>
                  <div className="col-span-1">
                    <Select
                      placeholder="All Staff"
                      className="bg-default"
                      onChange={(e) => SetPerformanceuser(e.target.value)}
                    >
                      {AllSTAFFS.length > 0 ? (
                        AllSTAFFS.map((Staff: any, i: any) => (
                          <SelectItem key={Staff.AUTH_ID}>
                            {Staff.CLIENT_NAME}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key={'Empty'}>
                          Empty staff
                        </SelectItem>

                      )}
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Select
                      placeholder="2024"
                      className="bg-default"
                      onChange={(e) => SetPerformanceYear(e.target.value)}
                    >
                      <SelectItem key={'2021'}>
                        2021
                      </SelectItem>
                      <SelectItem key={'2022'}>
                        2022
                      </SelectItem>
                      <SelectItem key={'2023'}>
                        2023
                      </SelectItem>
                      <SelectItem key={'2024'}>
                        2024
                      </SelectItem>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Select
                      placeholder="All Countries "
                      className="bg-default"
                      onChange={(e) => SetPerformancecountry(e.target.value)}
                    >
                      {AllCountrys.length > 0 ? (
                        AllCountrys.map((Country: any, i: any) => (
                          <SelectItem key={Country.ID}>
                            {Country.COUNTRY_NAME}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key={'Empty'}>
                          Empty Country
                        </SelectItem>

                      )}

                    </Select>
                  </div>
                </div>
                <ReactApexChart series={revenueChart.series} options={revenueChart.options} type="area" height={325} />
              </CardBody>
            </Card>
          </div>
          <div className="mt-3 grid grid-cols-2 lg:grid-cols-2 gap-8">
            <Card className="col-span-2">
              <CardBody className="p-4">
                <h3 className="graph_heading">Payment & Commission Request</h3>
                <Table
                  selectionMode="single"
                  aria-label="Example static collection table"
                >
                  <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>Agent Details</TableColumn>
                    <TableColumn>Client Name</TableColumn>
                    <TableColumn>Application Country</TableColumn>
                    <TableColumn>Application Services</TableColumn>
                    <TableColumn>Commission Price</TableColumn>
                    <TableColumn>Status</TableColumn>
                  </TableHeader>
                  <TableBody>

                    {AllCommission.map((Commissiondata: any, i: any) => (
                      <TableRow key={i + 1}>
                        <TableCell data-label="#">{i + 1}</TableCell>
                        <TableCell data-label="Agent Details">
                          {Commissiondata.AGNET_NAME}

                        </TableCell>
                        <TableCell data-label="Client Name">{Commissiondata.FIRST_NAME} {Commissiondata.LAST_NAME}</TableCell>
                        <TableCell data-label="Application Country">
                          {
                            (() => {
                              const countryList = JSON.parse(Commissiondata.ApplicationCountry);
                              const uniqueCountryNames = Array.from(new Set(countryList.map((value: any) => value.SERVICE_COUNTRY_NAME))).join(', ');
                              return uniqueCountryNames;
                            })()
                          }
                        </TableCell>

                        <TableCell data-label="Application Services">
                          {
                            (() => {
                              const Services = JSON.parse(Commissiondata.ClientServicess);
                              const uniqueCountryNames = Array.from(new Set(Services.map((value: any) => value.SERVICE_NAME))).join(', ');
                              return uniqueCountryNames;
                            })()
                          }

                        </TableCell>
                        <TableCell data-label="Commission Price">{Commissiondata.CURRENCY_TYPE}{Commissiondata.COMMISSION_PRICE}</TableCell>
                        <TableCell data-label="Action">{Commissiondata.PAID_COMMSSION_STATUS}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Chip, Select, SelectItem, User, Spinner, Input } from "@nextui-org/react";

import jwt from '../../../../getLoggedUser/GetUserInfomation';
import { v1GETDATA } from '../../../../APIurl/url';
import { useParams, NavLink } from 'react-router-dom';
import Blank from '../../../../staff/LeadApplication/tab/blank';
import debounce from 'lodash.debounce';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


export default function App() {

    const wordLimit = 20; // Set your desired word limit

    const truncatedDescription = (description: any, limit: any) => {
        const words = description.split(' ');
        if (words.length <= limit) return description;
        return words.slice(0, limit).join(' ') + '...';
    };


    const MySwal = withReactContent(Swal);
    const token = jwt('jwt');
    const [loaddata, setloaddata] = useState(false);
    const [load, setload] = useState('');
    const [Refresh, SetRefresh] = useState(false);
    const [Page, Setpage] = useState(1);
    const [ApplicationTotal, setApplicaton] = useState([]);
    const [Totalpage, settotalpage] = useState(1);
    const [ColStatus, Setcolstatus]: any = useState();

    const debouncedTotalapplication = debounce(async () => {
        setloaddata(true);
        setload('loading');
        try {
            const res = await fetch(v1GETDATA, {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': `true`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'TOTAL.COMMISSION.JSON.HISTORY.AGENT',
                    Page: Page,
                    ColStatus: ColStatus == "" ? null : ColStatus,
                }),
            });
            const data = await res.json();
            setApplicaton(data.data);
            settotalpage(data.total_pages)
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setload('idle');
            setloaddata(false);
        }
    }, 300);


    useEffect(() => {
        debouncedTotalapplication();
    }, [Refresh, ColStatus]);



    const Handaltaskstatus = async (ID: any, key: any) => {
        let statusdata = key.target.value;
        setloaddata(true);
        setload('loading');
        try {
            const res = await fetch(v1GETDATA + '?action=insertComment', {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': `true`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'TASK.UPDATE.AGENT',
                    ID: ID,
                    statusdata: statusdata,
                }),
            });

            const response = await res.json();
            if (response.status == true) {

                MySwal.fire({
                    title: response.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                })
            } else {
                MySwal.fire({
                    title: response.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-danger`,
                    },
                });
            }
        } catch (err) {
            MySwal.fire({
                title: 'Error your form and form components please refresh page and try again',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-success`,
                },
            });
        }
        setloaddata(false);
        setload('idle');
    }


    return (<>
        <div className="grid gap-4">
            <div className="grid grid-cols-5 gap-11 set_margin_bottom">
                <div className="col-span-4">
                    <h3 className="text-2xl">COMMISSION </h3>

                </div>
                <div className="col-span-1">
                    <div className="w-full flex flex-col gap-4">
                        <h3 className="text-2xl">Filtter</h3>

                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Select
                                placeholder="Select Status"
                                size={'sm'}
                                onChange={(e) => {
                                    Setcolstatus(e.target.value);
                                }}
                            >
                                <SelectItem key="Paid">
                                    Paid
                                </SelectItem>
                                <SelectItem key="Unpaid">
                                    Unpaid
                                </SelectItem>
                            </Select>

                        </div>

                    </div>
                </div>
            </div>

            <Table

                aria-label="Example table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={Page}
                            total={Totalpage}
                            onChange={(page) => Setpage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader >
                    <TableColumn >Client Name & Email </TableColumn>
                    <TableColumn >Application Country</TableColumn>
                    <TableColumn >Application Services</TableColumn>
                    <TableColumn>Commission Price</TableColumn>
                    <TableColumn>Commission Status</TableColumn>

                </TableHeader>
                <TableBody items={ApplicationTotal} emptyContent={"No Task found"} loadingContent={<Spinner size="lg" />}
                    loadingState={loaddata ? 'loading' : 'idle'}
                >
                    {ApplicationTotal.map((Applicat: any, index: any) => (
                        <TableRow key={index} >
                            <TableCell>
                                <span>
                                    <div>
                                        <NavLink to={`/agent/client/view/${Applicat.ID}/${Applicat.CLIENT_ID}`}>
                                            <b> Name: </b> {Applicat.FIRST_NAME} {Applicat.LAST_NAME}
                                        </NavLink>
                                        <br />
                                        <b> Email: </b>: {Applicat.EMAIL}
                                    </div>
                                </span>
                            </TableCell>
                            <TableCell>

                                {
                                    (() => {
                                        const countryList = JSON.parse(Applicat.ApplicationCountry);
                                        const uniqueCountryNames = Array.from(new Set(countryList.map((value: any) => value.SERVICE_COUNTRY_NAME))).join(', ');
                                        return <div>{uniqueCountryNames}</div>;
                                    })()
                                }

                            </TableCell>
                            <TableCell>
                                {
                                    (() => {
                                        const servicesList = JSON.parse(Applicat.ClientServicess);
                                        const uniqueServiceNames = Array.from(new Set(servicesList.map((value: any) => value.SERVICE_NAME))).join(', ');
                                        return <div>{uniqueServiceNames}</div>;
                                    })()
                                }
                            </TableCell>
                            <TableCell>
                                <span>
                                    {Applicat.CURRENCY_TYPE}
                                    {Applicat.COMMISSION_PRICE}
                                </span>
                            </TableCell>
                            <TableCell>{Applicat.PAID_COMMSSION_STATUS}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </>
    );
}

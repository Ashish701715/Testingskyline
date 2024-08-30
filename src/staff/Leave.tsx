import React, { useEffect, useState } from 'react'
import ApplyLeave from './ApplyLeave';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import Token from '../getLoggedUser/GetUserInfomation';
import { v1GETDATA } from '../APIurl/url';
import '..//pages/university/university.css';
export default function Inventory() {
    const token = Token('jwt');
    const [Leavedata, Setleavedata] = useState([]);


    const ClientInfomation = async () => {
        try {
            const res = await fetch(v1GETDATA + '?Action=clientInfomation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': 'true',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'Levea.data.user',

                }),
            });
            const data = await res.json();
            if (data.data.length > 0) {
                Setleavedata(data.data)
            } else {
                Setleavedata(data.data)
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        ClientInfomation();
    }, []);



    return (
        <div className='grid gap-4'>
            <div>
                <ul className="flex justify-between set_margin_leave_headeer">
                    <li>
                        <h4 className="bold-font-700 text-3xl">Leave</h4>
                    </li>
                    <li className="flex">
                        <ApplyLeave />
                    </li>
                </ul>
            </div>


            <div>
            <Table aria-label="Example static collection table" className='table6'>
                <TableHeader>
                    <TableColumn>Leave Type</TableColumn>
                    <TableColumn>Reason</TableColumn>
                    <TableColumn>Start Date</TableColumn>
                    <TableColumn>End Date</TableColumn>
                    <TableColumn>Status</TableColumn>
                </TableHeader>
                <TableBody>
                    {Leavedata.map((leave: any, index: any) => (
                        <TableRow key={index}>
                            <TableCell data-column="Leave Type">{leave.LEAVE_TYPE}</TableCell>
                            <TableCell data-column="Reason">{leave.REASON}</TableCell>
                            <TableCell data-column="Start Date">{leave.START_DATE}</TableCell>
                            <TableCell data-column="End Date">{leave.END_DATE}</TableCell>
                            <TableCell data-column="Status">{leave.STATUS === 1 ? 'Approved' : 'Not-Approved'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </div>

    )
}

import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import Taskcreate from "./Createtask";
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { v1GETDATA } from '../../../APIurl/url';
import { useParams, NavLink } from 'react-router-dom';
import Blank from '../../../staff/LeadApplication/tab/blank';
import debounce from 'lodash.debounce';
export default function App() {
    const [loader, setloader] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const token = jwt('jwt');
    const { client_id } = useParams();
    const { file_id } = useParams();
    const [loaddata, setloaddata] = useState(false);
    const [Refresh, SetRefresh] = useState(false);
    const [ApplicationTotal, setApplicaton] = useState([]);

    const debouncedTotalapplication = debounce(async () => {
        setloaddata(true);
        try {
            const res = await fetch(v1GETDATA, {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': `true`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'TOTAL.TASK.JSON.HISTORY.STAFF',
                    ClientId: client_id,
                    Deal_ID: file_id,
                }),
            });
            const data = await res.json();
            setApplicaton(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setloaddata(false);
        }
    }, 300);


    useEffect(() => {
        debouncedTotalapplication();
    }, [Refresh]);


    return (
        <div className="grid gap-3">
            <div className="flex justify-end">
                <Taskcreate Refresh={SetRefresh} />
            </div>
            {loaddata ? <Blank /> :
                <Table className="table6">
                    <TableHeader>
                        <TableColumn >Task Title</TableColumn>
                        <TableColumn style={{ width: '50%' }}>Task Description</TableColumn>
                        <TableColumn>Task Priority</TableColumn>
                        <TableColumn>Task Create</TableColumn>
                        <TableColumn>Task Deadline</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {ApplicationTotal.map((Applicat: any, index: any) => (
                            <TableRow key={index} >
                                <TableCell data-column="Task Title" className="text-lg">{Applicat.TASK_TITLE}</TableCell>
                                <TableCell data-column="Task Description" className="text-lg">{Applicat.TASK_DESCRIPTION}</TableCell>
                                <TableCell data-column="Task Priority" className="text-lg">{Applicat.TASK_PRIORITY}</TableCell>
                                <TableCell data-column="Task Create" className="text-lg">{Applicat.SENDING_DATE_TIME}</TableCell>
                                <TableCell data-column="Task Deadline" className="text-lg">{Applicat.DEADLINE}</TableCell>
                                <TableCell data-column="Action" className="text-lg">{Applicat.TASK_STATUS}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            }
        </div>
    );
}

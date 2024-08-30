import React, { useEffect, useState, useRef } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react';
import '../style.css';

import { GETDATA } from '../../../APIurl/url';
import userInfo from '../../../getLoggedUser/GetUserInfomation';
import { render } from '@headlessui/react/dist/utils/render';
import { NavLink } from 'react-router-dom';

const columns = [
    {
        key: 'ID',
        label: 'CLIENT ID',
    },
    {
        key: 'FIRST_NAME',
        label: 'CLIENT FIRST NAME',
    },
    {
        key: 'LAST_NAME',
        label: 'CLIENT LAST NAME',
    },
    {
        key: 'PHONE_NUMBER',
        label: 'PHONE NUMBER',
    },
    {
        key: 'DATE_OF_BIRTH',
        label: 'DATE OF BIRTH',
    },
    {
        key: 'COUNTRY_OF_CITIZENSHIP',
        label: 'GENDER',
    },
    {
        key: 'ACTION',
        label: 'Action',
    },
];

interface ApplicationListProps {
    className?: string;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ className }) => {
    const [ClientRecord, setClientRecord] = useState([]);
    const token = userInfo('jwt');
    const GetStudentData = async () => {
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(GETDATA + '?action=view.client.record', {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': 'true',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'STUDENT_DATA_NEW',
                    RequesterUser: 'agent',
                    userId: UserAuthID,
                }),
            });
            const data = await responseData.json();

            setClientRecord(data.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        GetStudentData();
    }, []);

    const renderCell = (user: any, columnKey: any) => {
        switch (columnKey) {
            case 'ACTION':
                return (
                    <div className="relative items-center gap-2">
                        <NavLink to='#'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] text-blue">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </NavLink>
                    </div>
                );
            default:
                return user[columnKey];
        }
    };

    return (
        <div className={className}>
            <Table aria-label="Controlled table example with dynamic content" >
                <TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
                <TableBody items={ClientRecord}>
                    {(ClientRecord: any) => <TableRow key={ClientRecord.ID}>{(columnKey) => <TableCell>{renderCell(ClientRecord, columnKey)}</TableCell>}</TableRow>}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicationList;

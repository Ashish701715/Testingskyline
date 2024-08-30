import React, { useState, useEffect } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    Chip, User, Pagination, Selection, ChipProps, SortDescriptor, Spinner, Card, Tooltip
} from "@nextui-org/react";
import LoopIcon from '@mui/icons-material/Loop';
import PauseIcon from '@mui/icons-material/Pause';
import { Avatar, AvatarGroup } from "@nextui-org/react";
// import './style.css';
import { generateJWT } from "../../pages/JWT";
import { GetsUserAPI } from '../../APIurl/url';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';

const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
const authTokenLocalStorage = localStorage.getItem('auth_token');
const columns = [
    { name: "ID", uid: "TASKID", sortable: true },
    { name: "Task Title", uid: "TITLE", sortable: true },
    { name: "PRIORITY", uid: "PRIORITY", sortable: true },
    { name: "Deadline", uid: "DEADLINE", sortable: true },
    { name: "Create By", uid: "Create_by", sortable: true },
    { name: "Assignee", uid: "ASSIGNMENTS_USER", sortable: true },
    { name: "Status", uid: "STATUS", sortable: true },
    { name: "Create On", uid: "CREATE_AT" },
    { name: "Modified on", uid: "MODIFIEDON", sortable: true },
    { name: "Lead", uid: "IS_LEAD_TASK", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["TASKID", "Create_by", "TITLE", "PRIORITY", "STATUS", "ASSIGNMENTS_USER", "DEADLINE", "CREATE_AT", "MODIFIEDON", "IS_LEAD_TASK"];

/**Start Function Export Default Function ************************************************************/

export default function App() {
    const CheckIcon = ({

    }) => {
        return (
            <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"

            >
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor" />
            </svg>
        );
    };



    const MySwal = withReactContent(Swal);
    const [getuser, setUserData] = useState([]);
    const [Metadata, setmetadata] = useState([]);
    const [isloading, setloading] = useState(false);
    const [isrefresh, setRefresh] = useState(false);
    const [limit, setLimit] = useState(10);
    const [Sortby, Setsortby] = useState('TASKID');
    const [Sortcall, Setsortcall] = useState('DESC');
    const [page, setPage] = React.useState(1);
    useEffect(() => {
        setRefresh(false);
        // Generate JWT token
        const payload = { useremail: 'ashish' };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 50;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        // Fetch user data
        token.then((JwtToken) => {
            setloading(true)
            const parametter = `?onlyview=true&limit=${limit}&page=${page}&order=${Sortcall}&sortby=${Sortby}`;
            fetch(GetsUserAPI + parametter, {
                method: 'POST',
                body: JSON.stringify({ PAGE_REQUEST: 'GETUSERMYTASK', AUTH_ID: authTokenLocalStorage }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authenticate': `Bearer ${JwtToken}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setUserData(data.data);
                    setmetadata(data);
                    setloading(false)
                })
                .catch(error => {
                    setloading(false)
                    console.error('Error fetching user data:', error);
                });
        }).catch((err) => {
            console.log(err)
        });
    }, [isrefresh]);

    //formated date and time fields

    const formatDate = (datetimeString: any) => {
        if (!datetimeString) {
            return "No Deadline";
        }

        const date = new Date(datetimeString);
        const monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

        return `${month} ${day}, ${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };


    const loadingState = (isloading) ? "loading" : "idle";;

    const users: any = getuser ?? [];
    const metadata: any = Metadata ?? [];
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "",
        direction: "descending",
    });





    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);




    const renderCell = React.useCallback((user: any, columnId: any) => {
        const value = user[columnId];
        const Create_By = JSON.parse(user.CREATE_USER);
        const assignments_user = JSON.parse(user.ASSIGNMENTS_USER);
        const LEAD_INFO = JSON.parse(user.LEAD_INFO);
        switch (columnId) {
            case "TITLE":
                return (
                    <>
                        <NavLink to={`/page/company/task/View/${user.TASKTOKEN}/${user.TASKID}`}>
                            <span className='font-semibold text-black'>{user.TITLE}</span>
                        </NavLink>
                    </>


                );
            case "Create_by":
                return (
                    <>
                        <User
                            name={Create_By.CLIENT_NAME}
                            description={Create_By.CLIENT_EMAIL}
                            avatarProps={{
                                src: `${Create_By.PROFILE_URL}`
                            }}
                        />
                    </>


                );
            case "STATUS":
                return (
                    <>
                        {user.STATUS == 3 ? (
                            <Chip
                                startContent={<PauseIcon />}
                                variant="faded"
                                color="danger"
                            >
                                Pending
                            </Chip>
                        ) : user.STATUS == 2 ? (
                            <Chip
                                startContent={<LoopIcon />}
                                variant="faded"
                                color="warning"
                            >
                                In-progress
                            </Chip>
                        ) : user.STATUS == 1 ? (
                            <Chip
                                startContent={<CheckIcon />}
                                variant="faded"
                                color="success"
                            >
                                Complete
                            </Chip>
                        ) : null /* If none of the conditions match, render nothing */}
                    </>

                );
            case "CREATE_AT":
                return (
                    <>
                        {formatDate(user.CREATE_AT)}
                    </>
                );
            case "MODIFIEDON":
                return (
                    <>
                        {formatDate(user.MODIFIEDON)}
                    </>
                );
            case "ASSIGNMENTS_USER":
                const assignments = JSON.parse(user.ASSIGNMENTS_USER); // Assuming 'data' contains the JSON string of assignments
                return (
                    <>
                        <AvatarGroup isBordered max={3} total={assignments.length}>
                            {assignments.map((assignment: any, index: any) => (
                                // <Tooltip content={assignment.CLIENT_NAME}>
                                <Avatar key={index} src={assignment.PROFILE_URL} /> // Assuming 'PROFILE_URL' contains the URL of the avatar
                                // </Tooltip>
                            ))}
                        </AvatarGroup>
                    </>
                );

            case "IS_LEAD_TASK":
                return (
                    <>
                        <p>{LEAD_INFO.LEAD_NAME}</p>
                    </>
                );
            case "DEADLINE":

                const deadlineDate = new Date(user.DEADLINE);
                const currentDate = new Date();
                const timeDifference = deadlineDate.getTime() - currentDate.getTime();
                const delayInDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                const isPastDeadline = deadlineDate < currentDate;

                return (
                    <>
                        <Chip
                            startContent={isPastDeadline ? "" : < CheckIcon />}
                            variant="faded"
                            color={isPastDeadline ? "danger" : "success"} // Use "danger" color if past deadline
                        >
                            {user.DEADLINE ? `${formatDate(user.DEADLINE)}${isPastDeadline ? ` (${delayInDays} days late)` : ''}` : 'No Deadline'}

                        </Chip>
                    </>
                );
            default:
                return value;
        }
    }, []);


    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])


    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        // startContent={serach}
                        value={filterValue}
                        onClear={() => onClear()}
                    />
                    <div className="flex gap-3">

                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button size="sm" variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                </div>

            </div>
        );
    }, [
        filterValue,
        visibleColumns,
    ]);

    const bottomContent = React.useMemo(() => {
        let totalPages = Math.ceil(metadata.totalRecord / metadata.view_Record);
        let startEntry = (metadata.page - 1) * metadata.view_Record + 1;
        let endEntry = Math.min(metadata.page * metadata.view_Record, metadata.totalRecord);
        return (

            <div className="py-2 px-2 flex justify-between items-center">
                <span className="text-small text-default-400">
                    {`Showing ${startEntry} to ${endEntry} of ${metadata.totalRecord} entries`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    color="primary"
                    // page={metadata.page}
                    total={totalPages}
                    onChange={(e) => {

                        const newPage = Number(e);
                        setPage(newPage);
                        setRefresh(true);
                    }}
                />

                <div className="flex justify-between items-center">
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={(e) => {
                                const newLimit = parseInt(e.target.value);
                                setLimit(newLimit); // assuming you have a state variable called 'limit'
                                setRefresh(true);
                            }}
                        >
                            <option value="10">10</option>
                            <option value="2">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>

                    </label>
                </div>
            </div>
        );
    }, [metadata, setPage]);


    const handleSortChange = (descriptor: SortDescriptor) => {
        setSortDescriptor(descriptor)
        if (descriptor.column) {
            const sortColumnName = headerColumns.find((column: any) => column.uid === descriptor.column)?.uid;
            const sortOrder = descriptor.direction === 'ascending' ? 'ASC' : 'DESC';
            Setsortby(String(sortColumnName))
            Setsortcall(sortOrder);
            setRefresh(true);
        } else {
            console.log('Sort cleared');
        }
    };

    return (
        <div>


            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[600px]",
                }}
                selectedKeys={selectedKeys}
                // selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={handleSortChange}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                    className="tablestyle"
                >
                    {users.map((user: any, index: any) => (
                        <TableRow key={index}>
                            {headerColumns.map((column) => (
                                <TableCell key={column.uid}>
                                    {renderCell(user, column.uid)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    );
}
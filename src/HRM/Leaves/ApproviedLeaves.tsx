import React, { useState, useEffect } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    Chip, User, Pagination, Selection, ChipProps, SortDescriptor, Spinner, Card, Tooltip
} from "@nextui-org/react";
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LoopIcon from '@mui/icons-material/Loop';
import PauseIcon from '@mui/icons-material/Pause';
import { Avatar, AvatarGroup } from "@nextui-org/react";
// import './style.css';
import Token from '../../getLoggedUser/GetUserInfomation';
import { generateJWT } from "../../pages/JWT";
import { UPDATE } from '../../APIurl/url';
import { GetsUserAPI } from '../../APIurl/url';
import Swal from 'sweetalert2';
import { NavLink } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import "../../Task&Project/Task_style.css";
import "../user/style.css";

const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
const authTokenLocalStorage = localStorage.getItem('auth_token');
const columns = [
    { name: "ID", uid: "LEAVE_ID", sortable: true },
    { name: "USER", uid: "USER", sortable: true },
    { name: "START DATE", uid: "START_DATE", sortable: true },
    { name: "END DATE", uid: "END_DATE", sortable: true },
    { name: "LEAVE TYPE", uid: "LEAVE_TYPE", sortable: true },
    { name: "REASON", uid: "REASON", sortable: true },
    { name: "STATUS", uid: "STATUS", sortable: true },

];
function setShowAddDepartment(arg0: boolean) {

}

const INITIAL_VISIBLE_COLUMNS = ["LEAVE_ID", "USER", "START_DATE", "END_DATE", "LEAVE_TYPE", "REASON", "STATUS"];

/**Start Function Export Default Function ************************************************************/

export default function App() {

    const token = Token('jwt');
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
    const [Sortby, Setsortby] = useState('LEAVE_ID');
    const [Sortcall, Setsortcall] = useState('DESC');
    const [page, setPage] = React.useState(1);
    useEffect(() => {
        setRefresh(false);
        // Generate JWT token
        setloading(true)
        const parametter = `?onlyview=true&limit=${limit}&page=${page}&order=${Sortcall}&sortby=${Sortby}`;
        fetch(GetsUserAPI + parametter, {
            method: 'POST',
            body: JSON.stringify({ PAGE_REQUEST: 'GETUSERLEAVEHRM', AUTH_ID: authTokenLocalStorage }),
            headers: {
                'Content-Type': 'application/json',
                'Authenticate': `Bearer ${token}`
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
    }, [isrefresh]);

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


    //approved leaves

    const handleleave = async (LeaveID: any, status: any) => {
        try {
            // Show SweetAlert confirmation dialog
            const confirmAction = await Swal.fire({
                title: 'Confirm Approval',
                text: 'Are you sure you want to approve?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Approved',
                cancelButtonText: 'Cancel',
            });

            // Check if the user confirmed the action
            if (confirmAction.isConfirmed) {
                const payload = { REQUEST: 'LEAD_PAGE', is_Admin: false, isValid: true };
                const secretKey = 'JwtSecret';
                const expiresIn = 20; // Token expiration in seconds
                const token = await generateJWT(payload, secretKey, expiresIn);

                const response = await fetch(UPDATE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authenticate': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'Leaveupdate',
                        AUTH_ID: authTokenLocalStorage,
                        LeaveID: LeaveID,
                        status: status
                    }),
                });

                if (response.ok) {
                    const responseData = await response.json();

                    if (responseData.status === true) {
                        Swal.fire('Success', responseData.Message, 'success');
                        window.location.reload();
                    } else {
                        Swal.fire('Error', 'Failed to approve task', 'error');
                    }
                } else {
                    Swal.fire('Error', 'Failed to approve task', 'error');
                }
            }
        } catch (error) {
            console.error('Error approving task:', error);
            Swal.fire('Error', 'An error occurred while approving the task', 'error');
        }
    }


    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const statusColorMap: Record<string, ChipProps["color"]> = {
        1: 'success',
        0: 'danger',
    };


    const renderCell = React.useCallback((user: any, columnId: any) => {
        const value = user[columnId];
        switch (columnId) {
            case "USER":
                return (
                    <>
                        <User
                            name={user.CLIENT_NAME}
                            description={user.CLIENT_EMAIL}
                            avatarProps={{
                                src: (user.PROFILE_URL)
                            }}
                        />
                    </>
                );

            case "STATUS":
                return (
                    <>
                        <Chip
                            startContent={value === '1' ? <VerifiedIcon /> : <NewReleasesIcon />}
                            variant="faded"
                            color={statusColorMap[String(value)]}
                            onClick={() => handleleave(user.LEAVE_ID, user.STATUS)}
                        >
                            {value === '1' ? 'Approved ' : 'Not Approved'}
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
        function handleinviteuser() {
            if (!setShowAddDepartment) {
                setShowAddDepartment(true);
            } else {
                setShowAddDepartment(false);
                setTimeout(() => {
                    setShowAddDepartment(true);
                }, 10);
            }
        }

        return (
            <div className="flex flex-col gap-4">
                {/* <div className="flex flex-wrap gap-12 card-white"> */}
                {/* <ul className="list" id="table-list">
                        <NavLink to="/admin/HRM/Company/leave">
                            <li className={`list-name font-medium text-lg-200 ${location.pathname == '/admin/HRM/Company/leave' ? 'HRM_active' : ''}`} title="USER">
                                Leave List
                            </li>
                        </NavLink>
                        <NavLink to="/admin/HRM/Company/User/leave">
                            <li className={`list-name font-medium text-lg-200 ${location.pathname == '/admin/HRM/Company/User/leave' ? 'HRM_active' : ''}`} title="USER">
                                Leave Manage
                            </li>
                        </NavLink>

                     


                    </ul> */}

                {/* </div> */}
                <div className="flex justify-between gap-3 items-end">
                    <div></div>
                    {/* <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        // startContent={serach}

                        onClear={() => onClear()}
                    /> */}
                    <div className="flex gap-3">


                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex ">
                                <Button className="hidde_columns" size="sm" variant="flat">
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
                    total={totalPages || 1}
                    // initialPage={3}
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

            <Card className="p-5">

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
                                        <div data-column={column.name}>
                                            {renderCell(user, column.uid)}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Card>

        </div>
    );
}

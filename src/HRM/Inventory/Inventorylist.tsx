import React, { useState, useEffect } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    Chip, User, Pagination, Selection, ChipProps, SortDescriptor, Spinner, Card, Tooltip, Modal, ModalContent, ModalHeader,
} from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

import MoreVertIcon from '@mui/icons-material/MoreVert';
// import './style.css';
import Token from '../../getLoggedUser/GetUserInfomation';
import { generateJWT } from "../../pages/JWT";
import { GetsUserAPI } from '../../APIurl/url';
import { DELETE } from '../../APIurl/url';
import { UPDATE } from '../../APIurl/url';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Editinventory from './Edit_inventory';

const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
const authTokenLocalStorage = localStorage.getItem('auth_token');
const columns = [
    { name: "#", uid: "#", sortable: true },
    { name: "PRODUCT NAME", uid: "PRODUCT_NAME", sortable: true },
    { name: "BRAND", uid: "BRAND", sortable: true },
    { name: "CODE", uid: "CODE", sortable: true },
    // { name: "UNIT", uid: "UNIT", sortable: true },
    { name: "QUANTITY", uid: "QUANTITY", sortable: true },
    { name: "USER", uid: "USER", sortable: true },
    { name: "ASSIGNEE", uid: "Assignee", sortable: true },
    { name: "Action", uid: "Action", sortable: true },

];

interface User {
    CLIENT_NAME: string;
    CLIENT_ID: string;
    USER_RECORD: string;
    CLIENT_EMAIL: string;
    PROFILE_URL: string;
    ID: string | number;
}
const INITIAL_VISIBLE_COLUMNS = ["#", "PRODUCT_NAME", "BRAND", "CODE", "UNIT", "QUANTITY", "USER", "Assignee", "Action"];

/**Start Function Export Default Function ************************************************************/

export default function App() {
    const token = Token('jwt');
    const MySwal = withReactContent(Swal);
    const [Userdata, setuser] = useState<User[]>([]);
    const [getuser, setUserData] = useState([]);
    const [Metadata, setmetadata] = useState([]);
    const [isloading, setloading] = useState(false);
    const [isrefresh, setRefresh] = useState(false);
    const [limit, setLimit] = useState(10);
    const [Sortby, Setsortby] = useState('ID');
    const [Sortcall, Setsortcall] = useState('DESC');
    const [page, setPage] = React.useState(1);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setRefresh(false);
                setloading(true);
                const parametter = `?onlyview=true&limit=${limit}&page=${page}&order=${Sortcall}&sortby=${Sortby}`;
                const response = await fetch(GetsUserAPI + parametter, {
                    method: 'POST',
                    body: JSON.stringify({ PAGE_REQUEST: 'GETINVENTORY', AUTH_ID: authTokenLocalStorage }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authenticate': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUserData(data.data);
                setmetadata(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setloading(false);
            }
        };

        fetchData();
    }, [page, limit, Sortby, Sortcall]);




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




    //Delect user data
    const UserDelete = (userId: number) => {
        Swal.fire({
            title: `Are you sure you want to delete this inventory data?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                const payload = { useremail: 'ashish' };
                const secretKey = 'JwtSecret';
                const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
                const expirationTimestampInSeconds = currentTimestampInSeconds + 80;
                const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

                const token = generateJWT(payload, secretKey, expiresIn);

                // Fetch user data
                token.then((JwtToken) => {
                    fetch(DELETE, {
                        method: 'POST',
                        body: JSON.stringify({ PAGE_REQUEST: 'DELETE_INVENTORY', USER_ID: userId }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authenticate': `Bearer ${JwtToken}`
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status == true) {
                                MySwal.fire({
                                    title: 'Inventory data Delete Successfully',
                                    toast: true,
                                    position: 'bottom-start',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    showCloseButton: true,
                                    customClass: {
                                        popup: `color-default`,
                                    },
                                });
                                setRefresh(true);
                            } else {
                                MySwal.fire({
                                    title: 'Failed to Delete',
                                    toast: true,
                                    position: 'bottom-end',
                                    showConfirmButton: false,
                                    timer: 3000,
                                    showCloseButton: true,
                                    customClass: {
                                        popup: `color-danger`,
                                    },
                                });
                            }
                            // console.log(data);
                        })
                        .catch(error => {

                            console.error('Error fetching user data:', error);
                        });
                }).catch((err) => {
                    console.log(err)
                });
            }
        });
    };
    //assigned user

    const handleSelectChange = async (LeaveID: any, event: any) => {
        const userId = event.target.value;
        console.log(userId);
        try {
            // Show SweetAlert confirmation dialog
            const confirmAction = await Swal.fire({
                title: 'Confirm Approval',
                text: 'Are you sure you want to Assignee?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Assignee',
                cancelButtonText: 'Cancel',
            });

            // Check if the user confirmed the action
            if (confirmAction.isConfirmed) {
                const payload = { REQUEST: 'LEAD_PAGE', is_Admin: false, isValid: true };
                const secretKey = JWT_SCREET;
                const expiresIn = 20; // Token expiration in seconds
                const token = await generateJWT(payload, secretKey, expiresIn);

                const response = await fetch(UPDATE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authenticate': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'AssigneeInvontory',
                        AUTH_ID: authTokenLocalStorage,
                        InventoryID: LeaveID,
                        userId: userId
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

    const UPDATEPROFILE = (userId: any) => {
        if (isOpen == false) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
            setTimeout(() => {
                setIsOpen(true);
            }, 10);
        }
        setSelectedUserId(userId);

    };


    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const statusColorMap: Record<string, ChipProps["color"]> = {
        1: 'success',
        0: 'danger',
    };
    const [isOpen, setIsOpen] = useState(false);

    const renderCell = React.useCallback((user: any, columnId: any, index: any) => {
        const value = user[columnId];
        switch (columnId) {
            case "#":
                return (
                    <>{index + 1}</>
                );
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
                        >
                            {value === '1' ? 'Approved ' : 'Not Approved'}
                        </Chip>
                    </>
                );

            case "Assignee":
                return (
                    <>
                        {user.Assigne_user.length > 0 ?
                            <User
                                name={user.Assigne_user[0].CLIENT_NAME}
                                description={user.Assigne_user[0].CLIENT_EMAIL}
                                avatarProps={{
                                    src: (user.PROFILE_URL)
                                }}
                            />
                            : 'User Not Assignee'}
                    </>
                );
            case "Action":
                return (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                            >
                                <MoreVertIcon />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            {/* <DropdownItem key="new">New file</DropdownItem>
              <DropdownItem key="copy">Copy link</DropdownItem>*/}
                            <DropdownItem key="edit" onClick={() => UPDATEPROFILE(user.ID)}>Edit Profile</DropdownItem>
                            <DropdownItem key="delete" className="text-danger" color="danger" onClick={() => UserDelete(user.ID)}>
                                Delete file
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );

            default:
                return value;
        }
    }, []);


    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    function onOpenChange(unusedArg: any) {
        if (isOpen == true) {
            setIsOpen(false)
        } else {
            setIsOpen(true)
        }
    }
    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
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
                            <DropdownTrigger className="hidden sm:flex">
                                <Button size="sm" variant="flat" className="hidde_columns">
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
                                    <div data-column={column.name}>
                                        {renderCell(user, column.uid, index)}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="demos">
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" style={{ marginLeft: '50%' }} placement="top-center" className="modalclose inviteuser" isDismissable={false} isKeyboardDismissDisabled={true} >
                    <ModalContent className="pt-10">
                        <Editinventory selectedUserId={selectedUserId || ''} />
                    </ModalContent>

                </Modal>
            </div >

        </div>
    );
}
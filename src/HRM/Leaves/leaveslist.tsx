import React, { useState, useEffect } from "react";
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
    Chip, User, Pagination, Selection, ChipProps, SortDescriptor, Spinner, Card, Tooltip
} from "@nextui-org/react";
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
// import './style.css';
import Token from '../../getLoggedUser/GetUserInfomation';
import { generateJWT } from "../../pages/JWT";
import { GetsUserAPI } from '../../APIurl/url';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../Admin/University/modal/modal-phone.css';

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

const INITIAL_VISIBLE_COLUMNS = ["LEAVE_ID", "USER", "START_DATE", "END_DATE", "LEAVE_TYPE", "REASON", "STATUS"];

/**Start Function Export Default Function ************************************************************/

export default function App() {

    const token = Token('jwt');

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
        const fetchUserData = async () => {
            setRefresh(false);
            setloading(true);
            const parametter = `?onlyview=true&limit=${limit}&page=${page}&order=${Sortcall}&sortby=${Sortby}`;
            try {
                const response = await fetch(GetsUserAPI + parametter, {
                    method: 'POST',
                    body: JSON.stringify({ PAGE_REQUEST: 'GETUSERLEAVE', AUTH_ID: authTokenLocalStorage }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authenticate': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUserData(data.data);
                setmetadata(data);
                setloading(false);
            } catch (error) {
                setloading(false);
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
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
                            <option value="15">15</option>
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
                                <TableCell key={column.uid} >
                                    <div data-column={column.name}>
                                        {renderCell(user, column.uid)}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

        </div>
    );
}
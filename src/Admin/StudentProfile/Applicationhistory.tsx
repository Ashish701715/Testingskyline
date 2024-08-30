import React, { useState, useEffect } from "react";
import { useParams, NavLink } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Selection, SortDescriptor, Spinner
} from "@nextui-org/react";
import { v1History } from '../../APIurl/url';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Token from '../../getLoggedUser/GetUserInfomation';
const token = Token('jwt');
const columns = [
    { name: "#", uid: "#", sortable: true },
    { name: "NOTE", uid: "NOTES", sortable: true },
    { name: "COMMENT", uid: "COMMENT", sortable: true },
    { name: "UPDTAE TIME", uid: "UPDATE_TIME", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["#", "NOTES", "COMMENT", "UPDATE_TIME"];

export default function App() {

    const { client_id } = useParams();

    const [getuser, setUserData] = useState([]);
    const [Totalcount, setTotalcount] = useState();

    const [isloading, setloading] = useState(false);
    const [isrefresh, setRefresh] = useState(false);
    const [limit, setLimit] = useState(10);
    const [Sortby, Setsortby] = useState('ID');
    const [Sortcall, Setsortcall] = useState('DESC');
    const [page, setPage] = React.useState(1);



    const debouncedUserFetch = debounce(async () => {
        setloading(true);
        const parametter = `?onlyview=true&limit=${limit}&page=${page}&order=${Sortcall}`;

        try {
            const responseData: any = await fetch(v1History + parametter, {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': 'true',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'Agent.Application.History',
                    client_id: client_id
                }),
            });
            const data = await responseData.json();
            setUserData(data.Total_record);
            setTotalcount(data.Total_count)
            setloading(false);
        } catch (err) {
            setloading(false);
        }
    }, 300);


    useEffect(() => {
        debouncedUserFetch();
    }, [isrefresh]);

    const loadingState = (isloading) ? "loading" : "idle";;

    const users: any = getuser ?? [];
    const Totalcounts: any = Totalcount ?? 1;
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



    //data formate convert function

    const convertDate = (inputDate: any) => {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
    };




    const renderCell = React.useCallback((user: any, columnId: any, index: number) => {
        const value = user[columnId];
        switch (columnId) {
            case "#":
                return (
                    <>{index + 1}</>
                );
            case "UPDATE_TIME":
                return (
                    <>
                        {convertDate(user.ACTION_DATE)}
                    </>
                );

            default:
                return value;
        }
    }, []);



    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4 overflow-auto max-h-[500px]">
                <div className="flex justify-end gap-3 items-end">
                    <div className="flex  gap-3">






                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small"> {Totalcounts ? 'Total ' + Totalcounts + ' users' : ''}</span>
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
    }, [
        filterValue,
        visibleColumns,
    ]);

    const bottomContent = React.useMemo(() => {
        let totalPages = Math.ceil(Totalcounts / limit);
        return (

            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    isCompact
                    showControls
                    color="primary"
                    // page={metadata.page}
                    total={totalPages || 0}
                    onChange={(e) => {

                        const newPage = Number(e);
                        setPage(newPage);
                        setRefresh(true);
                    }}
                />

            </div>
        );
    }, [setPage]);


    const handleSortChange = (descriptor: SortDescriptor) => {
        setSortDescriptor(descriptor);

        if (descriptor.column) {
            const sortColumnName = headerColumns.find((column) => column.uid === descriptor.column)?.uid;
            const sortOrder = descriptor.direction === 'ascending' ? 'ASC' : 'DESC';
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
                                    {renderCell(user, column.uid, index)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>






        </div>

    );
}
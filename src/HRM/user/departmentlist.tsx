import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner } from "@nextui-org/react";
import userInfo from '../../getLoggedUser/GetUserInfomation';
import { GETDATA } from '../../APIurl/url';
import debounce from 'lodash.debounce';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
export default function App() {
    const token = userInfo('jwt');
    const [loader, setLoader] = useState(false);
    const [Stafflist, Setstafflist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const GETSTAFF = async () => {
        setLoader(true);
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(
                `${GETDATA}?currentPage=${currentPage}&rowsPerPage=${rowsPerPage}&sortField=id&sortOrder=desc`,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'GET.COUNTRY.DATA',
                    }),
                }
            );
            const data = await responseData.json();
            console.log(data.data);
            Setstafflist(data.data);
            setTotalPages(Math.ceil(data.total / rowsPerPage)); // Adjust total pages calculation
            setLoader(false);
        } catch (err) {
            console.error(err);
            setLoader(false);
        }
    };

    const debouncedGetStaff = debounce(GETSTAFF, 300);

    useEffect(() => {
        debouncedGetStaff();
    }, [currentPage]);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const loadingState = loader ? "loading" : "idle";


    const HandleDelete = async (id: any) => {
        try {
            setLoader(true);
            const responseData: any = await fetch(
                `${GETDATA}?action=DELETE.ANNOUNCEMENT&AnnouncementID=${id}`,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'DELETE.COUNTRY.DATA',
                    }),
                }
            );
            const data = await responseData.json();
            if (data.status == true) {
                GETSTAFF();
            } else {
                console.error('Failed to delete announcement.');
            }
            setLoader(false);
        } catch (err) {
            console.error(err);
            setLoader(false);
        }

    }



    return (
        <div className="grid gap-4">


            <Table aria-label="Example empty table">
                <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>Country Name</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No rows to display."}
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                >
                    {Stafflist.length > 0 ? (
                        Stafflist.map((staff: any, index: any) => (
                            <TableRow key={staff.ID}>
                                <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                                <TableCell style={{ textAlign: 'left' }}>
                                    <div><b>{staff.COUNTRY_NAME}</b></div>

                                </TableCell>
                                <TableCell onClick={() => HandleDelete(staff.ID)}>
                                    {/* Add actions here if needed */}
                                    <HighlightOffIcon />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        []
                    )}
                </TableBody>
            </Table>

            <div className="flex justify-center">
                <Pagination
                    isCompact
                    showControls
                    total={totalPages}
                    initialPage={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}

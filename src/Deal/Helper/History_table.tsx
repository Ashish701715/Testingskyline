import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { GETDATA } from "../../APIurl/url";
import { generateJWT } from "../../pages/JWT";
import { useParams } from "react-router-dom";
import './style.css';

const OrderSorting = () => {
    const [rowData, setLeadHistory] = useState([]);
    const { deal_id } = useParams();
    const isRtl = useSelector((state:any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'ID', direction: 'asc' });
    const [initialRecords, setInitialRecords] = useState([]);

    useEffect(() => {
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((JwtToken) => {
            fetch(GETDATA + '?action=get-lead-history&auth=true&view=true&edit=false', {
                method: "POST",
                headers: {
                    Authenticate: `Bearer ${JwtToken}`,
                },
                body: JSON.stringify({
                    deal_id: deal_id,
                    PAGE_REQUEST: 'GET_DEAL_PAGE_HISTORY'
                })
            }).then((response) => response.json())
              .then((data) => {
                setLeadHistory(data.data);
            });
        }).catch((err) => {
            console.warn(err);
        });
    }, [deal_id]);

    useEffect(() => {
        setInitialRecords(sortBy(rowData, 'ID'));
    }, [rowData]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        const filtered = initialRecords.filter((item:any) => (
            item.ID.toString().includes(search.toLowerCase()) ||
            item.CREATED_AT.toLowerCase().includes(search.toLowerCase()) ||
            item.CREATE_USER_NAME.toLowerCase().includes(search.toLowerCase()) ||
            item.COMMENT.toLowerCase().includes(search.toLowerCase()) ||
            item.STATUS_BEFORE.toLowerCase().includes(search.toLowerCase())
        ));
        setInitialRecords(filtered);
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const [recordsData, setRecordsData] = useState([]);

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Lead History</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className={`${isRtl ? 'whitespace-nowrap table-hover' : 'whitespace-nowrap table-hover'}`}
                        records={recordsData}
                        columns={[
                            { accessor: 'CREATED_AT', title: 'Date', sortable: true  },
                            { accessor: 'CREATE_USER_NAME', title: 'Create By' },
                            { accessor: 'COMMENT', title: 'Event Type' },
                            { accessor: 'STATUS_BEFORE', title: 'Description'},
                        ]}
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderSorting;

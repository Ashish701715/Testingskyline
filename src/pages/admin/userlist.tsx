import { Link, NavLink } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconPlus from '../../components/Icon/IconPlus';
import IconEdit from '../../components/Icon/IconEdit';
import IconEye from '../../components/Icon/IconEye';
import { GetUserAPI } from '../../APIurl/url';
import { generateJWT } from '../Authentication/JWT';


const UserList = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('UserList'));
    });
    const [items, setUserData] = useState([]);

     const [isloading, setloading] = useState(false);
        useEffect(() => {
      // Generate JWT token
      const payload = { useremail: 'ashish'};
      const secretKey = 'JwtSecret';
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
      const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
  
      const token = generateJWT(payload, secretKey, expiresIn);
  
      // Fetch user data
      token.then((JwtToken) => {
        console.log(JwtToken,"tokennn")
        setloading(true)
        const parametter = '?onlyview=true&limit=10&page=1&order=ASC&query=';            
        fetch(GetUserAPI + parametter, {
          method: 'POST',
          body: JSON.stringify({ PAGE_REQUEST: 'GetUserData' }),
          headers: {
            'Content-Type': 'application/json',
            'Authenticate': `Bearer ${JwtToken}`
          }
        })
        .then(response => response.json())
        .then(data => {
          setUserData(data.data);
          setloading(false)
        })
        .catch(error => {
          setloading(false)
          console.error('Error fetching user data:', error);
        });
      }).catch((err) => {
        console.log(err)
      });
    }, []);



    const deleteRow = (ID: any = null) => {
        if (window.confirm('Are you sure want to delete selected row ?')) {
            if (ID) {
                setRecords(items.filter((user:any) => user.ID !== ID));
                setInitialRecords(items.filter((user:any) => user.ID !== ID));
                setUserData(items.filter((user:any) => user.ID !== ID));
                setSearch('');
                setSelectedRecords([]);
            } else {
                let selectedRows = selectedRecords || [];
                const ids = selectedRows.map((d: any) => {
                    return d.ID;
                });
                const result = items.filter((d:any) => !ids.includes(d.ID as never));
                setRecords(result);
                setInitialRecords(result);
                setUserData(result);
                setSearch('');
                setSelectedRecords([]); 
                setPage(1);
            }
        }
    };

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100]; 
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(items, 'ID'));
    const [records, setRecords] = useState(initialRecords);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'ID',
        direction: 'asc',
    });

    useEffect(() => {
        setPage(1);
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);

    useEffect(() => {
        setInitialRecords(() => {
            return items.filter((item:any) => {
                return (

                    item.CLIENT_NAME.toLowerCase().includes(search.toLowerCase()) ||
                    item.CLIENT_NAME.toLowerCase().includes(search.toLowerCase()) ||
                    item.CLIENT_NAME.toLowerCase().includes(search.toLowerCase()) ||
                    item.CLIENT_NAME.toLowerCase().includes(search.toLowerCase()) ||
                    item.CLIENT_NAME.toLowerCase().includes(search.toLowerCase())
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data2 = sortBy(initialRecords, sortStatus.columnAccessor);
        setRecords(sortStatus.direction === 'desc' ? data2.reverse() : data2);
        setPage(1);
    }, [sortStatus]);

    return (
        <div className="panel px-0 border-white-light dark:border-[#1b2e4b]">
            <div className="AgentId-table">
            <div className="text-2xl mb-20"><center>Staff and Agent Data Table</center></div>
                <div className="mb-4.5 px-5 flex md:items-center md:flex-row flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <button type="button" className="btn btn-danger gap-2" onClick={() => deleteRow()}>
                            <IconTrashLines />
                            Delete
                        </button>
                        <Link to="/admin/Invoice/add" className="btn btn-primary gap-2">
                            <IconPlus />
                            Add New
                        </Link>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="datatables pagination-padding">
                    <DataTable
                        className="whitespace-nowrap table-hover AgentId-table"
                        records={records}
                        columns={[
                            {
                                accessor: 'Id',
                                sortable: true,
                                render: ({ ID }) => (
                                    <NavLink to="/admin/Invoice/preview">
                                        <div className="text-primary underline hover:no-underline font-semibold">{`#${ID}`}</div>
                                    </NavLink>
                                ),
                            },
                            {
                              accessor: 'UniqueId',
                              sortable: true,
                            },
                            {
                              accessor: 'StaffOrAgent',
                              sortable: true,
                            },
                            {
                                accessor: 'name',
                                sortable: true,
                                render: ({ CLIENT_NAME, ID }) => (
                                    <div className="flex items-center font-semibold">
                                        <div className="p-0.5 bg-white-dark/30 rounded-full w-max ltr:mr-2 rtl:ml-2">
                                            <img className="h-8 w-8 rounded-full object-cover" src={`/assets/images/profile-${ID}.jpeg`} alt="" />
                                        </div>
                                        <div>{CLIENT_NAME}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'email',
                                sortable: true,
                            },
                            
                            {
                                accessor: 'JoiningDate',
                                sortable: true,
                            },
                            {
                              accessor: 'Country',
                              sortable: true,
                          },
                            {
                                accessor: 'TotalCommision',
                                sortable: true,
                                titleClassName: 'text-right',
                                render: ({ CLIENT_EMAIL, ID }) => <div className="text-right font-semibold">{`${CLIENT_EMAIL}`}</div>,
                            },

                            {
                                accessor: 'status',
                                sortable: true,
                                render: ({ ID }) => <span className={`badge badge-outline-${ID} `}>{ID}</span>,
                            },
                            {
                                accessor: 'action',
                                title: 'Actions',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ ID }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to="/admin/Invoice/edit" className="flex hover:text-info">
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </NavLink>
                                        <NavLink to="/admin/Invoice/preview" className="flex hover:text-primary">
                                            <IconEye />
                                        </NavLink>
                                        {/* <NavLink to="" className="flex"> */}
                                        <button type="button" className="flex hover:text-danger" onClick={(e) => deleteRow(ID)}>
                                            <IconTrashLines />
                                        </button>
                                        {/* </NavLink> */}
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={initialRecords.length}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={setSelectedRecords}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserList;

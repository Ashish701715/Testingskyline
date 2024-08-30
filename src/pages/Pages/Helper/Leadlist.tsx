import React, { useState, useEffect } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
  Chip, User, Pagination, Selection, ChipProps, SortDescriptor, Spinner, Card, Tooltip
} from "@nextui-org/react";
import './style.css';
import { generateJWT } from '../../JWT';
import { GetUserAPI } from '../../../APIurl/url';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const columns = [
  { name: "STAGE", uid: "title", sortable: true },
  { name: "LEAD NAME", uid: "LEAD_NAME", sortable: true },
 
];

const INITIAL_VISIBLE_COLUMNS = ["title","LEAD_NAME"];

/**Start Function Export Default Function ************************************************************/

export default function App() {

  const MySwal = withReactContent(Swal);
  // type UserArray = User[];
  const [getuser, setUserData] = useState([]);
  const [Metadata, setmetadata] = useState([]);
  const [isloading, setloading] = useState(false);
  const [isrefresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState(10);
  const [Sortby, Setsortby] = useState('ID');
  const [Sortcall, Setsortcall] = useState('DESC');
  const [page, setPage] = React.useState(1);
  useEffect(() => {
    setRefresh(false);
    // Generate JWT token
    const payload = { useremail: 'ashish' };
    const secretKey = 'JwtSecret';
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

    const token = generateJWT(payload, secretKey, expiresIn);

    // Fetch user data
    token.then((JwtToken) => {
      setloading(true)
      const parametter = `?onlyview=true&limit=${limit}&page=${page}&order=${Sortcall}`;
      fetch(GetUserAPI + parametter, {
        method: 'POST',
        body: JSON.stringify({ PAGE_REQUEST: 'GETLEADLISTDATA',FormID :'lead' }),
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


  //STATUS change
  const handleToggleActive = (userId: number, value: string) => {
    Swal.fire({
      title: `Are you sure you want to ${value === 'Y' ? 'deactivate' : 'activate'} this user?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = { useremail: 'ashish' };
        const secretKey = 'JwtSecret';
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

        const token = generateJWT(payload, secretKey, expiresIn);

        // Fetch user data
        token.then((JwtToken) => {
          const parametter = '?ACTIVE=' + userId + '&DEACTIVE=' + value;
          fetch(GetUserAPI + parametter, {
            method: 'POST',
            body: JSON.stringify({ PAGE_REQUEST: 'Update&activeDeactive' }),
            headers: {
              'Content-Type': 'application/json',
              'Authenticate': `Bearer ${JwtToken}`
            }
          })
            .then(response => response.json())
            .then(data => {
              if (data.status == true) {
                MySwal.fire({
                  title: 'Account Status Change Successfully',
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
                  title: 'Logged In. please wait few seconds...',
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

  const statusColorMap: Record<string, ChipProps["color"]> = {
    Y: 'success',
    N: 'danger',
  };



  const renderCell = React.useCallback((user: any, columnId: any) => {
    const value = user[columnId];
    console.log(value)
    // const Leaddata= JSON.parse(user.data);
    switch (columnId) {
        
      case "LEAD_NAME":
        return (
           <>helo</>
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
           
            value={filterValue}
            onClear={() => onClear()}
          />
          <div className="flex gap-3">

            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button size="sm"  variant="flat">
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
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {metadata.totalRecord} users</span>
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
    let totalPages = Math.ceil(metadata.totalRecord / parseInt(metadata.view_Record));
    let startEntry = (metadata.page - 1) * parseInt(metadata.view_Record) + 1;
    let endEntry = Math.min(metadata.page * parseInt(metadata.view_Record), metadata.totalRecord);
    return (

      <div className="py-2 px-2 flex justify-between items-center">
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
        <span className="text-small text-default-400">
          {`Showing ${startEntry} to ${endEntry} of ${metadata.totalRecord} entries`}
        </span>
      </div>
    );
  }, [metadata, setPage]);


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
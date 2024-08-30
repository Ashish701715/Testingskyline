import React, { useState, useEffect } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
  Chip, User, Pagination, Selection, ChipProps, SortDescriptor, Spinner, Modal, ModalContent, Select, SelectItem
} from "@nextui-org/react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ChevronDownIcon } from "./ChevronDownIcon";
import { capitalize } from "./utils";
import './style.css';
import { generateJWT } from '../../pages/JWT';
import { GetUserAPI } from '../../APIurl/url';
import { DELETE } from '../../APIurl/url';
import Userprofile from '../Profile';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Token from '../../getLoggedUser/GetUserInfomation';
import debounce from 'lodash.debounce';
const columns = [
  // { name: "ID", uid: "ID", sortable: true },
  { name: "ID", uid: "#", sortable: true },
  { name: "BRANCH", uid: "BRANCH", sortable: true },
  { name: "EMAIL", uid: "CLIENT_EMAIL", sortable: true },
  { name: "NAME", uid: "CLIENT_NAME", sortable: true },
  { name: "ROLE", uid: "ROLE", sortable: true },
  { name: "STATUS", uid: "IS_ACTIVE", sortable: true },
  { name: "ACTIONS", uid: "ACTIONS" },
];

const INITIAL_VISIBLE_COLUMNS = ["CLIENT_NAME", "#", "CLIENT_EMAIL", "ROLE", "IS_ACTIVE", "ACTIONS"];

export default function App() {

  const token = Token('jwt');


  const MySwal = withReactContent(Swal);
  const [getuser, setUserData] = useState([]);
  const [Metadata, setmetadata] = useState([]);
  const [isloading, setloading] = useState(false);
  const [isrefresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState(10);
  const [Sortby, Setsortby] = useState('ID');
  const [Sortcall, Setsortcall] = useState('DESC');
  const [Selectrole, SetSelectrole] = useState('');
  const [Status, SetStatus] = useState('');
  const [page, setPage] = React.useState(1);
  const [selectedUserId, setSelectedUserId] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (key: any) => {
    SetSelectrole(key);
    setRefresh(true);
  };

  function onOpenChange(unusedArg: any) {
    if (isOpen == true) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
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

  const debouncedUserFetch = debounce(async () => {
    setloading(true);
    const parametter = `?onlyview=true&limit=${limit}&page=${page}&order=${Sortcall}`;

    try {
      const responseData: any = await fetch(GetUserAPI + parametter, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${token}`,
          'x-token-access': 'true',
        },
        body: JSON.stringify({ PAGE_REQUEST: 'GetUserData', role: Selectrole, Status: Status }),
      });
      const data = await responseData.json();
      setUserData(data.data);
      setmetadata(data);
      setloading(false)
      setloading(false);
    } catch (err) {
      setloading(false);
    }
  }, 300);


  useEffect(() => {
    debouncedUserFetch();
  }, [isrefresh, Selectrole, Status]);

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
        try {
          const parametter = '?ACTIVE=' + userId + '&DEACTIVE=' + value;
          fetch(GetUserAPI + parametter, {
            method: 'POST',
            body: JSON.stringify({ PAGE_REQUEST: 'Update&activeDeactive' }),
            headers: {
              'Content-Type': 'application/json',
              'Authenticate': `Bearer ${token}`
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

            })
            .catch(error => {

              console.error('Error fetching user data:', error);
            });
        } catch (err) {
          setloading(false);
        }
      }
    });
  };

  //Delect user data
  const UserDelete = (userId: number) => {
    Swal.fire({
      title: `Are you sure you want to delete user Account?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          fetch(DELETE, {
            method: 'POST',
            body: JSON.stringify({ PAGE_REQUEST: 'DELETE_USER', USER_ID: userId }),
            headers: {
              'Content-Type': 'application/json',
              'Authenticate': `Bearer ${token}`
            }
          })
            .then(response => response.json())
            .then(data => {
              if (data.status == true) {
                MySwal.fire({
                  title: 'Account Delete Successfully',
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
            })
            .catch(error => {

              console.error('Error fetching user data:', error);
            });

        } catch (err) {
          setloading(false);
        }

      }
    });
  };





  const statusColorMap: Record<string, ChipProps["color"]> = {
    Y: 'success',
    N: 'danger',
  };



  const renderCell = React.useCallback((user: any, columnId: any, index: number) => {
    const value = user[columnId];
    switch (columnId) {
      case "#":
        return (
          <>{index + 1}</>
        );
      case "CLIENT_NAME":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.PROFILE_URL }}

            name={value}
          >
            {user.CLIENT_NAME}
          </User>
        );
      case "ROLE":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{value}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{user.NAME}</p>
          </div>
        );
      case "IS_ACTIVE":
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600"
            color={statusColorMap[String(value)]}
            size="sm"
            variant="dot"
            style={{ cursor: 'pointer' }}
            onClick={() => handleToggleActive(user.ID, value)}
          >
            {value === 'Y' ? 'Active' : 'Deactive'}
          </Chip>
        );

      case "ACTIONS":
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
              <DropdownItem key="edit" onClick={() => UPDATEPROFILE(user.CLIENT_ID)}>Edit Profile</DropdownItem>
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


  const topContent = React.useMemo(() => {
    return (
      <>


        <div className="flex justify-end gap-3">
          <Select
            size={"sm"}
            placeholder="Status"
            className="max-w-[200px] "
            onChange={(e) => SetStatus(e.target.value)}
          >
            <SelectItem key="Y">
              Active
            </SelectItem>
            <SelectItem key="N">
              Deactive
            </SelectItem>
          </Select>

          <Select
            size={"sm"}
            placeholder="role"
            className="max-w-[150px] "
            onChange={(e) => SetSelectrole(e.target.value)}
          >
            <SelectItem key="agent">
              Agent
            </SelectItem>
            <SelectItem key="staff">
              Staff
            </SelectItem>
          </Select>

          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button size="sm" endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
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
      </>
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
          total={totalPages || 1}
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
        className="table_phone"
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
            {/* <ModalHeader className="flex flex-col gap-1">Invite User</ModalHeader> */}
            <Userprofile selectedUserId={selectedUserId || ''} />
          </ModalContent>

        </Modal>
      </div >


    </div>

  );
}
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react"
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { v1GETDATA } from '../../../APIurl/url';
import { useParams, NavLink } from 'react-router-dom';
import Blank from '../../../staff/LeadApplication/tab/blank';
import debounce from 'lodash.debounce';
const ApplicationHistory = () => {

  const [loader, setloader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const token = jwt('jwt');
  const { client_id } = useParams();
  const { file_id } = useParams();
  const [loaddata, setloaddata] = useState(true);
  const [ApplicationTotal, setApplicaton] = useState([]);


  const debouncedTotalapplication = debounce(async () => {
    setloaddata(true);
    try {
      const res = await fetch(v1GETDATA, {
        method: 'POST',
        headers: {
          Authenticate: `Bearer ${token}`,
          'x-token-access': `true`,
        },
        body: JSON.stringify({
          PAGE_REQUEST: 'Total.applications.json.History.Staff',
          ClientId: client_id,
          FileID: file_id,
        }),
      });
      const data = await res.json();
      setApplicaton(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setloaddata(false);
    }
  }, 300);


  useEffect(() => {
    debouncedTotalapplication();
  }, []);

  return (
    <>
      <Table removeWrapper aria-label="Example static collection table" className="table6">
        <TableHeader className="set_border_th_bg_color">
          <TableColumn className="app_history_table_heading">Date Added</TableColumn>
          <TableColumn className="app_history_table_heading">Comment</TableColumn>
          <TableColumn className="app_history_table_heading">Status</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No Application history."}>
          {ApplicationTotal.map((Applicat: any, index: any) => (
            <TableRow key={index}>
              <TableCell data-column="Date Added">{Applicat.ACTION_DATE}</TableCell>
              <TableCell data-column="Commen">{Applicat.COMMENT}</TableCell>
              <TableCell data-column="Status"><div dangerouslySetInnerHTML={{ __html: Applicat.NOTES }} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </>
  );
};

export default ApplicationHistory;

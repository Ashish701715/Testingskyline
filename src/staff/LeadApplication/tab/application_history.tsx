import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react"
const ApplicationHistory = () => {
    return (
        <>
        <Table removeWrapper aria-label="Example static collection table">
      <TableHeader className="set_border_th_bg_color">
        <TableColumn className="app_history_table_heading">Date Added</TableColumn>
        <TableColumn className="app_history_table_heading">Comment</TableColumn>
        <TableColumn className="app_history_table_heading">Status</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key="1">
          <TableCell className="table_heading">12-Jun-2024 5:45:AM</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow key="2">
          <TableCell className="table_heading">12-Jun-2024 5:45:AM</TableCell>
          <TableCell  className="table_font_app">
                    <p>Dear Team,&nbsp;</p>
                    <p>We tried to contact you but could not connect.</p>
                    <p>Kindly note that we are not doing&nbsp;foundation&nbsp;courses for this university.</p>
                    <p>Hence we suggest&nbsp;University of Bradford International College - International Business and Management BSc (Hons), SEP24 intake through&nbsp;OIEG.</p>
                    <p>Kindly confirm with the&nbsp;student and revert us back with new SOP.</p>
            </TableCell>
            <TableCell className="table_font_app">
                Application Received <br />
                Secondary Status:<span> Pending</span>
            </TableCell>
        </TableRow>
        <TableRow key="3">
          <TableCell className="table_heading">12-Jun-2024 5:45:AM </TableCell>
          <TableCell className="table_font_app ">
                <p>Dear Team,&nbsp;</p>
                <p>We tried to contact you but could not connect.</p>
                <p>Kindly note that we are not doing&nbsp;foundation&nbsp;courses for this university.</p>
                <p>Hence we suggest&nbsp;University of Bradford International College - International Business and Management BSc (Hons), SEP24 intake through&nbsp;OIEG.</p>
                <p>Kindly confirm with the&nbsp;student and revert us back with new SOP.</p>
            </TableCell>
            <TableCell className="table_font_app">
                Application Received <br />
                Secondary Status:<span>Acvite</span>
            </TableCell>
        </TableRow>
        <TableRow key="4">
          <TableCell className="table_heading">12-Jun-2024 5:45:AM </TableCell>
          <TableCell className="table_font_app">
                Application Received <br />
                Secondary Status:<span> Pending</span>
            </TableCell>
          <TableCell className="table_font_app">
                Application Received <br />
                Secondary Status:<span> Pending</span>
            </TableCell>
        </TableRow>
      </TableBody>
    </Table>
           
        </>
    );
};

export default ApplicationHistory;

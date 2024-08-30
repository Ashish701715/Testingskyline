import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react';
import AddNewCourse from '../helper_modal/NewCourseEnroll';
import { useEffect, useState } from 'react';
import { GETDATA } from '../../../APIurl/url';
import { useParams } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { Chip } from '@nextui-org/chip';
import OfferLetterView from '../helper_modal/ViewOfferLetter';
import { Spin } from 'antd';
import "../style.css";
interface CourseProps {
    className: string;
    ClientInformation: any;
}
const Course: React.FC<CourseProps> = ({ className, ClientInformation }) => {
    const token = jwt('jwt');
    const { file_id } = useParams();
    const { client_id } = useParams();
    const { encrypt_id } = useParams();

    const [OfferLetter, setOfferletter] = useState([]);
    const [loaddata, setloader] = useState(false);
    const getData = async () => {
        setloader(true);
        const response = await fetch(GETDATA + '?action=client_application-offerltter', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${token}`,
                'x-token-access': 'true',
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'STUDENT_APPLICATION_OFFERLETTER',
                file_id: file_id,
                client_id: client_id,
                encrypt_id: encrypt_id,
            }),
        });

        const data = await response.json();
        setOfferletter(data.data);
        setloader(false);
    };

    useEffect(() => {
        getData();
    }, []);

    console.log(OfferLetter);
    return (
        <>
            <AddNewCourse ClientData={(ClientInformation)} />
            <Table aria-label="Example static collection table" className='table5'>
                <TableHeader>
                    <TableColumn className="app_history_table_heading">University Name</TableColumn>
                    <TableColumn className="app_history_table_heading">Course Name</TableColumn>
                    <TableColumn className="app_history_table_heading">Application Fees</TableColumn>
                    <TableColumn className="app_history_table_heading">Responsive Person</TableColumn>
                    <TableColumn className="app_history_table_heading">Application Create Date</TableColumn>
                    <TableColumn className="app_history_table_heading">Last Modification</TableColumn>
                    <TableColumn className="app_history_table_heading">Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Please wait load data..."}>
                    {loaddata ? (
                        []
                    ) : (
                        OfferLetter.map((value: any, index) => (
                            <TableRow key={index}>
                                <TableCell className="table_font_app" data-column="University Name">{value?.UNIVERSITY_NAME}</TableCell>
                                <TableCell className="table_font_app" data-column="Course Name">
                                    {value.COURSE_NAME}
                                    <small className="font-Nunito">
                                        <br />
                                        Intake:
                                        <strong>
                                            {value.INTAKE_MONTH} {value.INTAKE_YEAR}
                                        </strong>
                                        <br />
                                    </small>
                                </TableCell>
                                <TableCell className="table_font_app" data-column="Application Fees">{value.APPLICATION_FEE}</TableCell>

                                <TableCell className="table_font_app" data-column="Responsive Person">
                                    {value.RESPONSIVE_PERSON_NAME}
                                    <small>
                                        <br />
                                        email:
                                        <strong>{value?.RESPONSIVE_PERSON_EMAIL}</strong>
                                        <br />
                                    </small>
                                </TableCell>
                                <TableCell className="table_font_app" data-column="Application Create Date">{value.OFFER_LETTER_CREATE}</TableCell>
                                <TableCell className="table_font_app" data-column="Last Modification">
                                    {value.OFFER_LETTER_UPDATE}
                                    <small>
                                        <br />
                                        Current Status:
                                        <strong>
                                            {' '}
                                            <Chip color="primary" size="sm">
                                                {value.CURRENT_STATUS_STAGE}
                                            </Chip>{' '}
                                        </strong>
                                        <br />
                                    </small>
                                </TableCell>
                                <TableCell className="table_font_app" data-column="Action">
                                    <OfferLetterView  data-column="Action" application_data={value} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </>

    );
};

export default Course;

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { GETDATA } from '../../../APIurl/url';
import { useParams } from 'react-router-dom';
import { MoreOutlined } from '@ant-design/icons';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Spinner } from '@nextui-org/react';
import { Chip } from '@nextui-org/chip';
import OfferLetterView from '../../../staff/application/helper_modal/ViewOfferLetter';
import { Spin } from 'antd';
interface CourseProps {
    FileID: any;
}
const Course: React.FC<CourseProps> = ({ FileID }) => {
    const token = jwt('jwt');
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
                file_id: FileID,
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
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn className="app_history_table_heading">University Name</TableColumn>
                    <TableColumn className="app_history_table_heading">Course Name</TableColumn>
                    <TableColumn className="app_history_table_heading">Application Fees</TableColumn>
                    <TableColumn className="app_history_table_heading">Responsive Person</TableColumn>
                    <TableColumn className="app_history_table_heading">Application Create Date</TableColumn>
                    <TableColumn className="app_history_table_heading">Last Modification</TableColumn>
                    <TableColumn className="app_history_table_heading">Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"Please wait load data..."}
                    loadingContent={<Spinner size="lg" />}
                    loadingState={loaddata ? 'loading' : 'idle'}
                >
                    {loaddata ? (
                        []
                    ) : (
                        OfferLetter.map((value: any, index) => (
                            <TableRow key={index}>
                                <TableCell className="table_font_app">{value?.UNIVERSITY_NAME}</TableCell>
                                <TableCell className="table_font_app">
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
                                <TableCell className="table_font_app">{value.APPLICATION_FEE}</TableCell>

                                <TableCell className="table_font_app">
                                    {value.RESPONSIVE_PERSON_NAME}
                                    <small>
                                        <br />
                                        email:
                                        <strong>{value?.RESPONSIVE_PERSON_EMAIL}</strong>
                                        <br />
                                    </small>
                                </TableCell>
                                <TableCell className="table_font_app">{value.OFFER_LETTER_CREATE}</TableCell>
                                <TableCell className="table_font_app">
                                    {value.OFFER_LETTER_UPDATE}
                                    <small>
                                        <br />
                                        Current Status:
                                        <strong>
                                            {' '}
                                            <Chip color="secondary" size="sm">
                                                {value.CURRENT_STATUS_STAGE}
                                            </Chip>{' '}
                                        </strong>
                                        <br />
                                    </small>
                                </TableCell>
                                <TableCell className="table_font_app">
                                    <OfferLetterView application_data={value} />
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

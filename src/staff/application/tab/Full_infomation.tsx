import { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import Token from '../../../getLoggedUser/GetUserInfomation';
import { v1GETDATA } from '../../../APIurl/url';
import Blank from '../tab/blank';
const Fullview = ({ isOpen, onClose, client_id, encrypt_id }: any) => {
    const [clientData, setClientData]: any = useState([]);
    const JwtToken = Token('jwt');
    const Client = async () => {
        const payload = { REQUEST: 'STUDENT_DATA', is_Admin: false, isValid: true };
        const secretKey = 'JwtSecret';
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

        try {
            const responseData: any = await fetch(v1GETDATA + '?action=view.client.record', {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${JwtToken}`,
                    'x-token-access': 'true',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'STUDENT_DATA_VIEW_FULL_RECORD',
                    RequesterUser: 'agent',
                    ClientId: client_id,
                    Encrypt_id: encrypt_id,
                }),
            });
            const data = await responseData.json();
            setClientData(data.data);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {

        Client();
    }, []);


    let EDUCATIONSUMMARY = clientData.length > 0 && clientData[0].EDUCATIONSUMMARY;
    let TESTSCORESSUMMARY = clientData.length > 0 && clientData[0].TESTSCORESSUMMARY;
    let parsedTestScores = TESTSCORESSUMMARY ? JSON.parse(TESTSCORESSUMMARY) : [];
    let shouldRenderTable = parsedTestScores.length > 0 && (
        parsedTestScores[0]?.COUNTRY_OF_INSTITUTION == 'IELTS' ||
        parsedTestScores[0]?.COUNTRY_OF_INSTITUTION == 'PTE' ||
        parsedTestScores[0]?.COUNTRY_OF_INSTITUTION == 'CAEL' ||
        parsedTestScores[0]?.COUNTRY_OF_INSTITUTION == 'CECPIP' ||
        parsedTestScores[0]?.COUNTRY_OF_INSTITUTION == 'TOEFL'
    );
    let DUOLINGO = parsedTestScores.length > 0 && parsedTestScores[0]?.COUNTRY_OF_INSTITUTION == 'DUOLINGO';


    return (
        <>
            <Modal
                size='5xl'
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior={'inside'}

            >


                <ModalContent >
                    <>
                        <ModalHeader className="flex flex-col gap-1">Student data</ModalHeader>
                        {!clientData || clientData.length === 0 ? <Blank /> : (
                            <ModalBody className="h-23">
                                <div className="">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Services</ModalHeader>

                                    <ul>
                                        {JSON.parse(clientData[0].SERVICES_NAME).map((service: any) => (
                                            <li>{service}</li>
                                        ))}
                                    </ul>




                                </div>
                                <div className="grid gap-3">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Personal Information</ModalHeader>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="First Name" value={clientData[0].FIRST_NAME} disabled />
                                        <Input type="text" variant='underlined' label="Middle Name" value={clientData[0].MIDDLE_NAME} disabled />
                                        <Input type="text" variant='underlined' label="Last Name" value={clientData[0].LAST_NAME} disabled />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Date of Birth" value={clientData[0].DATE_OF_BIRTH} disabled />
                                        <Input type="text" variant='underlined' label="First Language" value={clientData[0].FIRST_LANGUAGE} disabled />
                                        <Input type="text" variant='underlined' label="Country of Citizenship" value={clientData[0].COUNTRY_OF_CITIZENSHIP} disabled />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Passport Number" value={clientData[0].PASSPORT_NUMBER} disabled />
                                        <Input type="text" variant='underlined' label="Passport Expiry Date" value={clientData[0].PASSPORT_EXPIRY_DATE} disabled />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Marital Status" value={clientData[0].MARITAL_STATUS} disabled />
                                        <Input type="text" variant='underlined' label="Gender" value={clientData[0].GENDER} disabled />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Address Detail</ModalHeader>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Address" value={clientData[0].ADDRESS} disabled />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="City/Town" value={clientData[0].CITY} disabled />
                                        <Input type="text" variant='underlined' label="Country" value="" disabled />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Province/State" value={clientData[0].PROVINCE} disabled />
                                        <Input type="text" variant='underlined' label="Postal/Zip Code" value={clientData[0].POSTAL_CODE} disabled />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Email" value={clientData[0].EMAIL} disabled />
                                        <Input type="text" variant='underlined' label="Phone Number" value={clientData[0].PHONE_NUMBER} disabled />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Education Summary</ModalHeader>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Country of Education" value={EDUCATIONSUMMARY ? JSON.parse(clientData[0].EDUCATIONSUMMARY)[0]?.COUNTRY_OF_EDUCATION : ''} disabled />
                                        <Input type="text" variant='underlined' label="Highest Level of Education" value={EDUCATIONSUMMARY ? JSON.parse(clientData[0].EDUCATIONSUMMARY)[0]?.HIGHEST_LEVEL_OF_EDUCATION : ''} disabled />
                                        <Input type="text" variant='underlined' label="Grading Scheme" value={EDUCATIONSUMMARY ? JSON.parse(clientData[0].EDUCATIONSUMMARY)[0]?.GRADING_SCHEME : ''} disabled />

                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Grade Average" value={EDUCATIONSUMMARY ? JSON.parse(clientData[0].EDUCATIONSUMMARY)[0]?.GRADE_AVERAGE : ''} disabled />
                                        <Input type="text" variant='underlined' label="Graduated from most recent school" value={EDUCATIONSUMMARY ? JSON.parse(clientData[0].EDUCATIONSUMMARY)[0]?.GRADUATED_FROM_MOST_RECENT_SCHOOL == 1 ? 'yes' : 'no' : ''} disabled />
                                    </div>

                                </div>

                                <div className="grid gap-3 snap-x min-w-96">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Schools Attended</ModalHeader>
                                    <ScrollShadow orientation="horizontal" className="max-w-[1000px] ">
                                        <Table aria-label="Example static collection table snap-center" >
                                            <TableHeader>
                                                <TableColumn>Country of Institution</TableColumn>
                                                <TableColumn>Name of Institution</TableColumn>
                                                <TableColumn>Level of Education</TableColumn>
                                                <TableColumn>Primary Language of Instruction</TableColumn>
                                                <TableColumn>Attended Institution From</TableColumn>
                                                <TableColumn>Attended Institution To</TableColumn>
                                                <TableColumn>Degree Name</TableColumn>
                                                <TableColumn>I have graduated from this institution</TableColumn>
                                                <TableColumn>Graduation Date</TableColumn>
                                                <TableColumn>physical certificate</TableColumn>
                                                <TableColumn>Address</TableColumn>
                                                <TableColumn>City/Town</TableColumn>
                                                <TableColumn>Province/State</TableColumn>
                                                <TableColumn>Postal/Zip Code</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {JSON.parse(clientData[0].SCHOOLSDATA).map((Infoschool: any, index: any) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{Infoschool.COUNTRY_OF_INSTITUTION}</TableCell>
                                                        <TableCell>{Infoschool.NAME_OF_INSTITUTION}</TableCell>
                                                        <TableCell>{Infoschool.LEVEL_OF_EDUCATION}</TableCell>
                                                        <TableCell>{Infoschool.PRIMARY_LANGUAGE_OF_INSTRUCTION}</TableCell>
                                                        <TableCell>{Infoschool.ATTENDED_FROM}</TableCell>
                                                        <TableCell>{Infoschool.ATTENDED_TO}</TableCell>
                                                        <TableCell>{Infoschool.DEGREE_NAME}</TableCell>
                                                        <TableCell>{Infoschool.DID_NOT_GRADUATE == '1' ? 'YES' : 'NO'}</TableCell>
                                                        <TableCell>{Infoschool.GRADUATION_DATE}</TableCell>
                                                        <TableCell>{Infoschool.PHYSICAL_CERTIFICATE == '1' ? 'YES' : 'NO'}</TableCell>
                                                        <TableCell>{Infoschool.ADDRESS}</TableCell>
                                                        <TableCell>{Infoschool.CITY}</TableCell>
                                                        <TableCell>{Infoschool.PROVINCE}</TableCell>
                                                        <TableCell>{Infoschool.POSTAL_CODE}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </ScrollShadow>
                                </div>


                                <div className="grid gap-3">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Background Information</ModalHeader>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Have you been refused a visa from Canada, the USA, the United Kingdom, New Zealand, Australia or Ireland?*" value={clientData[0].VISA_REFUSAL == 1 ? 'Yes' : 'No'} disabled />
                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Do you have a valid Study Permit / Visa?" value={clientData[0]?.VALID_STUDY_PERMIT != "" ? JSON.parse(clientData[0]?.VALID_STUDY_PERMIT) || [] : ''} disabled />
                                    </div>

                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="If you answered  Yes to any of the questions above, please provide more details below" value={clientData[0].ADDITIONAL_DETAILS} disabled />
                                    </div>

                                </div>

                                <div className="grid gap-3">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Test Scores</ModalHeader>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="Country of Institution" value={parsedTestScores[0]?.COUNTRY_OF_INSTITUTION} disabled />
                                    </div>
                                    {shouldRenderTable ? (
                                        <Table aria-label="Example static collection table">
                                            <TableHeader>
                                                <TableColumn>Date of Exam</TableColumn>
                                                <TableColumn>Listening</TableColumn>
                                                <TableColumn>Reading</TableColumn>
                                                <TableColumn>Writing</TableColumn>
                                                <TableColumn>Speaking</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {/* Assuming you map through actual data here */}
                                                {parsedTestScores.map((score: any, index: any) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{score.DATE_OF_EXAM}</TableCell>
                                                        <TableCell>{score.LISTENING_SCORE}</TableCell>
                                                        <TableCell>{score.READING_SCORE}</TableCell>
                                                        <TableCell>{score.WRITING_SCORE}</TableCell>
                                                        <TableCell>{score.SPEAKING_SCORE}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        DUOLINGO && (
                                            <Table aria-label="Example static collection table">
                                                <TableHeader>
                                                    <TableColumn>Date of Exam</TableColumn>
                                                    <TableColumn>Enter Exact Scores</TableColumn>

                                                </TableHeader>
                                                <TableBody>
                                                    {/* Assuming you map through actual data here */}
                                                    {parsedTestScores.map((score: any, index: any) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{score.DATE_OF_EXAM}</TableCell>
                                                            <TableCell>{score.TOTALEXACT}</TableCell>

                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        )
                                    )}

                                </div>

                                <div className="grid gap-3">
                                    <ModalHeader className="py-2 px-0 underline underline-offset-8">Additional Qualifications</ModalHeader>
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="I have GRE exam scores" value={clientData[0].HAS_GRE_SCORES == '1' ? 'YES' : 'NO'} disabled />
                                    </div>
                                    {clientData[0].HAS_GRE_SCORES == '1' ? (
                                        <Table aria-label="Example static collection table">
                                            <TableHeader>
                                                <TableColumn>GRE Exam Date</TableColumn>
                                                <TableColumn>Verbal</TableColumn>
                                                <TableColumn>Quantitative</TableColumn>
                                                <TableColumn>Writing</TableColumn>
                                                <TableColumn>Rank Verbal</TableColumn>
                                                <TableColumn>Rank Quantitative</TableColumn>
                                                <TableColumn>Rank Writing</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow key="1">
                                                    <TableCell>{clientData[0].GRE_EXAM_DATE}</TableCell>
                                                    <TableCell>{clientData[0].GRE_VERBAL_SCORE}</TableCell>
                                                    <TableCell>{clientData[0].GRE_QUANTITATIVE_SCORE}</TableCell>
                                                    <TableCell>{clientData[0].GRE_WRITING_SCORE}</TableCell>
                                                    <TableCell>{clientData[0].GRE_VERBAL_RANK}</TableCell>
                                                    <TableCell>{clientData[0].GRE_QUANTITATIVE_RANK}</TableCell>
                                                    <TableCell>{clientData[0].GRE_WRITING_RANK}</TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    ) : ('')}
                                    <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                        <Input type="text" variant='underlined' label="I have GMAT exam scores" value={clientData[0].HAS_GMAT_SCORES == '1' ? 'YES' : 'NO'} disabled />
                                    </div>

                                    {clientData[0].HAS_GMAT_SCORES == '1' ? (
                                        <Table aria-label="Example static collection table">
                                            <TableHeader>
                                                <TableColumn>GMAT Exam Date</TableColumn>
                                                <TableColumn>Verbal</TableColumn>
                                                <TableColumn>Quantitative</TableColumn>
                                                <TableColumn>Writing</TableColumn>
                                                <TableColumn>Rank Verbal</TableColumn>
                                                <TableColumn>Rank Quantitative</TableColumn>
                                                <TableColumn>Rank Writing</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow key="1">
                                                    <TableCell>{clientData[0].GMAT_EXAM_DATE}</TableCell>
                                                    <TableCell>{clientData[0].GMAT_VERBAL_SCORE}</TableCell>
                                                    <TableCell>{clientData[0].GMAT_QUANTITATIVE_SCORE}</TableCell>
                                                    <TableCell>{clientData[0].GMAT_WRITING_SCORE}</TableCell>
                                                    <TableCell>{clientData[0].GMAT_VERBAL_RANK}</TableCell>
                                                    <TableCell>{clientData[0].GMAT_QUANTITATIVE_RANK}</TableCell>
                                                    <TableCell>{clientData[0].GMAT_WRITING_RANK}</TableCell>
                                                </TableRow>

                                            </TableBody>
                                        </Table>
                                    ) : ('')}
                                </div>
                            </ModalBody>
                        )}
                        <ModalFooter>
                            <Button className="btn-primary" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>

            </Modal>
        </>
    );
};

export default Fullview;

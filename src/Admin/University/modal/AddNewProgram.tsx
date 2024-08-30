import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, notification } from 'antd';
import { Button } from '@nextui-org/react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { InsertAction } from '../../../FormHandler/InsertAction';
import { university_Api } from '../../../APIurl/url';
import token from '../../../getLoggedUser/GetUserInfomation';
import { Editor } from 'primereact/editor';
import { Collapse, Divider } from 'antd';
import './modal-phone.css';

const App: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [api, contextHolder] = notification.useNotification();
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const { universityId } = useParams();
    const jwttoken = token('jwt');
    const formRef: any = useRef<HTMLFormElement>(null);
    const [loader, setloader] = useState(false);
    const handleFormData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setloader(true);
        const formData = new FormData(formRef.current);
        formData.append('PAGE_REQUEST', 'INSERT_PROGRAM_FORM_DATA_C');
        formData.append('universityId', universityId ? universityId : '0');
        const Header = {
            Authenticate: `Bearer ${jwttoken}`,
        };
        const response = await InsertAction(university_Api, formData, 'POST', Header);
        if (response.status === false) {
            formRef.current.reset();
            api['error']({
                message: response.message,
            });
        } else {
            api['success']({
                message: response.message,
            });
            formRef.current.reset();
        }
        setloader(false);
    };

    const [ExamData, setExamData] = useState([]);

    useEffect(() => {
        const ExamData = fetch('/Exam.json');
        ExamData.then((res) => {
            return res.json();
        }).then((data) => {
            const ExamDataOption = data.map((Exams: any, index: number) => ({
                id: index + 1,
                value: Exams.value,
                label: Exams.value,
            }));
            setExamData(ExamDataOption);
        });
    }, []);

    const ProgramAndfees = () => {
        return (
            <div className="font-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 ">
                        <label htmlFor="name">
                            Program Level <span className="text-danger">*</span>
                        </label>
                        <Input id="name" type="text" name="UNIVERSITY_PROGRAMS_FEES[PROGRAM_LEVEL]" placeholder="Enter Program Name " className="design_input" />
                    </div>
                    <div className="space-y-2 ">
                        <label htmlFor="name">
                            Program Length <span className="text-danger">*</span>
                        </label>
                        <Input id="name" type="text" name="UNIVERSITY_PROGRAMS_FEES[PROGRAM_LENGTH]" placeholder="Enter Campus name" className="design_input" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    <div className="space-y-2 ">
                        <label htmlFor="name">
                            Cost of Living<span className="text-danger">*</span>
                        </label>
                        <Input id="name" type="text" name="UNIVERSITY_PROGRAMS_FEES[COST_OF_LIVING]" placeholder="Enter Program Name " className="design_input" />
                    </div>
                    <div className="space-y-2 ">
                        <label htmlFor="name">
                            Gross Tuition <span className="text-danger">*</span>
                        </label>
                        <Input id="name" type="text" name="UNIVERSITY_PROGRAMS_FEES[GROSS_TUITION]" placeholder="Enter Campus name" className="design_input" />
                    </div>
                    <div className="space-y-2 ">
                        <label htmlFor="name">
                            Application Fee <span className="text-danger">*</span>
                        </label>
                        <Input id="name" type="text" name="UNIVERSITY_PROGRAMS_FEES[APPLICATION_FEE]" placeholder="Enter Campus name" className="design_input" />
                    </div>
                </div>
            </div>
        );
    };

    const AddmissionRequrement = () => {
        return (
            <div className="font-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 ">
                        <label htmlFor="name">
                            Minimum Level of Education Completed <span className="text-danger">*</span>
                        </label>
                        <Input id="name" type="text" name="UNIVERSITY_PROGRAM_ADMISSION_REQUIREMENTS[REQUIREMENT_TYPE]" placeholder="Enter Program Name " className="design_input" />
                    </div>
                    <div className="space-y-2 ">
                        <label htmlFor="name">
                            Minimum GPA <span className="text-danger">*</span>
                        </label>
                        <Input id="name" type="text" name="UNIVERSITY_PROGRAM_ADMISSION_REQUIREMENTS[GPA]" placeholder="Enter Campus name" className="design_input" />
                    </div>
                </div>
            </div>
        );
    };

    const LanguageTestScore = () => {
        const [LanguageScoreField, setLanguageScoreField]: any = useState([]);

        const selectExamData = (index: any, value: any) => {
            const updatedFields = LanguageScoreField.map((field: any, i: any) => (i === index ? { ...field, exam: value } : field));
            setLanguageScoreField(updatedFields);
        };

        const handleScoreChange = (index: any, name: any, value: any) => {
            const updatedFields = LanguageScoreField.map((field: any, i: any) => (i === index ? { ...field, scores: { ...field.scores, [name]: value } } : field));
            setLanguageScoreField(updatedFields);
        };

        const addField = () => {
            setLanguageScoreField([...LanguageScoreField, { exam: '', scores: {} }]);
        };

        const removeField = (index: any) => {
            setLanguageScoreField(LanguageScoreField.filter((_: any, i: any) => i !== index));
        };

        return (
            <div className="font-thin">
                {LanguageScoreField.map((field: any, index: any) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
                        <div className="space-y-2">
                            <label htmlFor={`exams-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Select an option
                            </label>
                            <select id={`exams-${index}`} name='UNIVERSITY_PROGRAM_MINIMUM_LANGUAGE_TEST_SCORES[TEST_NAME][]' className="design_input p-3" value={field.exam} onChange={(e) => selectExamData(index, e.target.value)}>
                                <option value="">Choose an exam</option>
                                {ExamData.map((exam: any, idx) => (
                                    <option key={idx} value={exam.value}>
                                        {exam.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(field.exam === 'IELTS' || field.exam === 'PTE' || field.exam === 'CAEL' || field.exam === 'CECPIP' || field.exam === 'TOEFL') && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor={`reading-${index}`}>
                                        Reading <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        id={`reading-${index}`}
                                        type="text"
                                        name="UNIVERSITY_PROGRAM_MINIMUM_LANGUAGE_TEST_SCORES[MINIMUM_READING_SCORE][]"
                                        placeholder="Enter Reading score"
                                        className="design_input"
                                        value={field.scores.reading || ''}
                                        onChange={(e) => handleScoreChange(index, 'reading', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={`writing-${index}`}>
                                        Writing <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        id={`writing-${index}`}
                                        type="text"
                                        name="UNIVERSITY_PROGRAM_MINIMUM_LANGUAGE_TEST_SCORES[MINIMUM_WRITING_SCORE][]"
                                        placeholder="Enter Writing score"
                                        className="design_input"
                                        value={field.scores.writing || ''}
                                        onChange={(e) => handleScoreChange(index, 'writing', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={`listening-${index}`}>
                                        Listening <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        id={`listening-${index}`}
                                        type="text"
                                        name="UNIVERSITY_PROGRAM_MINIMUM_LANGUAGE_TEST_SCORES[MINIMUM_LISTENING_SCORE][]"
                                        placeholder="Enter Listening score"
                                        className="design_input"
                                        value={field.scores.listening || ''}
                                        onChange={(e) => handleScoreChange(index, 'listening', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={`speaking-${index}`}>
                                        Speaking <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        id={`speaking-${index}`}
                                        type="text"
                                        name="UNIVERSITY_PROGRAM_MINIMUM_LANGUAGE_TEST_SCORES[MINIMUM_SPEAKING_SCORE][]"
                                        placeholder="Enter Speaking score"
                                        className="design_input"
                                        value={field.scores.speaking || ''}
                                        onChange={(e) => handleScoreChange(index, 'speaking', e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                        {field.exam === 'DUOLINGO' && (
                            <div className="space-y-2">
                                <label htmlFor={`exactScores-${index}`}>
                                    Enter Exact Scores <span className="text-danger">*</span>
                                </label>
                                <Input
                                    id={`exactScores-${index}`}
                                    type="text"
                                    name="UNIVERSITY_PROGRAM_MINIMUM_LANGUAGE_TEST_SCORES[MINIMUM_TOTAL_SCORE][]"
                                    placeholder="Enter Exact Scores"
                                    className="design_input"
                                    value={field.scores.exactScores || ''}
                                    onChange={(e) => handleScoreChange(index, 'exactScores', e.target.value)}
                                />
                            </div>
                        )}
                        <button type="button" onClick={() => removeField(index)} className="self-center md:mt-6 mt-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 text-danger">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addField} className="mt-4  btn-primary">
                    Add more
                </button>
            </div>
        );
    };

    const ProgramIntakes = () => {
        const [intakes, setIntakes] = useState([{ intakeDay: '', submissionDateDay: '', SubmissionMonth: '', submissionCloseDay: '', closeintakeMonth: '', showyear: '', closingYear: '', intakeMonth: '' }]);
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
        const days = Array.from({ length: 31 }, (_, i) => i + 1);

        const addField = () => {
            setIntakes([...intakes, { intakeDay: '', submissionDateDay: '', SubmissionMonth: '', submissionCloseDay: '', closeintakeMonth: '', showyear: '', closingYear: '', intakeMonth: '' }]);
        };

        const removeField = (index: number) => {
            setIntakes(intakes.filter((_, i) => i !== index));
        };

        const handleChange = (index: number, field: string, value: string) => {
            const updatedIntakes = intakes.map((intake, i) => (i === index ? { ...intake, [field]: value } : intake));
            setIntakes(updatedIntakes);
        };

        return (
            <div className="font-thin">
                {intakes.map((intake, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="space-y-2">
                            <label htmlFor={`intakeMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Intake Month <span className="text-danger">*</span>
                            </label>
                            <select
                                id={`intakeMonth-${index}`}
                                name={`UNIVERSITY_PROGRAM_INTAKES_DATA[PROGRAM_INTAKE_MONTH][]`}
                                className="design_input p-3"
                                value={intake.intakeMonth}
                                onChange={(e) => handleChange(index, 'intakeMonth', e.target.value)}
                            >
                                <option value="">Choose a month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor={`submissionDateDay-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Submission Date <span className="text-danger">*</span>
                            </label>
                            <select
                                id={`submissionDateDay-${index}`}
                                name={`UNIVERSITY_PROGRAM_INTAKES_DATA[APPLICATION_SUBMISSION_DATE][]`}
                                className="design_input p-3"
                                value={intake.submissionDateDay}
                                onChange={(e) => handleChange(index, 'submissionDateDay', e.target.value)}
                            >
                                <option value="">Choose a day</option>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor={`submissionCloseMonth-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Submission Month <span className="text-danger">*</span>
                            </label>
                            <select
                                id={`submissionCloseMonth-${index}`}
                                name={`UNIVERSITY_PROGRAM_INTAKES_DATA[APPLICATION_SUBMISSION_MONTH][]`}
                                className="design_input p-3"
                                value={intake.SubmissionMonth}
                                onChange={(e) => handleChange(index, 'SubmissionMonth', e.target.value)}
                            >
                                <option value="">Choose a month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor={`submissionCloseDay-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Submission Close Day <span className="text-danger">*</span>
                            </label>
                            <select
                                id={`submissionCloseDay-${index}`}
                                name={`UNIVERSITY_PROGRAM_INTAKES_DATA[APPLICATION_CLOSING_DATE][]`}
                                className="design_input p-3"
                                value={intake.submissionCloseDay}
                                onChange={(e) => handleChange(index, 'submissionCloseDay', e.target.value)}
                            >
                                <option value="">Choose a day</option>
                                {days.map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor={`submissionCloseDay-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Submission Close Month <span className="text-danger">*</span>
                            </label>
                            <select
                                id={`submissionCloseMonth-${index}`}
                                name={`UNIVERSITY_PROGRAM_INTAKES_DATA[APPLICATION_CLOSING_MONTH][]`}
                                className="design_input p-3"
                                value={intake.closeintakeMonth}
                                onChange={(e) => handleChange(index, 'closeintakeMonth', e.target.value)}
                            >
                                <option value="">Choose a month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i} value={i + 1}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor={`closingYear-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                View Intake Year <span className="text-danger">*</span>
                            </label>
                            <select
                                id={`closingYear-${index}`}
                                name={`UNIVERSITY_PROGRAM_INTAKES_DATA[SHOW_RESULT_YEAR][]`}
                                className="design_input p-3"
                                value={intake.showyear}
                                onChange={(e) => handleChange(index, 'showyear', e.target.value)}
                            >
                                <option value="">Choose a year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor={`hiddenClosingYear-${index}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Hidden Intake Year <span className="text-danger">*</span>
                            </label>
                            <select
                                id={`hiddenClosingYear-${index}`}
                                name={`UNIVERSITY_PROGRAM_INTAKES_DATA[CLOSE_RESULT_YEAR][]`}
                                className="design_input p-3"
                                value={intake.closingYear}
                                onChange={(e) => handleChange(index, 'closingYear', e.target.value)}
                            >
                                <option value="">Choose a year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="button" onClick={() => removeField(index)} className="self-center md:mt-6 mt-0 text-danger">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 text-danger">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addField}
                    className="btn  btn-primary"
                >
                    Add New Intake
                </button>
            </div>
        );
    };


    return (
        <>
            <button className="btn btn-primary" type="button" onClick={showDrawer}>
                Add New Program
            </button>
            {contextHolder}
            <Drawer
                title="Add Program"
                onClose={onClose}
                open={open}
                placement="left"
                className="university_modal_css"
                extra={
                    <div className="flex">
                        <Button onClick={onClose} className="btn btn-primary mr-2">
                            Cancel
                        </Button>
                        <Button
                            isLoading={loader}
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }}
                        >
                            {loader ? 'Loading...' : 'Submit'}
                        </Button>
                    </div>
                }
            >
                <div className="w-full">
                    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
                        <form className="bg-background rounded-lg  p-2  grid gap-6" onSubmit={handleFormData} ref={formRef}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 ">
                                    <label htmlFor="name">
                                        Program Name <span className="text-danger">*</span>
                                    </label>
                                    <Input id="name" type="text" name="Program_name" placeholder="Enter Program Name " className="design_input" />
                                </div>
                                <div className="space-y-2 ">
                                    <label htmlFor="name">
                                        Campus Name <span className="text-danger">*</span>
                                    </label>
                                    <Input id="name" type="text" name="program_Campusname" placeholder="Enter Campus name" className="design_input" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                                <div className="space-y-2">
                                    <label htmlFor="street">
                                        Country Name <span className="text-danger">*</span>
                                    </label>
                                    <Input id="street" type="text" name="program_country" placeholder="Enter country address" className="design_input" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="city">
                                        City <span className="text-danger">*</span>
                                    </label>
                                    <Input id="city" type="text" name="program_city" placeholder="Enter city" className="design_input" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="zip">
                                        Zip Code <span className="text-danger">*</span>
                                    </label>
                                    <Input id="zip" type="text" name="program_zip_code" placeholder="Enter zip code" className="design_input" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description">
                                    Full Address <span className="text-danger">*</span>
                                </label>
                                <Input id="email" type="email" name="programAddress" placeholder="Enter full address" className="design_input" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description">
                                    University Description <span className="text-danger">*</span>
                                </label>
                                <Editor value={text} onTextChange={(e: any) => setText(e.htmlValue)} style={{ height: '320px' }} className="rounded-xl " />
                                <input type="hidden" name="ProgramDescription" value={text} />
                            </div>

                            <Collapse className="font-semibold" size="large" items={[{ key: '1', label: 'Program & Fees', children: <ProgramAndfees /> }]} />

                            <Collapse className="font-semibold" size="large" items={[{ key: '1', label: 'Admission Requirements', children: <AddmissionRequrement /> }]} />

                            <Collapse className="font-semibold" size="large" items={[{ key: '1', label: 'Minimum Language Test Scores', children: <LanguageTestScore /> }]} />

                            <Collapse className="font-semibold" size="large" items={[{ key: '1', label: 'Program Intakes', children: <ProgramIntakes /> }]} />
                        </form>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default App;

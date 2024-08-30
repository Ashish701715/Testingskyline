import React, { useState, useEffect } from 'react';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import IconButton from '@mui/joy/IconButton';
import Chip from '@mui/material/Chip';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { NavLink } from 'react-router-dom';
import { Button, Divider } from "@nextui-org/react";
import FileUpload from './FileUpload';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useDispatch, useSelector } from 'react-redux';
import {Socket} from '../../../server/server';

export default function ExampleTextareaComment() {
    
    const [reminder, setReminder] = useState({
        date: new Date(),
        time: new Date(),
    });

    useEffect(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        setReminder({ ...reminder, date: tomorrow, time: tomorrow });
    }, []);

    const formattedDate = reminder.date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const formattedTime = reminder.time.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const [reminderTime, setReminderTime] = useState(name);
    const [personName, setPersonName] = useState<string[]>([]);
    const [Reminder, setReminders] = useState('reminders');
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [textValue, setTextValue] = useState('');
    const [file, setFile] = useState(null);

    const handleChange = (event:any) => {
        setTextValue(event.target.value);
    };

    const handleFileChange = (file:any) => {
        setFile(file);
    };

    const toggleFileUpload = () => {
        setShowFileUpload(!showFileUpload);
    };

    const handleSubmit = () => {
        const formData = {
            reminder,
            reminderTime,
            personName,
            Reminder,
            textValue,
            file
        };
    };


    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (date:any) => {
        setSelectedDate(date);
        setShowDatePicker(false);
    };

    const dispatch = useDispatch();
    const isRtl = useSelector((state:any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [date2, setDate2] = useState<any>('2022-07-05 12:00');

    return (
        <FormControl>
            <Textarea
                required
                placeholder="Type something here…"
                minRows={3}
                value={textValue}
                onChange={handleChange}
                endDecorator={
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 'var(--Textarea-paddingBlock)',
                            pt: 'var(--Textarea-paddingBlock)',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            flex: 'auto',
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                        </svg>

                        <div onClick={() => setShowDatePicker(!showDatePicker)} style={{ display: 'inline-block', cursor: 'pointer' }}>
                            <Chip
                                icon={<KeyboardArrowDown />}
                                label={selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
                                clickable
                            />
                        </div>
                        {showDatePicker && (
                            <Flatpickr
                                value={selectedDate || new Date()}
                                onChange={handleDateChange}
                                options={{
                                    dateFormat: 'm/d/Y',
                                }}
                            />
                        )}

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                        <IconButton>
                            <div>
                                <Popover placement="bottom" showArrow offset={10}>
                                    <PopoverTrigger>
                                    <Chip
                                        label="Set Reminder"
                                        icon={<KeyboardArrowDown />}
                                    />

                                    </PopoverTrigger>
                                    <PopoverContent >
                                        <NavLink to="#" onClick={() => { setReminders('When Event Start') }} >When Event Start</NavLink>
                                        <NavLink to="#" onClick={() => { setReminders('15 Min') }} >15 minutes Before</NavLink>
                                        <NavLink to="#" onClick={() => { setReminders('30 Min') }} >30 minutes Before</NavLink>
                                        <NavLink to="#" onClick={() => { setReminders('1 hour') }} >1 hour Before</NavLink>
                                        <NavLink to="#" onClick={() => { setReminders('2 hour') }} >2 hour Before</NavLink>
                                        <NavLink to="#" onClick={() => { setReminders('1 day') }} >1 day Before</NavLink>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </IconButton>

                        <button className='ml-auto' onClick={toggleFileUpload}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                        </button>
                    </Box>
                }
            />

            {showFileUpload && <FileUpload onChange={handleFileChange} />}
            <Divider className='mt-3 mb-3' />
            <div className="button">
                <Button color="primary" className="ml-2 mr-2" variant="solid" size='sm' onClick={handleSubmit}>SAVE</Button>
                <Button color="primary" variant="faded" size='sm'>CANCEL</Button>
            </div>
        </FormControl>
    );
}

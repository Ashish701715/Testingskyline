import Dropdown from '../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import { IRootState } from '../../store';
import { useState, useEffect, useRef } from 'react';
import { generateJWT } from '../../pages/JWT';
import { GetUserAPI } from '../../APIurl/url';
import { GetsUserAPI } from '../../APIurl/url';
import { useParams } from "react-router-dom";
import Card from '@mui/material/Card';
import { NavLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { Socket } from '../../server/server';
import Tooltip from '@mui/material/Tooltip';
import { Avatar, AvatarGroup, Chip } from "@nextui-org/react";
import { User } from "@nextui-org/user";
import ColorPicker from '../../pages/Pages/Helper/color_picker';
import '../Task_style.css';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import Notification from '../../notification/Notification';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const authTokenLocalStorage = localStorage.getItem('auth_token');
const Scrumboard = () => {

    const CheckIcon = ({

    }) => {
        return (
            <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"

            >
                <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16.78 9.7L11.11 15.37C10.97 15.51 10.78 15.59 10.58 15.59C10.38 15.59 10.19 15.51 10.05 15.37L7.22 12.54C6.93 12.25 6.93 11.77 7.22 11.48C7.51 11.19 7.99 11.19 8.28 11.48L10.58 13.78L15.72 8.64C16.01 8.35 16.49 8.35 16.78 8.64C17.07 8.93 17.07 9.4 16.78 9.7Z" fill="currentColor" />
            </svg>
        );
    };

    const MySwal = withReactContent(Swal);
    // Notification();
    // color picker
    const [color, setColor] = useState('#000000'); // Initial color

    const handleColorChange = (e: any) => {
        setColor(e.target.value);
    };

    const { page_name } = useParams();
    const [karbanData, projectList] = useState<any>([]);
    const [Refresh, setrefresh] = useState(false);
    const [editTitle, setEdittitle] = useState(false);
    const [projects, setProject] = useState({ title: '' });
    const [bgcolor, setBgColor] = useState("");



    //Url paramter 
    const [lastID, setlastID] = useState('all');
    const [newRecord, setnewRecord] = useState(null);
    const [Limit, SetLimit] = useState(150);
    const [page, Setpage] = useState(1);
    const [lead_Source, SetSource] = useState('all');
    const [GetDate, SetGetDate] = useState('all');


    // this default load page 
    useEffect(() => {

        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token
            .then((JwtToken) => {
                let url = `lastid=${lastID}&newRecord=${newRecord}&limit=${Limit}&page=${page}&sources=${lead_Source}&getdate=${GetDate}`;
                fetch(GetsUserAPI + `?view=karban.lead&${url}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authenticate: `Bearer ${JwtToken}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: "karban.data.Task",
                        AUTH_ID: authTokenLocalStorage
                    }),
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {

                        const newData = data.data;
                        projectList(newData);
                        setrefresh(false)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    }, [Refresh]);


    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const containerRef = useRef<HTMLDivElement>(null);
    const handleDrag = (evt: any) => {
        const dragEvent = evt.nativeEvent;
        // Get the container element
        const container = containerRef.current;

        if (container) {
            if (dragEvent.movementX > 0) {
                container.scrollLeft += 10;
            } else {
                container.scrollLeft -= 10;
            }
        }
    };



    const [DragItem, setDrgaItem] = useState(false);
    const [OldDragItem, setOldDragItem] = useState(false);
    const [onDragNew, setDrgaINewtems] = useState();
    const [ItmeId, setItmeId] = useState();

    useEffect(() => {
        if (DragItem && OldDragItem && onDragNew && ItmeId) {
            const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
            const secretKey = "JwtSecret";
            const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
            const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
            const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
            const token = generateJWT(payload, secretKey, expiresIn);
            token
                .then((JwtToken) => {
                    fetch(GetsUserAPI + '?edit=karban.lead.deadline.dragItem', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authenticate: `Bearer ${JwtToken}`,
                        },
                        body: JSON.stringify({
                            PAGE_REQUEST: "karban.data.update.deadline",
                            // FormID: page_name,
                            Oldstage: OldDragItem,
                            Newstage: onDragNew,
                            ItemId: ItmeId,
                            AUTH_ID: authTokenLocalStorage,
                            OLDDEALINE: authTokenLocalStorage,

                        }),
                    })
                        .then((res) => {
                            return res.json();
                        })
                        .then((data) => {
                            if (data.status == true) {
                                setlastID(ItmeId)
                                MySwal.fire({
                                    title: 'Deadline Status Changed.',
                                    toast: true,
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 2000,
                                    showCloseButton: true,
                                    customClass: {
                                        popup: `color-default`,
                                    },
                                });
                                setrefresh(true)
                            } else {
                                MySwal.fire({
                                    title: 'Lead Status Not Changed.',
                                    toast: true,
                                    position: 'top-end',
                                    showConfirmButton: false,
                                    timer: 2000,
                                    showCloseButton: true,
                                    customClass: {
                                        popup: `color-danger`,
                                    },
                                });
                            }

                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [DragItem, OldDragItem, onDragNew, ItmeId]);

    const handleDrags = (event: any, NewColumnId: any) => {
        // console.log(event);
        const oldvalue = event.from.getAttribute('id');
        setOldDragItem(oldvalue);
        setDrgaINewtems(NewColumnId);
        setItmeId(event.item.getAttribute('data-id'));
    };


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };


    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    const yourHandleColorChangeFunction = (colorCode: string) => {
        setBgColor(colorCode);
    };

    const Dateformat = (datetimeString: any) => {
        if (!datetimeString) {
            return "No Deadline";
        }
        const date = new Date(datetimeString);
        const monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

        return `${month} ${day}, ${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    // Create time check 
    const formatDates = (createdAt: any) => {
        const date = new Date(createdAt);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diff / (1000 * 60));
        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes} minute(s) ago`;
        } else if (diffMinutes < 60 * 6) {
            return `${Math.floor(diffMinutes / 60)} hour(s) ago`;
        } else {
            return `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}`;
        }
    };


    const UserProfileLink = (userData: any) => {
        return (
            <Tooltip title={userData.CLIENT_NAME}>
                <NavLink to={`/users/profile`} className='mr-2'>
                    <Avatar
                        alt={userData.CLIENT_NAME}
                        src={userData.PROFILE_URL}
                        size="sm"
                    />
                </NavLink>
            </Tooltip>

        );
    };


    const ASSingeUserProfileLink = (userData: any) => {
        return (
            <AvatarGroup isBordered max={3} total={userData.length} size="sm" >
                {userData.map((assignment: any, index: any) => (
                    <Tooltip title={assignment.CLIENT_NAME}>
                        <Avatar key={index} src={assignment.PROFILE_URL} />
                    </Tooltip>    // Assuming 'PROFILE_URL' contains the URL of the avatar
                ))}
            </AvatarGroup>

        );
    };

    function truncateText(text: any, maxLength: any) {
        // Split the text into words
        const words = text.split(' ');

        // If the number of words is less than or equal to maxLength, return the original text
        if (words.length <= maxLength) {
            return text;
        }

        // Otherwise, join the first maxLength words and append ellipsis
        return words.slice(0, maxLength).join(' ') + '...';
    }

    return (
        <div className="relative pt-1 overflow-x-auto" onDrag={handleDrag} ref={containerRef}>
            <div className="flex gap-5 pb-2 px-2">
                {karbanData.map((project: any) => (
                    <div key={project.STAGE_ID} className="Task_panel w-80 flex-none bg-transform">
                        <div className="element-with-background flex justify-between mb-5 border p-1" style={{ borderRadius: '5px', color: project.TEXT_COLOR, fontWeight: '700', background: bgcolor ? bgcolor : project.BG_COLOR }}>

                            <h4 className="text-sm" >
                                {project.STAGE_NAME} <span>({project.data.length})</span>
                            </h4>


                        </div>

                        {/* //misscontants */}

                        <div className="w-[100%] h-[600px] shadow-none" style={{ overflow: 'auto' }}>
                            <ReactSortable
                                list={project.data}
                                setList={(newState) => {
                                    const newList = karbanData.map((task: any) => {
                                        if (task.STAGE_ID === project.STAGE_ID) {
                                            task.data = newState;
                                            setDrgaItem(true)
                                        }
                                        return task;
                                    });

                                }}
                                animation={200}
                                group="shared"
                                ghostClass="sortable-ghost"
                                dragClass="sortable-drag"
                                className="connect-sorting-content  min-h-[100%]"
                                id={project.STAGE_ID}
                                onAdd={(evt) => handleDrags(evt, project.STAGE_ID)}
                            >
                                {project.data.map((task: any, index: any) => (
                                    <div key={task.TASKID} >
                                        <Card className='h-[100%] mx-2 mb-2 crm-kanban-item-line sortable-list' key={task.TASKID} data-drop={task.TASKID} style={{ borderLeft: `3px solid ` + project.BG_COLOR, background: '#ffffffc4' }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Grid>
                                                    {/* Heading Section */}
                                                    <ul>
                                                        <li className='mt-2 ml-2'>
                                                            <NavLink to={`/page/company/task/View/${task.TASKTOKEN}/${task.TASKID}`}>
                                                                <span className='font-semibold text-black'>{task.TITLE}</span>
                                                            </NavLink>
                                                        </li>
                                                        <li className='ml-2'>
                                                            <p>{formatDate(task.CREATE_AT)}</p>
                                                        </li>
                                                    </ul>

                                                    {/* Information header */}
                                                    <ul className='mb-2 mt-5 move-icon'>
                                                        <li className='mt-2 ml-2'>
                                                            <span className='font-thin text-black'>DESCRIPTION</span>
                                                        </li>
                                                        <li className='ml-2'>
                                                            <li className='ml-2'>
                                                                <p className='font-normal text-stone-600' dangerouslySetInnerHTML={{ __html: truncateText(task.DESCRIPTION, 50) }}></p>
                                                            </li>

                                                        </li>

                                                        <li className='mt-2 ml-2'>
                                                            <span className='font-thin text-black'>PRIORITY</span>
                                                        </li>
                                                        <li className='ml-2'>
                                                            <p className='font-normal text-stone-600'>{task.PRIORITY}</p>
                                                        </li>

                                                        <li className='mt-2 ml-2'>
                                                            <span className='font-thin text-black'>DEADLINE</span>
                                                        </li>
                                                        <li className='ml-2'>
                                                            <p className='font-normal text-stone-600'>
                                                                {task.DEADLINE ? (
                                                                    <Chip
                                                                        startContent={new Date(task.DEADLINE) < new Date() ? "" : <CheckIcon />}
                                                                        variant="faded"
                                                                        color={new Date(task.DEADLINE) < new Date() ? "danger" : "success"}
                                                                    >
                                                                        {Dateformat(task.DEADLINE)}
                                                                    </Chip>
                                                                ) : (
                                                                    "No Deadline"
                                                                )}
                                                            </p>
                                                        </li>

                                                        <li className='mt-2 ml-2'>
                                                            <div className='flex '>
                                                                {/* <span className='text-black font-semibold'>CREATE BY : </span> */}
                                                                {UserProfileLink(JSON.parse(task.CREATE_USER))}

                                                                <p className='px-1'><ArrowForwardIosIcon fontSize="small" /></p>

                                                                {ASSingeUserProfileLink(JSON.parse(task.ASSIGNMENTS_USER))}

                                                            </div>



                                                        </li>

                                                    </ul>
                                                </Grid>
                                                {/* <ul className='flex justify-between mb-3 mt-2'>
                                                    <li className='ml-2'></li>
                                                    <li className='flex' >
                                                        <span className='mr-5'>{formatDates(task.CREATE_AT)}</span>
                                                        {UserProfileLink(JSON.parse(task.CREATE_BY))}
                                                    </li>
                                                </ul> */}
                                            </Box>
                                        </Card>
                                    </div>
                                ))}
                            </ReactSortable>
                        </div>

                    </ div>
                ))}
            </div>
        </div>
    );
};
export default Scrumboard;

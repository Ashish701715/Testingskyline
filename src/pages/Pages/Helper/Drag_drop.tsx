import Dropdown from '../../../components/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import { IRootState } from '../../../store';
import { useState, useEffect ,useRef } from 'react';
import { generateJWT } from '../../JWT';
import { GetUserAPI } from '../../../APIurl/url';
import { useParams } from "react-router-dom";
import Card from '@mui/material/Card';
import { NavLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import {Socket} from '../../../server/server';
import Tooltip from '@mui/material/Tooltip';
import ColorPicker from './color_picker';
import './style.css'; ;
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const Scrumboard = () => {
  const MySwal = withReactContent(Swal);
    // color picker
    const [color, setColor] = useState('#000000'); // Initial color

    const handleColorChange = (e:any) => {
        setColor(e.target.value);
    }; 

    const { page_name } = useParams();
    const [karbanData, projectList ] = useState<any>([]);
    const [Refresh, setrefresh] = useState(false);
    const [editTitle , setEdittitle] = useState(false);
    const [projects, setProject] = useState({ title: '' });
    const [bgcolor , setBgColor] = useState("");



    //Url paramter 
    const [lastID , setlastID] = useState('all'); 
    const [newRecord , setnewRecord] = useState(null); 
    const [Limit , SetLimit] = useState(150); 
    const [page , Setpage] = useState(1); 
    const [lead_Source , SetSource] = useState('all'); 
    const [GetDate , SetGetDate] = useState('all'); 
    

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
          fetch(GetUserAPI + `?view=karban.lead&${url}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authenticate: `Bearer ${JwtToken}`,
            },
            body: JSON.stringify({
              PAGE_REQUEST: "karban.data.lead",
              FormID: page_name,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              setrefresh(false);
              const newData = data.data;
              projectList(newData);
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

  

    const [DragItem , setDrgaItem] = useState(false);
    const [OldDragItem ,  setOldDragItem] = useState(false);
    const [onDragNew ,  setDrgaINewtems] = useState(); 
    const [ItmeId , setItmeId] = useState();
   
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
                    fetch(GetUserAPI+'?edit=karban.lead.dragItem', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authenticate: `Bearer ${JwtToken}`,
                        },
                        body: JSON.stringify({
                            PAGE_REQUEST: "karban.data.update",
                            FormID: page_name,
                            Oldstage: OldDragItem,
                            Newstage: onDragNew,
                            ItemId: ItmeId,
                            USER_ID:1
                        }),
                    })
                        .then((res) => {
                            return res.json();
                        })
                        .then((data) => {
                          if(data.status==true)
                            {
                              Socket.send(JSON.stringify({status:true,'load':'lead-drag'}))
                              setlastID(ItmeId)
                              MySwal.fire({
                                title: 'Lead Status Changed.',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 2000,
                                showCloseButton: true,
                                customClass: {
                                    popup: `color-default`,
                                },
                              });

                            }else{
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


    Socket.addEventListener('message', function (event) {
      const Object = JSON.parse(event.data);
      if(Object.load=='lead-drag'){
        // setrefresh(true);
        console.log('call apiss')
      }
    });

    const handleDrags = (event: any, NewColumnId: any) => {
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

    const handleClick = (event:any) => {
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

    // Create time check 
    const formatDates = (createdAt:any) => {
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


    const UserProfileLink = (userData:any) => {
        return (
          <Tooltip title={userData.USER_NAME}>
              <NavLink to={`/user/profile/${userData.USER_ID}`} className='mr-2'>
                  <Avatar
                    alt={userData.USER_NAME}
                    src={userData.URL}
                    sx={{ width: 24, height: 24 }}
                  />
              </NavLink>
          </Tooltip>
            
        );
    };

    return (
    <div className="relative pt-1 overflow-x-auto" ref={containerRef}>
    <div className="flex gap-5 pb-2 px-2">
        {karbanData.map((project:any) => (
            <div key={project.StageID} className="panel w-80 flex-none bg-transform border-none">
              <div className="element-with-background flex justify-between mb-5  p-1" style={{ borderRadius: '5px', color:  project.txt_color, fontWeight: '700',  background: bgcolor ? bgcolor : project.bg  }}>
                  {editTitle ? (
                      <input 
                          type="text" 
                          value={projects.title} 
                          className='text-black font-thin border-1'
                          onChange={(e) => setProject({...projects, title: e.target.value})}
                      />
                  ) : (
                      <h4 className="text-xs" style={{ lineHeight: '25px', fontWeight: '700' }}>
                          {project.title} <span>({project.data.length})</span>
                      </h4>
                  )}
                  <div className="flex items-center">
                    {/* Edit Section Header title */}
                    {editTitle ? (
                   <>

                      <NavLink to="#" className='ml-5'>
                      {/* aria-describedby={id} onClick={handleClick} */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-6 mr-2">
                          <path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 0 0-3.471 2.987 10.04 10.04 0 0 1 4.815 4.815 18.748 18.748 0 0 0 2.987-3.472l3.386-5.079A1.902 1.902 0 0 0 20.599 1.5Zm-8.3 14.025a18.76 18.76 0 0 0 1.896-1.207 8.026 8.026 0 0 0-4.513-4.513A18.75 18.75 0 0 0 8.475 11.7l-.278.5a5.26 5.26 0 0 1 3.601 3.602l.502-.278ZM6.75 13.5A3.75 3.75 0 0 0 3 17.25a1.5 1.5 0 0 1-1.601 1.497.75.75 0 0 0-.7 1.123 5.25 5.25 0 0 0 9.8-2.62 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
                        </svg>
                      </NavLink>
                      
                      <Popover
                        className='box-shodw-none'
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                      >
                        <Typography sx={{ p: 2 }}>
                           <ColorPicker handleColorChange={yourHandleColorChangeFunction} />
                        </Typography>
                      </Popover>

                   </>

                    ) : (
                    null
                    )}

                   

                  </div>
              </div>
              <div className=" set_w_and_h shadow-none" style={{overflow:'auto'}}>
              <ReactSortable
                  list={project.data}
                  setList={(newState) => {
                      const newList = karbanData.map((task:any) => {
                          if (task.StageID === project.StageID) {
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
                  id={project.StageID}
                  onAdd={(evt) => handleDrags(evt, project.StageID)}
              >
                  {project.data.map((task:any , index:any) => (
                    <div key={task.ID} >
                      <Card className='h-[100%] mx-2 mb-2 crm-kanban-item-line sortable-list' key={task.ID} data-drop={task.ENCRYPT_ID} style={{borderLeft: `3px solid `+ project.bg , background:'#ffffffc4'}}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid className="col_desgin">
                          <ul>
                            <li className="pb-2">
                              <NavLink to={`/page/view/deal/${task.ID}`}>
                                <span className="main_heading">
                                  {JSON.parse(task.LEAD_INFORMATION).FIRST_NAME + ' ' + JSON.parse(task.LEAD_INFORMATION).LAST_NAME}
                                </span>
                              </NavLink>
                            </li>
                          </ul>

                          {/* {/ Information header /} */}
                          <ul className=" move-icon">
                            <li className="">
                              <span className="heading_design_col">
                               NAME
                              </span>
                            </li>
                            <li className="">
                              <p className="normal_content">
                              {JSON.parse(task.LEAD_INFORMATION).FIRST_NAME +' '+ JSON.parse(task.LEAD_INFORMATION).LAST_NAME}
                              </p>
                            </li>  

                            <li className="">
                              <span className="heading_design_col">
                                EMAIL
                              </span>
                            </li>
                            <li className="">
                              <p className="normal_content">
                              {JSON.parse(task.LEAD_INFORMATION).EMAIL}
                              </p>
                            </li>

                            <li className="">
                              <span className="heading_design_col">
                                PHONE_NUMBER
                              </span>
                            </li>
                            <li className="">
                              <p className="normal_content">
                              {JSON.parse(task.LEAD_INFORMATION).PHONE_NUMBER}
                              </p>
                            </li>
                            
                            <li className="">
                              <span className="heading_design_col">
                                ADDRESS
                              </span>
                            </li>
                            <li className="">
                              {JSON.parse(task.LEAD_INFORMATION).ADDRESS}
                            </li>

                            <li className="">
                              <span className="heading_design_col">
                                CITY
                              </span>
                            </li>
                            <li className="">
                              {JSON.parse(task.LEAD_INFORMATION).CITY}
                            </li>
                          </ul>
                        </Grid>
                        <ul className="flex justify-between mb-3 mt-2">
                          <li className=""></li>
                          <li className="flex">
                            <span className="mr-2">
                            {formatDates(JSON.parse(task.LEAD_INFORMATION).CREATE_AT)}
                            </span>
                            <Avatar title={JSON.parse(task.LEAD_OWNER).CLIENT_NAME} src={JSON.parse(task.LEAD_OWNER).PROFILE_URL}  sx={{ width: 24, height: 24 }} className="mr-2" alt={JSON.parse(task.LEAD_OWNER).CLIENT_NAME} />
                          </li>
                        </ul>
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


import { useEffect, useState, useRef, useMemo } from 'react';
const { TextArea } = Input;
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { INSERTDATA } from '../../../APIurl/url';
import { GETDATA } from '../../../APIurl/url';
import { useParams, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Blank from '../tab/blank';
import { Button} from '@nextui-org/react';
import { Dropdown, message, Space, Tooltip, MenuProps, Input, DatePicker, Checkbox, Select, Col, Row, Empty, Tag, Avatar } from 'antd';
import { DownOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons';
import type { SearchProps } from 'antd/es/input/Search';
/**
 * App component that renders a comment form with a select input, text input, and text area.
 *
 * @param {object} props - Component props
 * @param {string} props.className - CSS class name for the component
 */
const App = ({ className }: any) => {
    const MySwal = withReactContent(Swal);
    /**
     * State to store the selected values in the select input.
     */
    const [selectedValues, setselectedValues] = useState<string[]>([]);

    /**
     * Handles changes to the select input.
     *
     * @param {any} value - Selected value(s) in the select input
     */
    const userSelectChange = (value: any) => {
        if (value.includes('All_Memmber')) {
            const filteredValue: any = ['All_Memmber'];
            setselectedValues(filteredValue);
        } else {
            console.log(value);
            setselectedValues(value);
        }
    };

    /**
     * Handles the comment form submission.
     *
     * @param {Event} e - Form submission event
     */
    interface CommentData {
        ID: number;
        COMMENT_ID: number;
        COMMENT_RELETED: string;
        COMMENT_TEXT: string;
        IS_PUBLIC: boolean;
        COMMENT_DATE: string;
        COMMENT_LAST_UPDATE: string;
        RESPONSIVE_PERSON_NAME: string;
        RESPONSIVE_PERSON_PROFILE_URL: string;
        RESPONSIVE_PERSON_ID: number;
        RESPONSIVE_PERSON_EMAIL: string;
    }

    const token = jwt('jwt');
    const { client_id } = useParams();
    const [loader, setloader] = useState(false);
    const [refresh, setrefresh] = useState(false);
    const OnHandleCommentForm = async (e: any) => {
        setloader(true);
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('PAGE_REQUEST', 'INSERT.COMMENT.USERPROFILE.INSERT');
        formData.append('client_id', client_id || '');
        selectedValues.forEach((value) => {
            formData.append('tagUserMember[]', value);
        });
        try {
            const res = await fetch(INSERTDATA + '?action=insertComment', {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': `true`,
                },
                body: formData,
            });

            const response = await res.json();
            if (response.status == true) {
                MySwal.fire({
                    title: response.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                }).then(() => {
                    e.target.reset();
                });
            } else {
                MySwal.fire({
                    title: response.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-danger`,
                    },
                });
            }
        } catch (err) {
            MySwal.fire({
                title: 'Error your form and form components please refresh page and try again',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-success`,
                },
            });
        }
        setloader(false);
    };
    console.log(loader)
    const { RangePicker } = DatePicker;
    const [loaddata, setloaddata] = useState(true);

    const [limit, setlimit] = useState(10);
    const [page, setpage] = useState(1);
    const [daterange, setdaterange] = useState('');
    const [userby, setuserBy] = useState('');
    const [totalData, settotalData] = useState(0);
    const [CommentData, setCommentdata] = useState<CommentData[]>([]);

    const Commentfetch = async () => {
        setloaddata(true);
        const res = await fetch(GETDATA + `?limit=${limit}&page=${page}&daterange=${daterange}&userby=${userby}`, {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${token}`,
                'x-token-access': `true`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'CLIENT_FILE_COMMENT_DATA_LIST',
                ClientId: client_id,
            }),
        });
        const data = await res.json();
        settotalData(data.total);
        setCommentdata((prevData) => {
            // const newComments = data.data.filter((newComment: CommentData) => !prevData.some((existingComment) => existingComment.COMMENT_ID === newComment.COMMENT_ID));
            return [...prevData, ...data.data];
        });
        setloaddata(false);
    };
    useEffect(() => {
        Commentfetch();
    }, [page, refresh]);

    function date_formatchange(date: any) {
        const dateFormat = new Date(date);

        const dateGet = dateFormat.getDate();
        const MonthGet = dateFormat.toLocaleString('default', { month: 'short' });
        const YearGet = dateFormat.getFullYear();
        return `${MonthGet} ${dateGet}, ${YearGet}`;
    }

    const scrollRef = useRef<HTMLDivElement>(null);
    const handleScrolldataget = (e: any) => {
        const element = e.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            setpage(page + 1);
        }
    };

    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            element.addEventListener('scroll', handleScrolldataget);
        }
        return () => {
            if (element) {
                element.removeEventListener('scroll', handleScrolldataget);
            }
        };
    }, []);
    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        message.info('Click on left button.');
        console.log('click left button', e);
      };
      
      const handleMenuClick: MenuProps['onClick'] = (e) => {
        message.info('Click on menu item.');
        console.log('click', e);
      };
      const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
      const { Search } = Input;

        const suffix = (
        <AudioOutlined
            style={{
            fontSize: 16,
            color: '#1677ff',
            }}
        />
        );
    const items: MenuProps['items'] = [
        {
          label: '1st User',
          key: '1',
          icon: <UserOutlined />,
        },
        {
          label: '2nd User',
          key: '2',
          icon: <UserOutlined />,
        },
        {
          label: '3rd User',
          key: '3',
          icon: <UserOutlined />,
          danger: true,
        },
        {
          label: '4rd User',
          key: '4',
          icon: <UserOutlined />,
          danger: true,
          disabled: true,
        },
      ];
      const menuProps = {
        items,
        onClick: handleMenuClick,
      };
    return (
        <Row>
            <Col span={9}>
                <div className="set_border">
                    <form onSubmit={OnHandleCommentForm}>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            className="design_input"
                            placeholder="Tag user Commnet User"
                            value={selectedValues}
                            onChange={(value) => {
                                userSelectChange(value);
                            }}
                            options={[
                                { value: 'All_Memmber', label: 'All Member' },
                                { value: 'jack', label: 'Jack' },
                                { value: 'lucy', label: 'Lucy' },
                                { value: 'Yiminghe', label: 'yiminghe' },
                            ]}
                        />
                        <Input placeholder="Provide Application Related Comment " className="mt-5 design_input" name="CommentApplicationReletive" />

                        <TextArea rows={4} className="mt-5 design_input font-Nunito" placeholder="Enter Your Comment..." name="CommentText" />
                        <div className="mt-2">
                            <Checkbox className="font-meduim font-Nunito" name="public_Comment">
                                Public Comment
                            </Checkbox>
                        </div>
                        <div className="submit-button-comment mt-10 justify-end">
                            <Button className="btn rounded-full hover-none font-Nunito" isLoading={loader} type='submit'>Submit Comment</Button>
                        </div>
                    </form>
                </div>
            </Col>
            {/* <Col span={2}></Col> */}
            <Col offset={1} span={14} ref={scrollRef} style={{ height: '400px', overflowY: 'scroll' }}>
            <Row className='sticky_tab_header'>
                <Col span={8}>
                <div className="filter-class">
                    <ul className="flex">
                        <li>
                            <RangePicker className="design_input" />
                        </li>
                    </ul>
                </div>
                </Col>
                
                <Col span={12}>   
                {/* <Space direction="vertical">
                    <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
                </Space> */}
                </Col>
                <Col span={4}>  
                    <Dropdown menu={menuProps}>
                        <Button className="design_input">
                            <Space>
                            Select User
                            <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
                
                <table id="filehistory" className="table table-borderless">
                    <tbody className="scroller-class-table">
                        {loaddata ? (
                            <Blank />
                        ) : (
                            <>
                                {CommentData.map((value: any, index: number) => (
                                    <tr key={index}>
                                        <td width="10%" valign="top">
                                            <img src={value.RESPONSIVE_PERSON_PROFILE_URL} />
                                        </td>
                                        <td width="75%">
                                            <p>
                                                <span className="Comment_heading ">Comment By : {value.RESPONSIVE_PERSON_NAME}</span>
                                                <br/>
                                                <span className="small_text mt-0 pt-0">{date_formatchange(value.COMMENT_DATE)}</span>
                                                <br />
                                                <span className="table_font_app">{value.COMMENT_TEXT}</span>
                                            </p>
                                            <hr/>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </Col>
            <div className="fix-bottom">
                <span className="background-rounded font-Nunito">Total Record: {totalData}</span>
            </div>
        </Row>
    );
};
export default App;

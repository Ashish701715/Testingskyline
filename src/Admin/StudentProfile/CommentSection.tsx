import { useState, useEffect } from 'react'
import jwt from '../../getLoggedUser/GetUserInfomation';
import { Col, Row, Select, DatePicker } from 'antd';
import { useParams, NavLink } from 'react-router-dom';
import { Input, Textarea, Button, Checkbox, Pagination } from "@nextui-org/react";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import { INSERTDATA } from '../../APIurl/url';
import { GETDATA } from '../../APIurl/url';
import { v1GETDATA } from '../../APIurl/url';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Blank from '../../staff/LeadApplication/tab/blank';
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
interface ResponsiveUser {
  RESPONSIVE_PERSON: number;
  CLIENT_NAME: string;
  BRANCH: number;
  COUNTRY_NAME: string;
}

export default function CommentSection() {
  const MySwal = withReactContent(Swal);
  const [selectedValues, setselectedValues] = useState<string[]>([]);

  const userSelectChange = (value: any) => {
    if (value.includes('All_Memmber')) {
      const filteredValue: any = ['All_Memmber'];

      setselectedValues(filteredValue);
    } else {
      console.log(value);
      setselectedValues(value);
    }
  };




  //handalcomment form control 
  const token = jwt('jwt');
  const { client_id } = useParams();
  const [loader, setloader] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const OnHandleCommentForm = async (e: any) => {
    setloader(true);
    setrefresh(true)
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('PAGE_REQUEST', 'INSERT.COMMENT.Student.Agent');
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

        e.target.reset();
        setselectedValues([]);
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
    setrefresh(false)
  };

  // fetch data of Comment
  const { RangePicker } = DatePicker;
  const [loaddata, setloaddata] = useState(true);

  const [limit, setlimit] = useState(10);
  const [page, setpage] = useState(1);
  const [Totalpage, settotalpage] = useState(1);
  const [daterange, setdaterange] = useState('');
  const [userby, setuserBy] = useState('');
  const [totalData, settotalData] = useState(0);
  const [CommentData, setCommentdata] = useState<CommentData[]>([]);
  const [Responsiveuser, setResponsive] = useState<ResponsiveUser[]>([]);
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
    settotalData(data.total_count);
    settotalpage(data.total_pages);
    setCommentdata((prevData) => {
      // const newComments = data.data.filter((newComment: CommentData) => !prevData.some((existingComment) => existingComment.COMMENT_ID === newComment.COMMENT_ID));
      return data.data;
    });
    setloaddata(false);
  };

  const Responseveperson = async () => {
    setloaddata(true);
    const res = await fetch(v1GETDATA, {
      method: 'POST',
      headers: {
        Authenticate: `Bearer ${token}`,
        'x-token-access': `true`,
      },
      body: JSON.stringify({
        PAGE_REQUEST: 'Comment.responseve.person.',
        ClientId: client_id,
      }),
    });
    const data = await res.json();
    setResponsive(data.data);
    setloaddata(false);
  };



  useEffect(() => {
    Commentfetch();
    Responseveperson();
  }, [page, refresh]);



  // convert date in dd MM YY
  const convertDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  console.log(Responsiveuser);

  const options = [
    { value: 'All_Memmber', label: 'All Member' },
    ...Responsiveuser.map(user => ({
      value: user.RESPONSIVE_PERSON,
      label: `${user.CLIENT_NAME} - (${user.COUNTRY_NAME})`
    }))
  ];

  return (
    <Row className='set_col_coment'>
      <Col span={9}>

        <div>
          <form onSubmit={OnHandleCommentForm}>
            <div className='grid gap-4 set_border' style={{
              border: '1px solid',
              padding: '25px',
              borderRadius: '12px',
              borderColor: '#808080ba'
            }}>
              <Select
                mode="multiple"
                placeholder="Tag user Commnet User"
                value={selectedValues}
                options={options}
                onChange={(value) => {
                  userSelectChange(value);
                }}

              />
              <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Input type="Text" label="Comment Title" placeholder="Enter your Comment title" name="CommentApplicationReletive" isRequired />
              </div>

              <div>
                <Textarea
                  isRequired
                  label="Description"
                  variant="bordered"
                  placeholder="Enter your description"
                  disableAnimation
                  disableAutosize
                  name="CommentText"
                />
              </div>

              <div>
                {/* <div className="mt-2">
                  <Checkbox className="font-meduim font-Nunito" name="public_Comment">
                    Public Comment
                  </Checkbox>
                </div> */}
                <div className="submit-button-comment mt-10 flex justify-end">
                  <Button
                    className="rounded-full btn btn-primary"
                    type="submit"
                    disabled={loader}
                  >
                    {loader ? 'Wait...' : 'Submit Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

      </Col >
      {/* <Col span={2}></Col> */}
      < Col offset={1} span={14} >
        <div className='grid gap-4'>
          <div className='flex justify-end'>
            <p><strong>Total Comment : {totalData}</strong></p>
          </div>
          {loaddata ? (
            <Blank />
          ) : CommentData.length > 0 ? (
            <Accordion variant="splitted">
              {CommentData.map((value: any, index: number) => (
                <AccordionItem
                  key={index}
                  startContent={
                    <Avatar showFallback src='https://images.unsplash.com/broken' />
                  }
                  subtitle={
                    <div>
                      <span><b>comment by : </b> {value.RESPONSIVE_PERSON_NAME}</span>
                      <p>{convertDate(value.COMMENT_DATE)}</p>
                    </div>
                  }
                  title={value.COMMENT_RELETED}>
                  {value.COMMENT_TEXT}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div>
              No data available
              {/* <img src="https://img.freepik.com/premium-vector/no-data-found-illustration-sites-banner-design-vector-illustration_620585-1690.jpg" alt="" /> */}
            </div>
          )}

          <div>
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={Totalpage}
              onChange={(page) => setpage(page)}
            />
          </div>

        </div>
      </Col >

    </Row >
  )
}

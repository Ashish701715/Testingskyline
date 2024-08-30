import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import flagCss from './university-flag.css';
import style from './university.css';
import { Popover } from 'antd';
import { generateJWT } from '../../pages/JWT';
import { university_Api } from '../../APIurl/url';
import { Avatar } from '@nextui-org/avatar';
import ApplyProgram from './modal/ApplyProgram';
import BlankLayout from '../../components/Blank';
import infomation from './../../getLoggedUser/GetUserInfomation';
export default function University() {
    const [program, setProgram] = useState([]);
    const jwt = infomation('jwt');
    const [loader, setloader] = useState(true);
    useEffect(() => {
        fetch(university_Api + `?view=university-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authenticate: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_UNIVERSITY_DATA',
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setProgram(data.data);
                setloader(false);
            })
            .catch((err) => {
                console.error(err);
                setloader(false);
            });
    }, []);
    const text = <span>Title</span>;
    const content = (
        <div>
            <p className="popover-content">Additional incentives,</p>
            <p className="popover-content">discounts, or bonus offers</p>
            <p className="popover-content">may exist for this program.</p>
            <p className="popover-content">Please check your Offers</p>
            <p className="popover-content">Dashboard and emails for</p>
            <p className="popover-content">more details.</p>
        </div>
    );

    const Header = ({ logo, title }: any) => (
        <>
            <div className="flex mt-3 ml-3">
                <Avatar alt={title} src={logo} className="w-[95%] h-[150px] rounded-xl" />
            </div>
            <div className="my_class">{title}</div>
        </>
    );
    return (
        <>
            <div className={`grid grid-cols-5 pb-4 gap-4 ${flagCss}  ${style}`}>
                <div className="col-span-3 page_headng">URM University</div>
                <div className="col-span-2 custom-flex-container justify-content-end">
                    {/* First Dropdown */}
                    {/* <div className="custom-flex-item">
                        <select className="custom-select">
                            <option value="">Option 1</option>
                            <option value="">Option 2</option>
                            <option value="">Option 3</option>
                            <option value="">Option 4</option>
                            <option value="">Option 5</option>
                        </select>
                    </div> */}

                    {/* Second Dropdown */}
                    {/* <div className="custom-flex-item">
                        <select className="custom-select">
                            <option value="">Option 1</option>
                            <option value="">Option 2</option>
                            <option value="">Option 3</option>
                            <option value="">Option 4</option>
                            <option value="">Option 5</option>
                        </select>
                    </div> */}

                    {/* Button */}
                    {/* <div className="custom-flex-item ">
                        <button className="custom-button">
                            <FontAwesomeIcon icon={faSearch} className="group-hover:!text-primary shrink-0 text-lg" />
                            <span className="">Filter</span>
                        </button>
                    </div> */}
                </div>
            </div>
            {/* Add the row with dropdowns and button */}
            <div className="design_bg_university">
                <div className="grid grid-cols-4 gap-4">
                    {loader ? (
                        <BlankLayout number={16} />
                    ) : (
                        program.map((value: any, index: number) => (
                            <div className="flex design_col_gap" key={index}>
                                <div className="card flex justify-content-center">
                                    <Card
                                        subTitle={value.PROGRAM_LENGTH}
                                        header={<Header logo={value.PHOTO_URL} title={value.PROGRAM_NAME} />}
                                        className="md:w-25rem custom-card-width custom-card-heading"
                                    >
                                        <div className="flex">
                                            <div className="">
                                                <Popover placement="right" content={content}>
                                                    <Button className="clg-type-custom">Incentivized</Button>
                                                </Popover>
                                                <Popover placement="right" content={content}>
                                                    <Button className="clg-type-custom-1">Fast Acceptance</Button>
                                                </Popover>
                                            </div>
                                            <div className=""></div>
                                        </div>
                                        <hr />
                                        <br />
                                        <div className="flex card-content-custom">
                                            <div>Location</div>
                                            <div>{value.UNIVERSITIE_ADDRESS ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Campus city</div>
                                            <div>{value.UNIVERSITIE_CITY ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Gross tuition fee</div>
                                            <div>{value.GROSS_TUITION ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Application fee</div>
                                            <div>{value.APPLICATION_FEE ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Duration</div>
                                            <div>{value.PROGRAM_LENGTH ?? 'empty'}</div>
                                        </div>
                                        <hr />
                                        <div className="flex card-content-custom-1">
                                            <div>Success prediction</div>
                                            <Button className="btn-custom">Details</Button>
                                        </div>
                                        <div className="flex card-content-custom-1">
                                            <div>Sep 2024</div>
                                            <div>Jan 2025</div>
                                            <div>Sep 2025</div>
                                        </div>
                                        <div className="flex card-content-custom-1">
                                            <div className="priority priority-1">Low</div>
                                            <div className="priority priority-2">Medium</div>
                                            <div className="priority priority-3">High</div>
                                        </div>
                                        <ApplyProgram programinfo={value} />
                                    </Card>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

import React, { useState, useRef, useEffect } from 'react';
import { Drawer } from 'antd';
import Draercss from '../../style/drawer.css';
import { ColorPicker } from 'antd';
import { Input, notification } from 'antd';
import { InsertAction } from '../../FormHandler/InsertAction';
import { INSERTDATA } from '../../APIurl/url';
import getCookie from '../../getLoggedUser/GetUserInfomation';
interface ModalTypeOf {
    setEdit: any;
    EditValue: any;
    refrehpage:any
}
const App: React.FC<ModalTypeOf> = ({ setEdit , EditValue , refrehpage}) => {
    const [open, setOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        setOpen(true);
    }, []);

    const onClose = () => {
        setOpen(false);
        setTimeout(() => {
            setEdit(false);
        }, 600);
    };

    const EditValueExit =  (EditValue) ? EditValue : false;
    if(EditValueExit===false)
    {
        return <p>Error your Components inside  , Edit Data not pass Edit Components Inside...</p>
    }
    const jwttoken = getCookie('jwt');
    const [backgroundColor, setbackgroundColor] = useState((EditValue?.BG_COLOR)? EditValue ?.BG_COLOR : '');
    const [TextColor, setTextColor] = useState((EditValue?.TEXT_COLOR)? EditValue?.TEXT_COLOR : '');
    const formRef: any = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const HanldeFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const Formdata = new FormData(e.currentTarget);
        Formdata.append('PAGE_REQUEST', 'LEAD_STATUS_MANAGE_UPDATE');
        Formdata.append('BACKGROUNDCOLOR', backgroundColor);
        Formdata.append('TEXTCOLOR', TextColor);
        const Headers = {
            Authenticate: `Bearer ${jwttoken}`,
        };
        const response = await InsertAction(INSERTDATA, Formdata, 'POST', Headers);
        if (response.status === true) {
            api['success']({
                message: response.message,
            });
            setLoading(false);
            refrehpage(true);
        } else {
            api['error']({
                message: response.message,
            });
        }
        setLoading(false);
    };
    const ColorHandler = (color: any) => {
        const hexColor = color.hex ? color.hex : color.toHexString();
        setbackgroundColor(hexColor);
    };

    const TextColorHandler = (color: any) => {
        const hexColor = color.hex ? color.hex : color.toHexString();
        setTextColor(hexColor);
    };
    return (
        <div className={`${Draercss}`}>
            {contextHolder}
            <Drawer
                width={'30%'}
                title="Status Update"
                onClose={onClose}
                open={open}
                placement={'left'}
                className="rounded-xl"
                extra={
                    <div className="flex">
                        <button onClick={onClose} className="btn btn-danger mr-1" disabled={loading}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-info"
                            disabled={loading}
                            onClick={() => {
                                formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }}
                        >
                            {loading ? 'please wait...' : 'Submit'}
                        </button>
                    </div>
                }
            >
                <form onSubmit={HanldeFormSubmission} ref={formRef}>
                    <input type="hidden" value={EditValue.ID} name='StatusId' />
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div className="space-y-2 ">
                            <label htmlFor="name">
                                Status Name <span className="text-danger">*</span>{' '}
                            </label>
                            <Input id="name" type="text" name="StatusName" placeholder="Enter Status Name " className="design_input" defaultValue={EditValue.STATUS}/>
                        </div>

                        <div className="space-y-2 ">
                            <label htmlFor="name" className="">
                                Background Color <span className="text-danger">*</span>{' '}
                            </label>
                            <ColorPicker defaultValue={backgroundColor} className="" onChange={ColorHandler} />
                        </div>

                        <div className="space-y-2 ">
                            <label htmlFor="name" className="">
                                Text Color <span className="text-danger">*</span>{' '}
                            </label>
                            <ColorPicker defaultValue={TextColor} className="" onChange={TextColorHandler} />
                        </div>

                        <div className="space-y-2 ">
                            <label htmlFor="name">
                                Sort By<span className="text-danger">*</span>{' '}
                            </label>
                            <Input id="name" type="text" name="SortName" placeholder="Sort By A - Z " className="design_input" defaultValue={EditValue.sort_by}/>
                        </div>
                    </div>
                </form>
            </Drawer>
        </div>
    );
};

export default App;

import PerfectScrollbar from 'react-perfect-scrollbar';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconNotes from '../../components/Icon/IconNotes';
import IconNotesEdit from '../../components/Icon/IconNotesEdit';
import IconStar from '../../components/Icon/IconStar';
import IconSquareRotated from '../../components/Icon/IconSquareRotated';
import IconPlus from '../../components/Icon/IconPlus';
import IconMenu from '../../components/Icon/IconMenu';
import IconUser from '../../components/Icon/IconUser';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconX from '../../components/Icon/IconX';
import { InsertAction } from '../../FormHandler/InsertAction';
import { INSERTDATA } from '../../APIurl/url';
import { GETDATA } from '../../APIurl/url';
import jwt from '../../getLoggedUser/GetUserInfomation';
import { notification } from 'antd';
import { Button } from '@nextui-org/react';
import { Popconfirm } from 'antd';
import '../../mainstyle.css';
import { QuestionCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
const Notes = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Notes'));
    });
    const [notesList, setNoteList] = useState([]);

    const defaultParams = { id: null, title: '', description: '', tag: '', user: '', thumb: '' };
    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [isDeleteNoteModal, setIsDeleteNoteModal] = useState<any>(false);
    const [isShowNoteMenu, setIsShowNoteMenu] = useState<any>(false);
    const [isViewNoteModal, setIsViewNoteModal] = useState<any>(false);
    const [filterdNotesList, setFilterdNotesList] = useState<any>([]);
    const [selectedTab, setSelectedTab] = useState<any>('all');
    const [deletedNote, setDeletedNote] = useState<any>(null);

    const searchNotes = () => {
        if (selectedTab !== 'fav') {
            if (selectedTab !== 'all' || selectedTab === 'delete') {
                setFilterdNotesList(notesList.filter((d: any) => d.tag === selectedTab));
            } else {
                setFilterdNotesList(notesList);
            }
        } else {
            setFilterdNotesList(notesList.filter((d: any) => d.isFav));
        }
    };

    const tabChanged = (type: string) => {
        setSelectedTab(type);
        setIsShowNoteMenu(false);
        searchNotes();
    };

    const setFav = (note: any) => {
        let list = filterdNotesList;
        let item = list.find((d: any) => d.id === note.id);
        item.isFav = !item.isFav;

        setFilterdNotesList([...list]);
        if (selectedTab !== 'all' || selectedTab === 'delete') {
            searchNotes();
        }
    };

    const setTag = (note: any, name: string = '') => {
        let list = filterdNotesList;
        let item = filterdNotesList.find((d: any) => d.id === note.id);
        item.tag = name;
        setFilterdNotesList([...list]);
        if (selectedTab !== 'all' || selectedTab === 'delete') {
            searchNotes();
        }
    };

    const changeValue = (e: any) => {
        const { value, id } = e.target;
        setParams({ ...params, [id]: value });
    };

    const deleteNoteConfirm = (note: any) => {
        setIsDeleteNoteModal(true);
    };

    const viewNote = (note: any) => {
        setParams(note);
        setIsViewNoteModal(true);
    };

    const editNote = (note: any = null) => {
        setIsShowNoteMenu(false);
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (note) {
            let json1 = JSON.parse(JSON.stringify(note));
            setParams(json1);
        }
        setAddContactModal(true);
    };

    const deleteNote = () => {
        setNoteList(notesList.filter((d: any) => d.id !== deletedNote.id));
        searchNotes();
        showMessage('Note has been deleted successfully.');
        setIsDeleteNoteModal(false);
    };

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        searchNotes();
        /* eslint-disable react-hooks/exhaustive-deps */
    }, [selectedTab, notesList]);
    const token = jwt('jwt');
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [api, contextHolder] = notification.useNotification();
    const [loader, setloader] = useState(false);
    const HandleNoteSubmit = async (e: any) => {
        e.preventDefault();
        setloader(true);
        const Formdata = new FormData(e.target);
        Formdata.append('PAGE_REQUEST', 'INSERT_USER_NOTES_DATA');
        const header = {
            Authenticate: `Bearer ${token}`,
            'x-token-access': 'true',
        };
        try {
            const Data = await InsertAction(INSERTDATA + '?action=storeNote&method=post&type=insert', Formdata, 'POST', header);
            if (Data.status === true) {
                api['success']({
                    message: Data.message,
                    placement: 'topLeft',
                });
                GetData();
            } else {
                api['error']({
                    message: Data.message,
                    placement: 'topLeft',
                });
            }
            setAddContactModal(false);
            setloader(false);
        } catch (err) {
            api['error']({
                message: 'Error Your Request. please try again',
                placement: 'topLeft',
            });
            setloader(false);
        }
    };
    async function GetData() {

        const header = {
            Authenticate: `Bearer ${token}`,
            'x-token-access': 'true',
        };
        const RequestBody = JSON.stringify({
            PAGE_REQUEST: 'GET_NOTE_DATA'
        })
        try {
            const Data = await InsertAction(GETDATA + '?action=getnoteData&method=post&type=get', RequestBody, 'POST', header);
            setNoteList(Data.data);
        } catch (err) {
            api['error']({
                message: 'Error Your Request. please try again',
                placement: 'topLeft',
            });
            setloader(false);
        }
    };
    useEffect(() => {
        GetData();
    }, []);

    const handleDeleteNote = async (note: any) => {
        const header = {
            Authenticate: `Bearer ${token}`,
            'x-token-access': 'true',
        };
        const RequestBody = JSON.stringify({
            PAGE_REQUEST: 'DELETE_NOTE_DATA',
            DATA: note
        })
        try {
            const Data = await InsertAction(GETDATA + '?action=deleteNote&method=post&type=delete', RequestBody, 'POST', header);

            if (Data.status === true) {
                api['success']({
                    message: Data.message,
                    placement: 'topLeft',
                });
                GetData();
            } else {
                api['error']({
                    message: Data.message,
                    placement: 'topLeft',
                });
            }
        } catch (err) {
            api['error']({
                message: 'Error Your Request. please try again',
                placement: 'topLeft',
            });
            setloader(false);
        }
    }
    return (
        <div>
            {contextHolder}
            <div className="flex gap-5 relative sm:h-[calc(100vh_-_150px)] h-full">
                <div className={`bg-black/60 z-10 w-full h-full rounded-md absolute hidden ${isShowNoteMenu ? '!block xl:!hidden' : ''}`} onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}></div>
                <div
                    className={`panel
                    p-4
                    flex-none
                    w-[240px]
                    absolute
                    xl:relative
                    z-10
                    space-y-4
                    h-full
                    xl:h-auto
                    hidden
                    xl:block
                    ltr:lg:rounded-r-md ltr:rounded-r-none
                    rtl:lg:rounded-l-md rtl:rounded-l-none
                    overflow-hidden ${isShowNoteMenu ? '!block h-full ltr:left-0 rtl:right-0' : 'hidden shadow'}`}
                >
                    <div className="flex flex-col h-full pb-16">
                        <div className="flex text-center items-center">
                            <div className="shrink-0">
                                <IconNotes />
                            </div>
                            <h3 className="text-lg font-semibold ltr:ml-3 rtl:mr-3">Notes</h3>
                        </div>

                        <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b] my-4"></div>
                        <PerfectScrollbar className="relative ltr:pr-3.5 rtl:pl-3.5 ltr:-mr-3.5 rtl:-ml-3.5 h-full grow">
                            <div className="space-y-1">
                                <button
                                    type="button"
                                    className={`w-full flex justify-between items-center p-2 hover:bg-white-dark/10 rounded-md dark:hover:text-primary hover:text-primary dark:hover:bg-[#181F32] font-medium h-10 ${selectedTab === 'all' && 'bg-gray-100 dark:text-primary text-primary dark:bg-[#181F32]'
                                        }`}
                                    onClick={() => tabChanged('all')}
                                >
                                    <div className="flex items-center">
                                        <IconNotesEdit className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">All Notes</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className={`w-full flex justify-between items-center p-2 hover:bg-white-dark/10 rounded-md dark:hover:text-primary hover:text-primary dark:hover:bg-[#181F32] font-medium h-10 ${selectedTab === 'fav' && 'bg-gray-100 dark:text-primary text-primary dark:bg-[#181F32]'
                                        }`}
                                    onClick={() => tabChanged('fav')}
                                >
                                    <div className="flex items-center">
                                        <IconStar className="shrink-0" />
                                        <div className="ltr:ml-3 rtl:mr-3">Favourites</div>
                                    </div>
                                </button>
                                <div className="h-px w-full border-b border-white-light dark:border-[#1b2e4b]"></div>
                                <div className="px-1 py-3 text-white-dark">Tags</div>
                                <button
                                    type="button"
                                    className={`w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md dark:hover:bg-[#181F32] font-medium text-primary ltr:hover:pl-3 rtl:hover:pr-3 duration-300 ${selectedTab === 'personal' && 'ltr:pl-3 rtl:pr-3 bg-gray-100 dark:bg-[#181F32]'
                                        }`}
                                    onClick={() => tabChanged('personal')}
                                >
                                    <IconSquareRotated className="fill-primary shrink-0" />
                                    <div className="ltr:ml-3 rtl:mr-3">Personal</div>
                                </button>
                                <button
                                    type="button"
                                    className={`w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md dark:hover:bg-[#181F32] font-medium text-warning ltr:hover:pl-3 rtl:hover:pr-3 duration-300 ${selectedTab === 'work' && 'ltr:pl-3 rtl:pr-3 bg-gray-100 dark:bg-[#181F32]'
                                        }`}
                                    onClick={() => tabChanged('work')}
                                >
                                    <IconSquareRotated className="fill-warning shrink-0" />
                                    <div className="ltr:ml-3 rtl:mr-3">Work</div>
                                </button>
                                <button
                                    type="button"
                                    className={`w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md dark:hover:bg-[#181F32] font-medium text-info ltr:hover:pl-3 rtl:hover:pr-3 duration-300 ${selectedTab === 'social' && 'ltr:pl-3 rtl:pr-3 bg-gray-100 dark:bg-[#181F32]'
                                        }`}
                                    onClick={() => tabChanged('social')}
                                >
                                    <IconSquareRotated className="fill-info shrink-0" />
                                    <div className="ltr:ml-3 rtl:mr-3">Social</div>
                                </button>
                                <button
                                    type="button"
                                    className={`w-full flex items-center h-10 p-1 hover:bg-white-dark/10 rounded-md dark:hover:bg-[#181F32] font-medium text-danger ltr:hover:pl-3 rtl:hover:pr-3 duration-300 ${selectedTab === 'important' && 'ltr:pl-3 rtl:pr-3 bg-gray-100 dark:bg-[#181F32]'
                                        }`}
                                    onClick={() => tabChanged('important')}
                                >
                                    <IconSquareRotated className="fill-danger shrink-0" />
                                    <div className="ltr:ml-3 rtl:mr-3">Important</div>
                                </button>
                            </div>
                        </PerfectScrollbar>
                    </div>
                    <div className="ltr:left-0 rtl:right-0 absolute bottom-0 p-4 w-full">
                        <button className="btn btn-primary w-full" type="button" onClick={() => editNote()}>
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0" />
                            Add New Note
                        </button>
                    </div>
                </div>
                <div className="panel flex-1 overflow-auto h-full">
                    <div className="pb-5">
                        <button type="button" className="xl:hidden hover:text-primary" onClick={() => setIsShowNoteMenu(!isShowNoteMenu)}>
                            <IconMenu />
                        </button>
                    </div>
                    {filterdNotesList.length ? (
                        <div className="sm:min-h-[300px] min-h-[400px]">
                            <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                                {filterdNotesList.map((note: any) => {
                                    return (
                                        <div
                                            className={`panel pb-12 ${note.tag === 'personal'
                                                ? 'bg-primary-light shadow-primary'
                                                : note.tag === 'work'
                                                    ? 'bg-warning-light shadow-warning'
                                                    : note.tag === 'social'
                                                        ? 'bg-info-light shadow-info'
                                                        : note.tag === 'important'
                                                            ? 'bg-danger-light shadow-danger'
                                                            : 'dark:shadow-dark'
                                                }`}
                                            key={note.id}
                                        >
                                            <div className="min-h-[142px]">
                                                <div className="flex justify-between">
                                                    <div className="flex items-center w-max">
                                                        <div className="flex-none">
                                                            {note.thumb && (
                                                                <div className="p-0.5 bg-gray-300 dark:bg-gray-700 rounded-full">
                                                                    <img className="h-8 w-8 rounded-full object-cover" alt="img" src={`${note.thumb}`} />
                                                                </div>
                                                            )}

                                                            {!note.thumb && note.user && (
                                                                <div className="grid place-content-center h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 text-sm font-semibold">
                                                                    {note.user.charAt(0) + '' + note.user.charAt(note.user.indexOf('') + 1)}
                                                                </div>
                                                            )}
                                                            {!note.thumb && !note.user && (
                                                                <div className="bg-gray-300 dark:bg-gray-700 rounded-full p-2">
                                                                    <IconUser className="w-4.5 h-4.5" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ltr:ml-2 rtl:mr-2">
                                                            <div className="font-semibold">{note.user}</div>
                                                            <div className="text-sx text-white-dark">{note.date}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold mt-4">{note.title}</h4>
                                                    <p className="text-white-dark mt-2 truncate">{note.description}</p>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-5 left-0 w-full px-5">
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="dropdown fdfdf">
                                                        <Dropdown
                                                            offset={[0, 5]}
                                                            placement={`${isRtl ? 'bottom-end' : 'bottom-start'}`}
                                                            btnClassName={`${note.tag === 'personal'
                                                                ? 'text-primary'
                                                                : note.tag === 'work'
                                                                    ? 'text-warning'
                                                                    : note.tag === 'social'
                                                                        ? 'text-info'
                                                                        : note.tag === 'important'
                                                                            ? 'text-danger'
                                                                            : ''
                                                                }`}
                                                            button={
                                                                <span>
                                                                    <IconSquareRotated
                                                                        className={
                                                                            note.tag === 'personal'
                                                                                ? 'fill-primary'
                                                                                : note.tag === 'work'
                                                                                    ? 'fill-warning'
                                                                                    : note.tag === 'social'
                                                                                        ? 'fill-info'
                                                                                        : note.tag === 'important'
                                                                                            ? 'fill-danger'
                                                                                            : ''
                                                                        }
                                                                    />
                                                                </span>
                                                            }
                                                        >
                                                            <ul className="text-sm font-medium">
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'personal')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-primary text-primary" />
                                                                        Personal
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'work')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-warning text-warning" />
                                                                        Work
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'social')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-info text-info" />
                                                                        Social
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" onClick={() => setTag(note, 'important')}>
                                                                        <IconSquareRotated className="ltr:mr-2 rtl:ml-2 fill-danger text-danger" />
                                                                        Important
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </Dropdown>
                                                    </div>
                                                    <div className="flex items-center">


                                                        <NavLink to="#" onClick={() => { viewNote(note) }}>
                                                            <EyeOutlined className='text-xl mr-5 text-info' />
                                                        </NavLink>

                                                        <Popconfirm
                                                            title="Delete the task"
                                                            description="Are you sure to delete this task?"
                                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                                            placement="bottomLeft"
                                                            okText="Yes delete"
                                                            onConfirm={() => { handleDeleteNote(note) }}
                                                            className='ConfirmButtonStyle'
                                                        >
                                                            <button type="button" className="text-danger">
                                                                <IconTrashLines />
                                                            </button>
                                                        </Popconfirm>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center sm:min-h-[300px] min-h-[400px] font-semibold text-lg h-full">No data available</div>
                    )}

                    <Transition appear show={addContactModal} as={Fragment}>
                        <Dialog as="div" open={addContactModal} onClose={() => setAddContactModal(false)} className="relative z-[51]">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-[black]/60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center px-4 py-8">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                            <button
                                                type="button"
                                                onClick={() => setAddContactModal(false)}
                                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                                {params.id ? 'Edit Note' : 'Add Note'}
                                            </div>
                                            <div className="p-5">
                                                <form onSubmit={HandleNoteSubmit}>
                                                    <div className="mb-5">
                                                        <label htmlFor="title">Title</label>
                                                        <input
                                                            id="title"
                                                            name="NoteHeading"
                                                            type="text"
                                                            placeholder="Enter Title"
                                                            className="form-input"
                                                            value={params.title}
                                                            onChange={(e) => changeValue(e)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="tag">Tag</label>
                                                        <select name="NoteTag" id="tag" className="form-select" value={params.tag} onChange={(e) => changeValue(e)} required>
                                                            <option value="">None</option>
                                                            <option value="personal">Personal</option>
                                                            <option value="work">Work</option>
                                                            <option value="social">Social</option>
                                                            <option value="important">Important</option>
                                                        </select>
                                                    </div>
                                                    <div className="mb-5">
                                                        <label htmlFor="desc">Description</label>
                                                        <textarea
                                                            required
                                                            name="NoteDescription"
                                                            id="description"
                                                            rows={3}
                                                            className="form-textarea resize-none min-h-[130px]"
                                                            placeholder="Enter Description"
                                                            value={params.description}
                                                            onChange={(e) => changeValue(e)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="flex justify-start items-left mt-8 gap-4">
                                                        <Button className="btn btn-primary" onClick={() => setAddContactModal(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button className="btn btn-primary" isLoading={loader} type="submit">
                                                            {loader ? 'please wait...' : 'Save note'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>

                    <Transition appear show={isViewNoteModal} as={Fragment}>
                        <Dialog as="div" open={isViewNoteModal} onClose={() => setIsViewNoteModal(false)} className="relative z-[51]">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-[black]/60" />
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center px-4 py-8">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                            <button
                                                type="button"
                                                onClick={() => setIsViewNoteModal(false)}
                                                className="absolute top-4 ltr:right-4 rtl:left-4 text-gray-400 hover:text-gray-800 dark:hover:text-gray-600 outline-none"
                                            >
                                                <IconX />
                                            </button>
                                            <div className="flex items-center flex-wrap gap-2 text-lg font-medium bg-[#fbfbfb] dark:bg-[#121c2c] ltr:pl-5 rtl:pr-5 py-3 ltr:pr-[50px] rtl:pl-[50px]">
                                                <div className="ltr:mr-3 rtl:ml-3">{params.title}</div>
                                                {params.tag && (
                                                    <button
                                                        type="button"
                                                        className={`badge badge-outline-primary rounded-3xl capitalize ltr:mr-3 rtl:ml-3 ${(params.tag === 'personal' && 'shadow-primary',
                                                            params.tag === 'work' && 'shadow-warning',
                                                            params.tag === 'social' && 'shadow-info',
                                                            params.tag === 'important' && 'shadow-danger')
                                                            }`}
                                                    >
                                                        {params.tag}
                                                    </button>
                                                )}
                                                {params.isFav && (
                                                    <button type="button" className="text-warning">
                                                        <IconStar className="fill-warning" />
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-5">
                                                <div className="text-base">{params.description}</div>

                                                <div className="ltr:text-right rtl:text-left mt-8">
                                                    <button type="button" className="btn btn-outline-danger" onClick={() => setIsViewNoteModal(false)}>
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
            </div>
        </div>
    );
};

export default Notes;

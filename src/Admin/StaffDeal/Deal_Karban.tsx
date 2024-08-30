import { useState } from 'react';
import Dealstyle from './css/style.css';
import DragData from './Helper/Deal_Drag';
import { DatePicker } from 'antd';

export default function LoadPage() {
    const [isloader, setLoader] = useState(true);
   
    return (
        <div className={`${Dealstyle}`}>
            {isloader ? (
                <>
                    <div className="screen_loader fixed inset-0 bg-[#fafafa] dark:bg-[#060818] z-[60] grid place-content-center animate__animated">
                        <span className="animate-spin border-8 border-[#f1f2f3] border-l-primary rounded-full w-20 h-20 inline-block align-middle m-auto mb-10"></span>
                    </div>
                </>
            ) : null}
            <DragData setLoader={setLoader}/>
        </div>
    );
}

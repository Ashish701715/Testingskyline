import { FC } from 'react';

interface HomeUpProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const HomeUp: FC<HomeUpProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <svg className="m_first_svg" xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.985596 8.17415C0.985596 7.49255 1.27489 6.84299 1.78152 6.38702L7.39164 1.33791C8.30602 0.514968 9.69409 0.514967 10.6085 1.33791L16.2186 6.38702C16.7252 6.84298 17.0145 7.49255 17.0145 8.17415V14.3164C17.0145 15.6442 15.9381 16.7207 14.6102 16.7207H12.2058L12.2014 16.7207H5.79875L5.79427 16.7207H3.38993C2.06205 16.7207 0.985596 15.6442 0.985596 14.3164V8.17415Z" fill="#232323" />
            <path d="M6.5957 12.3086C6.5957 11.204 7.49113 10.3086 8.5957 10.3086H9.40438C10.5089 10.3086 11.4044 11.204 11.4044 12.3086V16.7202H6.5957V12.3086Z" fill="#EBF8FC" />
        </svg>
    );
};

export default HomeUp;

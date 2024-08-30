import { FC } from 'react';

interface DotstbProps {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const Dotstb: FC<DotstbProps> = ({ className, fill = false, duotone = true }) => {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
  <path d="M8.06995 3.4707C8.48416 3.4707 8.81995 3.13492 8.81995 2.7207C8.81995 2.30649 8.48416 1.9707 8.06995 1.9707C7.65573 1.9707 7.31995 2.30649 7.31995 2.7207C7.31995 3.13492 7.65573 3.4707 8.06995 3.4707Z" stroke="#232323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.06995 8.9707C8.48416 8.9707 8.81995 8.63492 8.81995 8.2207C8.81995 7.80649 8.48416 7.4707 8.06995 7.4707C7.65573 7.4707 7.31995 7.80649 7.31995 8.2207C7.31995 8.63492 7.65573 8.9707 8.06995 8.9707Z" stroke="#232323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8.06995 14.4707C8.48416 14.4707 8.81995 14.1349 8.81995 13.7207C8.81995 13.3065 8.48416 12.9707 8.06995 12.9707C7.65573 12.9707 7.31995 13.3065 7.31995 13.7207C7.31995 14.1349 7.65573 14.4707 8.06995 14.4707Z" stroke="#232323" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </>
    );
};

export default Dotstb;

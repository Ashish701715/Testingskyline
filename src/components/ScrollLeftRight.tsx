import {useState , useRef} from 'react';
import Style from './style.css';
export const Scroll = () => {
    const [leftOffset, setLeftOffset] = useState(0); // Initial left offset
    const tableRef: any = useRef(null); // Ref for the table container

    // Function to handle mouse move for scrolling
    const moveScroll = (event: any) => {
        const movementX = event.nativeEvent.movementX;
        const newLeftOffset = leftOffset + movementX;

        // Adjust these constants based on your specific setup
        const minLeftOffset = 0;
        const maxLeftOffset = 55; // Adjust this based on your actual maximum scroll width

        // Ensure newLeftOffset stays within the min-max range
        if (newLeftOffset >= minLeftOffset && newLeftOffset <= maxLeftOffset) {
            setLeftOffset(newLeftOffset);
            if (tableRef.current) {
                tableRef.current.scrollLeft = '500px';
                console.log(tableRef.current.clientWidth);
                tableRef.current.scrollLeft = (newLeftOffset / maxLeftOffset) * (tableRef.current.scrollWidth - tableRef.current.clientWidth);
            }
        }
    };
    return (
        <div id="mini-map" className={`css-18v91cr  ${Style}`}>
            <div className="css-hxyrcv">
                <span style={{ display: 'inline-flex' }}>
                    <div aria-label="column-0" className="css-1czhqfs" />
                    <div aria-label="column-1" className="css-1czhqfs" />
                    <div aria-label="column-2" className="css-1czhqfs" />
                    <div aria-label="column-3" className="css-1czhqfs" />
                    <div aria-label="column-4" className="css-1czhqfs" />
                    <div aria-label="column-5" className="css-1czhqfs" />
                    <div aria-label="column-6" className="css-1czhqfs" />
                    <div aria-label="column-7" className="css-1czhqfs" />
                </span>
                <div className="css-11cntbg" style={{ left: `${leftOffset}px` }} onMouseMove={moveScroll} />
            </div>
        </div>
    );
};

import React from 'react';
import { Box } from '@mui/material';

interface ColorPickerProps {
    handleColorChange: (colorCode: string) => void;
}

const colors = [
    ["#05c5ff", "rgb(5, 197, 255)"],
    ["#03e8ff", "#03e8ff"],
    ["#00f9e8", "#00f9e8"],
    ["#91a52f", "#91a52f"],
    ["#f5ce00", "#f5ce00"],
    ["#ffb003", "#ffb003"],
    ["#dfd3b6", "rgb(223, 211, 182)"],
    ["#e3c6bb", "rgb(227, 198, 187)"],
    ["#ffad97", "rgb(255, 173, 151)"],
    ["#ffbdbb", "rgb(255, 189, 187)"],
    ["#ffcbd8", "rgb(255, 203, 216)"],
    ["#ffc4e4", "rgb(255, 196, 228)"],
    ["#c4baed", "rgb(196, 186, 237)"],
    ["#dbdde0", "rgb(219, 221, 224)"],
    ["#bfc5cd", "rgb(191, 197, 205)"],
    ["#a2a8b0", "rgb(162, 168, 176)"],
    ["#4d75b3", "rgb(77, 117, 179)"],
    ["#4c7a95", "rgb(76, 122, 149)"],
    ["#4d8ba4", "rgb(77, 139, 164)"],
    ["#5c8c89", "rgb(92, 140, 137)"],
    ["#56795e", "rgb(86, 121, 94)"],
    ["#667447", "rgb(102, 116, 71)"],
    ["#ad9973", "rgb(173, 153, 115)"],
    ["#7d5a6d", "rgb(125, 90, 109)"],
    ["#786d59", "rgb(120, 109, 89)"],
    ["#79585d", "rgb(121, 88, 93)"],
    ["#774b57", "rgb(119, 75, 87)"],
    ["#984b66", "rgb(152, 75, 102)"],
    ["#b0474a", "rgb(176, 71, 74)"],
    ["#9e502a", "rgb(158, 80, 42)"],
    ["#8e442c", "rgb(142, 68, 44)"],
    ["#a36f2f", "rgb(163, 111, 47)"],
    ["#7b4322", "rgb(123, 67, 34)"],
    ["#5b3e32", "rgb(91, 62, 50)"],
    ["#9b5d6f", "rgb(155, 93, 111)"],
    ["#6c6d7a", "rgb(108, 109, 122)"],
    ["#6d5d70", "rgb(109, 93, 112)"],
    ["#7d6e63", "rgb(125, 110, 99)"],
    ["#8b7561", "rgb(139, 117, 97)"],
    ["#a78d61", "rgb(167, 141, 97)"],
    ["#b5a668", "rgb(181, 166, 104)"],
    ["#a38d4e", "rgb(163, 141, 78)"],
    ["#9f8335", "rgb(159, 131, 53)"],
    ["#ac9745", "rgb(172, 151, 69)"],
    ["#a89267", "rgb(168, 146, 103)"],
    ["#a28c7d", "rgb(162, 140, 125)"],
    ["#6c867b", "rgb(108, 134, 123)"],
    ["#4a7c72", "rgb(74, 124, 114)"],
    ["#478e86", "rgb(71, 142, 134)"],
    ["#3e6a78", "rgb(62, 106, 120)"],
    ["#225a7d", "rgb(34, 90, 125)"],
    ["#243f6d", "rgb(36, 63, 109)"],
    ["#2f4858", "rgb(47, 72, 88)"],
    ["#454859", "rgb(69, 72, 89)"],
    ["#693f4d", "rgb(105, 63, 77)"],
    ["#7d4053", "rgb(125, 64, 83)"],
    ["#9d435d", "rgb(157, 67, 93)"],
    ["#ad4050", "rgb(173, 64, 80)"],
    ["#c55a4a", "rgb(197, 90, 74)"],
    ["#b75c48", "rgb(183, 92, 72)"],
    ["#a85b48", "rgb(168, 91, 72)"],
    ["#a5674d", "rgb(165, 103, 77)"],
    ["#b67f4b", "rgb(182, 127, 75)"],
    ["#c59253", "rgb(197, 146, 83)"],
    ["#ceab62", "rgb(206, 171, 98)"],
    ["#d0b96c", "rgb(208, 185, 108)"],
    ["#d7c274", "rgb(215, 194, 116)"],
    ["#d3b78f", "rgb(211, 183, 143)"],
    ["#bca688", "rgb(188, 166, 136)"],
    ["#9f8e7d", "rgb(159, 142, 125)"],
    ["#8d7b6d", "rgb(141, 123, 109)"],
    ["#6d665f", "rgb(109, 102, 95)"],
    ["#4e4a4c", "rgb(78, 74, 76)"],
    ["#56483f", "rgb(86, 72, 63)"],
    ["#4b433c", "rgb(75, 67, 60)"],
    ["#67594a", "rgb(103, 89, 74)"],
    ["#8f826b", "rgb(143, 130, 107)"],
    ["#b1a086", "rgb(177, 160, 134)"],
    ["#d1c2a3", "rgb(209, 194, 163)"],
    ["#ded6c3", "rgb(222, 214, 195)"],
    ["#c7b4a9", "rgb(199, 180, 169)"],
    ["#a6998e", "rgb(166, 153, 142)"],
    ["#8c837d", "rgb(140, 131, 125)"],
    ["#736c67", "rgb(115, 108, 103)"],
    ["#595450", "rgb(89, 84, 80)"],
    ["#3d3937", "rgb(61, 57, 55)"]
    // Add more colors as needed
];

const ColorPicker: React.FC<ColorPickerProps> = ({ handleColorChange }) => {
    const columns = 4;
    return (
        <Box className="main-color-picker-palette">
            {Array.from({ length: Math.ceil(colors.length / columns) }).map((_, rowIndex) => (
                <div className="main-color-picker-row" key={rowIndex}>
                   <ul className='flex'>
                   {colors.slice(rowIndex * columns, (rowIndex + 1) * columns).map(([colorCode, bgColor], index) => (
                        <li>
                            <div
                                className="main-color-picker-box"
                                key={index}
                                data-color={colorCode}
                                style={{ backgroundColor: bgColor }}
                                onClick={() => handleColorChange(colorCode)}
                            ></div>
                        </li>
                    ))}
                   
                   </ul>
                </div>
            ))}
        </Box>
    );
};

export default ColorPicker;

import {  useNavigate } from 'react-router-dom';
const Footer = () => {
    const navigate = useNavigate();
    function getCookie(name :string) {
        const cookieName = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return null;
    }
    
    function checkAndSetCookies() {
        const auth_token = getCookie('PHPSESSION');
        const SID = getCookie('SID');
        const USERID = getCookie('USERID');
        const UserEmail = getCookie('UserEmail');
        const jwt = getCookie('jwt');
        
        if (auth_token == null || UserEmail == null || USERID == null || SID == null || jwt == null) {
            navigate('/auth/agent/signin');
        }
    }
    checkAndSetCookies();
    setInterval(checkAndSetCookies, 3000); 

    return <div className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right p-6 pt-0 mt-auto">© {new Date().getFullYear()}. skyline All rights reserved.</div>;
};

export default Footer;

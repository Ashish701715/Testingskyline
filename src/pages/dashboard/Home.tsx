import { useEffect } from 'react';

export default function Home() {
    const getCookie = (name: any) => {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split('=');
            if (cookie[0] === name) {
                return cookie[1];
            }
        }
        return null;
    };

    const TokenData = getCookie('jwt');

    const UserValition = async () => {
        fetch(`https://jwt-brown.vercel.app/validate-token?token=${TokenData}`, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.isValid !== true) {
                    window.location.href = '/auth/agent/signin';
                } else {
                    window.location.href = '/' + data.data.ROLE;
                }
                // setuserdata(data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        UserValition();
    }, []);

    return (
        <div>
            Checking user authentication...
        </div>
    );
}

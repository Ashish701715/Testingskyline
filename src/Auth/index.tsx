import Header from './components/Header';
import LoginSection from './Page/Login';
import TopHeader from './components/Topheader';
import './style.css';
const MainChildComponent = () => {
    return (
        <>
            <TopHeader />
            <Header />
            <LoginSection />
        </>
    );
};

export default MainChildComponent;

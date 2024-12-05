import { Container, Navbar, Dropdown, Button } from "react-bootstrap"
import Logo from '../../assets/images/shan_and_co_logo.png'
import avtar from '../../assets/images/avtar-male.png'
import { GoChevronDown } from "react-icons/go";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import WebService from "../../Services/WebService";
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { ROLE_PERMMISION_DATA, USER_INFO, USER_LOGOUT, setDataInRedux } from "../../action/CommonAction";
import { RootState } from "../../config/Store";
import { reduxState } from "../../reducer/CommonReducer";
import HelperService from "../../Services/HelperService";
import DeleteModal from "../Common/DeleteModal/DeleteModal";


const Header = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const commonData: any = useSelector<RootState, reduxState>((state: any) => state.commonData);
    const [showDeleteModal, setDeleteModal] = useState<boolean>(false);
    const userInfoData: any = useSelector<RootState, any>((state: any) => state.userInfoData);

    const url = WebService.getBaseUrl("home")


    useEffect(() => {
        userMeCall();
    }, []);

    const userMeCall = async () => {
        WebService.getAPI({ action: "api/user/me", id: "login_btn" })
            .then((res: any) => {
                dispatch(setDataInRedux({ type: USER_INFO, value: res }));
                roleDetail(res.roles[0].roleId)  
            })
            .catch(() => {
                typeof window !== "undefined" && localStorage.clear();
            });
    };

    const roleDetail=(id:any)=>{
        WebService.getAPI({
            action:`api/user/roles/${id}/details`
        }).then((res:any)=>{
            dispatch(setDataInRedux({ type: ROLE_PERMMISION_DATA, value: res }));
        }).catch(()=>{

        })
    }

    const onConfirmDelete = () => {
        setDeleteModal(true);
    };

    const logOut = () => {
        WebService.postAPI({ action: "users/log-out", body: {}, id: 'popup-confirm-button' })
        .then((res: any) => {
            localStorage.clear();
            window.location.href = url;
        }).catch((e) => {               
            localStorage.clear();
            window.location.href = url;
        })
    }

    const onLogoutredirect = () => {
        logOut();
      
        // dispatch(setDataInRedux({ type: USER_LOGOUT, value: '' }));    
    }

    const onLogout = () => {
         onConfirmDelete()
    };
    

    return (
        <>
            <header className="site-header">
              <DeleteModal isShow={showDeleteModal} message={"Are You sure you want to logout.?"} close={() => { setDeleteModal(false); }} onDelete={() => { onLogoutredirect() }} />
                <Container fluid className='header-nav'>
                    <Navbar expand="lg">
                        {/* <Navbar.Brand className="me-5">
                            <img src={Logo} width={186} height={30} alt='' />
                        </Navbar.Brand> */}
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <div className="d-flex align-items-center ms-auto gap-3" >
                            <Dropdown className="profile2-dd">
                                <Dropdown.Toggle>
                                {
                                        userInfoData && userInfoData?.user_info && !HelperService.isEmptyObject(userInfoData?.user_info) &&
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div><img src={userInfoData?.user_info?.avtar ? userInfoData?.user_info?.avtar : avtar} width={35} height={35} className=" rounded-circle object-fit-cover" alt='' /></div>
                                            <div >
                                                <p className='font-14 mb-0 text-white font-medium'>{userInfoData?.user_info?.first_name} {userInfoData?.user_info?.last_name}</p>
                                                <p className='font-12 mb-0 text-white text-secondary'>{userInfoData?.user_info?.email}</p>

                                            </div>
                                        </div>
                                    }
                                    {/* <div className='d-flex gap-2'>
                                        <div><img src={avtar} width={35} height={35} className=" rounded-circle object-fit-cover" alt='' /></div>
                                        <div >
                                            <p className='font-14 mb-0 text-dark font-medium'>Randy Wonana</p>
                                            <p className='font-12 mb-0 text-secondary'>randywonana123@gmail.com</p>
                                        </div>
                                    </div> */}
                                    <GoChevronDown size={16} className='icon' />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                <Link to="/profile" className="dropdown-item">My Profile</Link>

                                    <Button className=" dropdown-item" onClick={() => onLogout()}>Logout</Button>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Navbar>
                </Container>
            </header>

        </>
    )
}
export default Header;
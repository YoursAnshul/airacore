import { Link } from 'react-router-dom';
import { RxDashboard } from "react-icons/rx";
import { LuUsers } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { RootState } from '../../config/Store';
import { useEffect } from 'react';
import { MdCategory } from "react-icons/md";
import { BiCart } from "react-icons/bi";
import { LiaChargingStationSolid, LiaServicestack } from "react-icons/lia";
import { LuSettings } from "react-icons/lu";
import { LuIndianRupee } from "react-icons/lu";
import { VscFeedback } from "react-icons/vsc";
import { LuCalendarCheck } from "react-icons/lu";
import { LuLayoutDashboard } from "react-icons/lu";

const VerticalMenu = () => {

    const userInfoData: any = useSelector<RootState, any>(
        (state: any) => state.userInfoData
    );

    useEffect(() => {
        console.log("sidebar--->", userInfoData.user_info)
        console.log("vendor", userInfoData.user_info.isVendor)
        console.log("id", !userInfoData.user_info.vendorId)
        console.log(userInfoData.user_info.isVendor === 0 && !userInfoData.user_info.vendorId)
    }, []);

    return (
        <>
            <div id="vertical_menu" className="verticle-menu">
                <div className="menu-list">
                    <Link id="t-1" to={'/dashboard'} className="menu-item"> <LuLayoutDashboard className="menu-icon dashboard" /> <span className='nav-text'>Dashbaord</span></Link>
                    <Link id="t-1" to={'/role-management'} className="menu-item"> <LuUsers className="menu-icon dashboard" /> <span className='nav-text'>Role Management</span></Link>
                </div>
            </div>
        </>
    )
}
export default VerticalMenu;
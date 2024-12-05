import { Link } from 'react-router-dom';
import icon3 from '../../assets/images/menu-icon-3.svg'
import icon4 from '../../assets/images/menu-icon-4.svg'
import iconDashboard from "../../assets/images/icon-dashboard.svg"
import iconComplienceUser from "../../assets/images/icon-compli-user.svg"

import { MdSpaceDashboard, MdCategory, MdLocalGroceryStore, MdLayers, MdGroup, MdCoPresent, MdManageAccounts, MdOutlinePublicOff, MdGppGood, MdSettings } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HelperService from '../../Services/HelperService';
import { RootState } from '../../config/Store';
import { reduxState } from '../../reducer/CommonReducer';

const VerticalMenu = () => {
    const commonData: any = useSelector<RootState, reduxState>(
        (state: any) => state.commonData
    );
    const [permission, setPermission] = useState<any>()

    useEffect(() => {
        if (
            commonData &&
            commonData?.rolePermission &&
            !HelperService.isEmptyObject(commonData?.rolePermission)
        ) {
            if (commonData?.rolePermission?.menus && commonData?.rolePermission?.menus.length > 0) {
                const data = commonData?.rolePermission.menus
                // .find((item:any) => item.name === 'Manage product category' );
                setPermission(data);
            }
        } else {

        }
    }, [commonData]);

    return (
        <>
            <div id="vertical_menu" className="verticle-menu">
                <div className="menu-list">
                    <Link id="t-1" to={'/dashboard'} className="menu-item"> <MdSpaceDashboard className="menu-icon" /> <span className='nav-text'>Dashbaord</span></Link>
                    <Link id="t-1" to={'/user-management'} className="menu-item"> <MdCoPresent className="menu-icon" /> <span className='nav-text'>Admin User Management</span></Link>
                    <Link id="t-1" to={'/role-management'} className="menu-item"> <MdManageAccounts className="menu-icon" /> <span className='nav-text'>Admin Role Management</span></Link>
                </div>
            </div>
            {/* 
   <div className="menu-list">
                    {permission &&  permission.map((item: any) => {
                        if (item.name === "Dashboard" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/dashboard'} className="menu-item">
                                    <MdSpaceDashboard className="menu-icon" />
                                    <span className='nav-text'>Dashboard</span>
                                </Link>
                            );
                        } else if (item.name === "Manage product category" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/manage-category'} className="menu-item">
                                    <MdCategory className="menu-icon" />
                                    <span className='nav-text'>Manage Category</span>
                                </Link>
                            );
                        } else if (item.name === "Manage product" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/manage-products'} className="menu-item">
                                    <MdLayers className="menu-icon" />
                                    <span className='nav-text'>Manage Products</span>
                                </Link>
                            );
                        } else if (item.name === "Manage orders" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/mange-orders'} className="menu-item">
                                    <MdLocalGroceryStore className="menu-icon" />
                                    <span className='nav-text'>Manage Orders</span>
                                </Link>
                            );
                        } else if (item.name === "Manage Customers" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/manage-customers'} className="menu-item">
                                    <MdGroup className="menu-icon" />
                                    <span className='nav-text'>Manage Customers</span>
                                </Link>
                            );
                        } else if (item.name === "Admin User Management" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/user-management'} className="menu-item">
                                    <MdCoPresent className="menu-icon" />
                                    <span className='nav-text'>Admin User Management</span>
                                </Link>
                            );
                        } else if (item.name === "Admin Role Management" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/role-management'} className="menu-item">
                                    <MdManageAccounts className="menu-icon" />
                                    <span className='nav-text'>Admin Role Management</span>
                                </Link>
                            );
                        } else if (item.name === "Blacklisted" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/blacklisted-domain'} className="menu-item">
                                    <MdOutlinePublicOff className="menu-icon" />
                                    <span className='nav-text'>Blacklisted</span>
                                </Link>
                            );
                        } else if (item.name === "Offers and Discount" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/offers'} className="menu-item">
                                    <BiSolidOffer className="menu-icon" />
                                    <span className='nav-text'>Offers & Discount</span>
                                </Link>
                            );
                        } else if (item.name === "Settings" && item.isRead) {
                            return (
                                <Link key={item.id} id="t-1" to={'/settings'} className="menu-item">
                                    <MdSettings className="menu-icon" />
                                    <span className='nav-text'>Settings</span>
                                </Link>
                            );
                        } else {
                            return null; // Return null for links that shouldn't be rendered
                        }
                    })}
                </div> */}

        </>
    )
}
export default VerticalMenu;


// <Link id="t-1" to={'/dashboard'} className={`menu-item ${permission && !permission.menus[0].isRead ? 'disabled' : ''}`}> <MdSpaceDashboard className="menu-icon" /> <span className='nav-text'>Dashboard</span></Link>



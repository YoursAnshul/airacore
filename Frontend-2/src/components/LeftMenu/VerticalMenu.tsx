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
import WebService from '../../Services/WebService';

const VerticalMenu = () => {
    const [menuAccess, setMenuAccess] = useState<any[]>([]);
    const userMeCall = async () => {
        WebService.getAPI({ action: "api/user/me", id: "login_btn" })
            .then((res: any) => {
                setMenuAccess(res.roles[0].menus || []);
            })
            .catch(() => {
                setMenuAccess([]);
            });
    };

    useEffect(() => {
        userMeCall();
    }, []);

    const menuConfig = [
        {
            id: 1,
            path: "/dashboard",
            label: "Dashboard",
            icon: <MdSpaceDashboard className="menu-icon" />,
        },
        {
            id: 2,
            path: "/login-logout",
            label: "Login Logout Management",
            icon: <MdManageAccounts className="menu-icon" />,
        },
        {
            id: 3,
            path: "/user-management",
            label: "Admin User Management",
            icon: <MdCoPresent className="menu-icon" />,
        },
        {
            id: 4,
            path: "/role-management",
            label: "Admin Role Management",
            icon: <MdManageAccounts className="menu-icon" />,
        },
        
    ];

    return (
        <>
            <div id="vertical_menu" className="verticle-menu">
                <div className="menu-list">
                    {menuConfig
                        .filter((menu) => menuAccess.some((access) => access.menuId === menu.id)) // Filter based on access
                        .map((menu) => (
                            <Link key={menu.id} to={menu.path} className="menu-item">
                                {menu.icon} <span className="nav-text">{menu.label}</span>
                            </Link>
                        ))}
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



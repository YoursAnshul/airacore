import { MdOutlineModeEditOutline } from "react-icons/md";
import { Link } from "react-router-dom";

interface BtnEditInterface {
    linkUrl?:any
    openModal?():any
}

const BtnEdit = (props:BtnEditInterface) => {
    return (
        
            <Link to={props.linkUrl} onClick={props.openModal} className="btn btn-edit"><MdOutlineModeEditOutline className="icon" /></Link> 
         
    )
}
export default BtnEdit; 
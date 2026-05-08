import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Toggle.module.scss"
import { AiOutlineLeft } from "@react-icons/all-files/ai/AiOutlineLeft";
import { useDispatch, useSelector } from "react-redux";
import { toggleBarChange, toggleBarOff } from "../../../../store/ToggleBarStatus/ToggleBarStatus.action";
import { useEffect } from "react";

export default function Toggle(props) {

    const dispatch = useDispatch()
    
    const toggleStatus = useSelector(state => state.toggleStatus)

    
    useEffect(() => {
        if (window.innerWidth < 800) dispatch(toggleBarOff())
    }, [])

    return (
        <div className={`${styles.toggle} ${toggleStatus === true ? '': styles.toggleOn} `}>
            <span type="button" onClick={() =>dispatch(toggleBarChange(toggleStatus))}>
                {/* <AiOutlineLeft className="" />  */}

                <FontAwesomeIcon icon={faBars} className="fs-5 icon" />
            </span>
        </div>
    );
}

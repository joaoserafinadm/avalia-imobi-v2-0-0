import { useDispatch, useSelector } from "react-redux"
import { toggleBarOff } from "../store/ToggleBarStatus/ToggleBarStatus.action"
import { useEffect } from "react"

export default function navbarHide(dispatch) {

    if (window.innerWidth < 850) dispatch(toggleBarOff())

}
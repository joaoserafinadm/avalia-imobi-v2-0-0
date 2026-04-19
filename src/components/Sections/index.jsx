import { useEffect } from "react";
import isMobile from "../../../utils/isMobile";
import styles from "./Sections.module.scss";

export default function Sections(props) {

    useEffect(() => {
        setTimeout(() => {
            var myCarousel = document.querySelector("#" + props.idTarget);
            var carousel = myCarousel ? new bootstrap.Carousel(myCarousel) : '';
            if (carousel) {
                carousel?.to(props.sections.indexOf(props.section));
            }
        }, 200);
    }, [props.section]);

    return (
        <div className={styles.tabBar}>
            {props.sections.map((elem, index) => (
                <span
                    key={index}
                    className={`${styles.tab} ${props.section === elem ? styles.tabActive : ""}`}
                    onClick={() => props.setSection(elem)}
                    data-bs-target={"#" + props.idTarget}
                    data-bs-slide-to={index}
                >
                    {elem}
                </span>
            ))}
        </div>
    );
}

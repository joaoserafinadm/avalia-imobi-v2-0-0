import { faBook, faGear, faShop, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import styles from "./GeralButtons.module.scss";

const items = [
    { href: "/editProfile",   icon: faUser,  label: "Meu Perfil"     },
    { href: "/companyEdit",   icon: faShop,  label: "Imobiliária"    },
    { href: "/accountSetup",  icon: faGear,  label: "Configurações"  },
    { href: "/tutorials",     icon: faBook,  label: "Tutoriais"      },
];

export default function GeralButtons() {
    return (
        <div className={`${styles.grid} mx-3`}>
            {items.map(({ href, icon, label }) => (
                <Link href={href} key={href}>
                    <div className={styles.navCard}>
                        <div className={styles.iconWrap}>
                            <FontAwesomeIcon icon={icon} className={styles.icon} />
                        </div>
                        <span className={styles.label}>{label}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

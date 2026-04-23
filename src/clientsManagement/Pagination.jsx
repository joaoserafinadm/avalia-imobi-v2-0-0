import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import scrollTo from '../../utils/scrollTo';
import styles from "./Pagination.module.scss";

export default function Pagination({ array, elementosPorPagina, page, setPage }) {

    const totalPages = Math.ceil(array.length / elementosPorPagina);

    let pageNumbers = [];
    if (totalPages <= 3) {
        pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (page === 1) {
        pageNumbers = [1, 2, 3];
    } else if (page === totalPages) {
        pageNumbers = [totalPages - 2, totalPages - 1, totalPages];
    } else {
        pageNumbers = [page - 1, page, page + 1];
    }

    const goTo = (p) => {
        setPage(p);
        scrollTo('clientsManagementSection');
    };

    return (
        <div className={styles.wrap} role="navigation" aria-label="Paginação">

            <button
                type="button"
                className={styles.btn}
                disabled={page === 1}
                onClick={() => goTo(page - 1)}
                aria-label="Página anterior"
            >
                <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '0.65rem' }} />
                <span>Anterior</span>
            </button>

            {pageNumbers[0] > 1 && (
                <>
                    <button type="button" className={styles.btnPage} onClick={() => goTo(1)}>1</button>
                    {pageNumbers[0] > 2 && <span className={styles.sep}>···</span>}
                </>
            )}

            {pageNumbers.map(n => (
                <button
                    key={n}
                    type="button"
                    className={page === n ? styles.btnActive : styles.btnPage}
                    onClick={() => page !== n && goTo(n)}
                    aria-current={page === n ? 'page' : undefined}
                >
                    {n}
                </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className={styles.sep}>···</span>}
                    <button type="button" className={styles.btnPage} onClick={() => goTo(totalPages)}>{totalPages}</button>
                </>
            )}

            <button
                type="button"
                className={styles.btn}
                disabled={page === totalPages}
                onClick={() => goTo(page + 1)}
                aria-label="Próxima página"
            >
                <span>Próximo</span>
                <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.65rem' }} />
            </button>

        </div>
    );
}

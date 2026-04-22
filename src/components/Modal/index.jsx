import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './Modal.module.scss';

/* ─────────────────────────────────────────────
   Modal  —  wrapper Bootstrap com design system

   Props:
     id          string    – Bootstrap modal ID (obrigatório)
     title       string    – título do header
     subtitle    string    – subtítulo opcional
     icon        FA icon   – ícone ao lado do título
     size        'sm'|'md'|'lg'|'xl'|'fullscreen'  (default 'md')
     scrollable  bool      (default true)
     centered    bool      (default true)
     onClose     fn        – callback ao fechar
     footer      JSX       – conteúdo do rodapé (substitui footer padrão)
     hideFooter  bool      – oculta o footer inteiro
     children    JSX       – corpo do modal
───────────────────────────────────────────── */
export default function Modal({
  id,
  title,
  subtitle,
  icon,
  size = 'md',
  scrollable = true,
  centered = true,
  onClose,
  footer,
  hideFooter = false,
  children,
}) {
  const sizeClass = size === 'md' ? '' : `modal-${size}`;

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}-label`}
      aria-hidden="true"
    >
      <div
        className={[
          'modal-dialog',
          centered && 'modal-dialog-centered',
          scrollable && 'modal-dialog-scrollable',
          sizeClass,
        ].filter(Boolean).join(' ')}
      >
        <div className={`modal-content ${styles.modalContent}`}>

          {/* ── Header ── */}
          {title && (
            <div className={styles.modalHeader}>
              <div className={styles.headerText}>
                <h5 className={styles.modalTitle} id={`${id}-label`}>
                  {icon && (
                    <span className={styles.titleIcon}>
                      <FontAwesomeIcon icon={icon} />
                    </span>
                  )}
                  {title}
                </h5>
                {subtitle && <p className={styles.modalSubtitle}>{subtitle}</p>}
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                data-bs-dismiss="modal"
                aria-label="Fechar"
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          {/* ── Body ── */}
          <div className={`modal-body ${styles.modalBody}`}>
            {children}
          </div>

          {/* ── Footer ── */}
          {!hideFooter && (
            <div className={styles.modalFooter}>
              {footer ?? (
                <button
                  type="button"
                  className={styles.btnSecondary}
                  data-bs-dismiss="modal"
                  onClick={onClose}
                >
                  Fechar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sub-componentes exportados para composição
───────────────────────────────────────────── */

/** Bloco destacado dentro do body */
export function ModalSection({ children, className = '' }) {
  return (
    <div className={`${styles.section} ${className}`}>
      {children}
    </div>
  );
}

/** Par label + valor */
export function ModalInfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}

/** Linha divisória */
export function ModalDivider() {
  return <div className={styles.divider} />;
}

/** Botão primário (laranja) */
export function ModalBtnPrimary({ children, onClick, disabled, dismiss = true, icon }) {
  return (
    <button
      type="button"
      className={styles.btnPrimary}
      onClick={onClick}
      disabled={disabled}
      {...(dismiss ? { 'data-bs-dismiss': 'modal' } : {})}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}

/** Botão secundário (neutro) */
export function ModalBtnSecondary({ children, onClick, disabled, dismiss = true, icon }) {
  return (
    <button
      type="button"
      className={styles.btnSecondary}
      onClick={onClick}
      disabled={disabled}
      {...(dismiss ? { 'data-bs-dismiss': 'modal' } : {})}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}

/** Botão de perigo (vermelho) */
export function ModalBtnDanger({ children, onClick, disabled, dismiss = true, icon }) {
  return (
    <button
      type="button"
      className={styles.btnDanger}
      onClick={onClick}
      disabled={disabled}
      {...(dismiss ? { 'data-bs-dismiss': 'modal' } : {})}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}

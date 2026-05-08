import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Button.module.scss';

/* ─────────────────────────────────────────────
   Button Component
   Props:
     variant   – "primary"|"secondary"|"danger"|"success"|"warning"|"ghost"
                 (default "primary")
     size      – "sm"|"md"|"lg"   (default "md")
     theme     – "dark"|"light"   (default "dark")
     icon      – FA icon à esquerda
     iconRight – FA icon à direita
     loading   – bool — exibe spinner e desabilita
     disabled  – bool
     full      – bool — largura 100%
     iconOnly  – bool — botão quadrado só com ícone
     type      – "button"|"submit"|"reset"  (default "button")
     href      – string — renderiza como <a>
     onClick   – fn
───────────────────────────────────────────── */

const Button = forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  theme = 'dark',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  full = false,
  iconOnly = false,
  type = 'button',
  href,
  onClick,
  children,
  className = '',
  ...rest
}, ref) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    theme === 'light' && styles.light,
    full && styles.full,
    iconOnly && styles.iconOnly,
    loading && styles.isLoading,
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {loading
        ? <span className={styles.spinner} />
        : icon && <FontAwesomeIcon icon={icon} />
      }
      {!iconOnly && children}
      {!loading && iconRight && <FontAwesomeIcon icon={iconRight} />}
    </>
  );

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
});

export default Button;

/* ─────────────────────────────────────────────
   Exports nomeados por variante
───────────────────────────────────────────── */
const make = (variant) => forwardRef((props, ref) => <Button ref={ref} variant={variant} {...props} />);

export const BtnPrimary   = make('primary');
export const BtnSecondary = make('secondary');
export const BtnDanger    = make('danger');
export const BtnSuccess   = make('success');
export const BtnWarning   = make('warning');
export const BtnGhost     = make('ghost');

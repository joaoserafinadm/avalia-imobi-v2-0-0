import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faEyeSlash, faXmark, faMagnifyingGlass,
  faCheck, faCloudArrowUp, faCircleExclamation,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Input.module.scss';

/* ─────────────────────────────────────────────
   Core Input component
   Props:
     type        – "text"|"email"|"password"|"number"|"textarea"|
                   "select"|"checkbox"|"radio"|"toggle"|"file"|"search"
     label       – string
     placeholder – string
     value       – controlled value
     onChange    – (e | value) => void
     error       – string
     hint        – string
     disabled    – bool
     required    – bool
     theme       – "dark" | "light"   (default "dark")
     icon        – FA icon (prefix, for text/email/number/search)
     options     – [{ value, label }]  (select / radio)
     rows        – number              (textarea)
     accept      – string              (file)
     name        – string              (radio group name)
───────────────────────────────────────────── */

export default function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  theme = 'dark',
  icon,
  suffix,
  options = [],
  rows = 4,
  accept,
  name,
  id,
  ...rest
}) {
  const inputId = id || `inp-${Math.random().toString(36).slice(2, 7)}`;
  const themeClass = theme === 'light' ? styles.light : styles.dark;

  const sharedProps = { disabled, id: inputId, ...rest };

  return (
    <div className={`${styles.fieldGroup} ${themeClass}`}>
      {label && type !== 'checkbox' && type !== 'toggle' && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      {/* ── Render by type ── */}
      {(type === 'text' || type === 'email' || type === 'number') && (
        <_TextInput
          type={type} placeholder={placeholder} value={value}
          onChange={onChange} error={error} icon={icon} suffix={suffix}
          styles={styles} {...sharedProps}
        />
      )}

      {type === 'password' && (
        <_PasswordInput
          placeholder={placeholder} value={value}
          onChange={onChange} error={error} icon={icon}
          styles={styles} {...sharedProps}
        />
      )}

      {type === 'search' && (
        <_SearchInput
          placeholder={placeholder} value={value}
          onChange={onChange} error={error}
          styles={styles} {...sharedProps}
        />
      )}

      {type === 'textarea' && (
        <_Textarea
          placeholder={placeholder} value={value}
          onChange={onChange} error={error} rows={rows}
          styles={styles} {...sharedProps}
        />
      )}

      {type === 'select' && (
        <_Select
          placeholder={placeholder} value={value}
          onChange={onChange} error={error} options={options}
          styles={styles} {...sharedProps}
        />
      )}

      {type === 'checkbox' && (
        <_Checkbox
          label={label} required={required} value={value}
          onChange={onChange} styles={styles} {...sharedProps}
        />
      )}

      {type === 'radio' && (
        <_RadioGroup
          options={options} value={value} name={name || inputId}
          onChange={onChange} styles={styles} disabled={disabled}
        />
      )}

      {type === 'toggle' && (
        <_Toggle
          label={label} required={required} value={value}
          onChange={onChange} styles={styles} {...sharedProps}
        />
      )}

      {type === 'file' && (
        <_FileUpload
          accept={accept} onChange={onChange}
          styles={styles} {...sharedProps}
        />
      )}

      {/* ── Error / Hint ── */}
      {error && (
        <span className={styles.error}>
          <FontAwesomeIcon icon={faCircleExclamation} />
          {error}
        </span>
      )}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Internal sub-components
───────────────────────────────────────────── */

function _TextInput({ type, placeholder, value, onChange, error, icon, suffix, styles, ...rest }) {
  return (
    <div className={styles.inputWrap}>
      {icon && (
        <span className={styles.iconWrap}>
          <FontAwesomeIcon icon={icon} />
        </span>
      )}
      <input
        type={type}
        className={`${styles.input} ${icon ? styles.hasIcon : ''} ${suffix ? styles.hasSuffixBadge : ''} ${error ? styles.hasError : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {suffix && <span className={styles.suffixBadge}>{suffix}</span>}
    </div>
  );
}

function _PasswordInput({ placeholder, value, onChange, error, icon, styles, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.inputWrap}>
      {icon && (
        <span className={styles.iconWrap}>
          <FontAwesomeIcon icon={icon} />
        </span>
      )}
      <input
        type={show ? 'text' : 'password'}
        className={`${styles.input} ${icon ? styles.hasIcon : ''} ${styles.hasSuffix} ${error ? styles.hasError : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
      <button
        type="button"
        className={styles.suffixBtn}
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        <FontAwesomeIcon icon={show ? faEyeSlash : faEye} />
      </button>
    </div>
  );
}

function _SearchInput({ placeholder, value, onChange, error, styles, ...rest }) {
  return (
    <div className={styles.inputWrap}>
      <span className={styles.iconWrap}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </span>
      <input
        type="search"
        className={`${styles.input} ${styles.hasIcon} ${value ? styles.hasSuffix : ''} ${error ? styles.hasError : ''}`}
        placeholder={placeholder || 'Buscar…'}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {value && (
        <button
          type="button"
          className={styles.suffixBtn}
          onClick={() => onChange({ target: { value: '' } })}
          tabIndex={-1}
          aria-label="Limpar busca"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
}

function _Textarea({ placeholder, value, onChange, error, rows, styles, ...rest }) {
  return (
    <textarea
      className={`${styles.input} ${styles.textarea} ${error ? styles.hasError : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      {...rest}
    />
  );
}

function _Select({ placeholder, value, onChange, error, options, styles, ...rest }) {
  return (
    <div className={`${styles.inputWrap} ${styles.selectWrap}`}>
      <select
        className={`${styles.input} ${error ? styles.hasError : ''}`}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <span className={styles.selectArrow}>
        <FontAwesomeIcon icon={faChevronDown} />
      </span>
    </div>
  );
}

function _Checkbox({ label, required, value, onChange, styles, id, disabled }) {
  return (
    <label className={styles.checkboxLabel} htmlFor={id}>
      <input
        type="checkbox"
        className={styles.checkboxInput}
        id={id}
        checked={!!value}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.checkboxBox}>
        <FontAwesomeIcon icon={faCheck} className={styles.checkmark} />
      </span>
      {label}
      {required && <span className={styles.required}> *</span>}
    </label>
  );
}

function _RadioGroup({ options, value, name, onChange, styles, disabled }) {
  return (
    <div className={styles.radioGroup}>
      {options.map(opt => (
        <label key={opt.value} className={styles.radioLabel}>
          <input
            type="radio"
            className={styles.radioInput}
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            disabled={disabled}
          />
          <span className={styles.radioDot} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function _Toggle({ label, required, value, onChange, styles, id, disabled }) {
  return (
    <label className={styles.toggleLabel} htmlFor={id}>
      <input
        type="checkbox"
        className={styles.toggleInput}
        id={id}
        checked={!!value}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.toggleTrack} />
      {label}
      {required && <span className={styles.required}> *</span>}
    </label>
  );
}

function _FileUpload({ accept, onChange, styles, disabled, id }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
    onChange?.(e);
  };

  return (
    <div
      className={`${styles.fileZone} ${dragging ? styles.fileDragOver : ''}`}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={() => setDragging(false)}
    >
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={styles.fileIcon}>
        <FontAwesomeIcon icon={faCloudArrowUp} />
      </span>
      <span className={styles.fileText}>
        <strong>Clique para selecionar</strong> ou arraste o arquivo aqui
      </span>
      {fileName && <span className={styles.fileName}>{fileName}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Named convenience exports
───────────────────────────────────────────── */
const make = (type) => (props) => <Input type={type} {...props} />;

export const InputText     = make('text');
export const InputEmail    = make('email');
export const InputPassword = make('password');
export const InputNumber   = make('number');
export const InputTextarea = make('textarea');
export const InputSelect   = make('select');
export const InputCheckbox = make('checkbox');
export const InputRadio    = make('radio');
export const InputToggle   = make('toggle');
export const InputFile     = make('file');
export const InputSearch   = make('search');

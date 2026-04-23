import { useEffect, useState } from "react"
import axios from "axios"
import Cookie from 'js-cookie'
import jwt from 'jsonwebtoken'
import Title from "../src/components/title/Title2"
import Link from "next/link"
import { FixedTopicsBottom } from "../src/components/fixedTopics"
import navbarHide from "../utils/navbarHide"
import { useDispatch, useSelector } from "react-redux"
import removeInputError from "../utils/removeInputError"
import baseUrl from "../utils/baseUrl"
import { SpinnerSM } from "../src/components/loading/Spinners"
import { useRouter } from "next/router"
import { addAlert } from "../store/Alerts/Alerts.actions"
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons"
import Input from "../src/components/Input"
import TitleLabel from "../src/components/TitleLabel"
import styles from "./passwordChange.module.scss"

export default function PasswordChange() {

    const token = jwt.decode(Cookie.get('auth'))
    const router = useRouter()
    const dispatch = useDispatch()
    const alertsArray = useSelector(state => state.alerts)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [oldPasswordError, setOldPasswordError] = useState('')
    const [newPasswordError, setNewPasswordError] = useState('')

    const [loadingSave, setLoadingSave] = useState(false)

    useEffect(() => {
        navbarHide(dispatch)
    }, [])

    const validate = () => {
        removeInputError()
        let oldErr = ''
        let newErr = ''

        if (!oldPassword) oldErr = 'Informe sua senha atual'
        if (!newPassword) newErr = 'Digite uma nova senha'
        else if (newPassword.length < 6) newErr = 'A senha deve ter no mínimo 6 caracteres'
        else if (newPassword !== confirmPassword) newErr = 'A confirmação não confere com a nova senha'

        setOldPasswordError(oldErr)
        setNewPasswordError(newErr)

        return !oldErr && !newErr
    }

    const handleSave = () => {
        if (!validate()) return

        setLoadingSave(true)
        axios.patch(`${baseUrl()}/api/passwordChange`, {
            user_id: token.sub,
            oldPassword,
            newPassword
        })
            .then(() => {
                dispatch(addAlert(alertsArray, [{ type: 'alert', message: 'Senha alterada com sucesso.' }]))
                setLoadingSave(false)
                router.push('/')
            })
            .catch(() => {
                setLoadingSave(false)
                setOldPasswordError('Senha atual incorreta')
            })
    }

    return (
        <div>
            <Title title="Alterar senha" subtitle="Mantenha sua conta segura com uma senha forte" backButton="/" />

            <div className={`pagesContent-sm ${styles.page}`}>

                <TitleLabel>Senha atual</TitleLabel>
                <div className={styles.section}>
                    <Input
                        type="password"
                        label="Senha atual"
                        id="oldPasswordInput"
                        icon={faLock}
                        value={oldPassword}
                        onChange={e => { setOldPassword(e.target.value); setOldPasswordError('') }}
                        placeholder="Digite sua senha atual"
                        error={oldPasswordError}
                        required
                    />
                </div>

                <TitleLabel>Nova senha</TitleLabel>
                <div className={styles.section}>
                    <div className="row g-3">
                        <div className="col-12 col-md-6">
                            <Input
                                type="password"
                                label="Nova senha"
                                id="newPasswordInput"
                                icon={faLockOpen}
                                value={newPassword}
                                onChange={e => { setNewPassword(e.target.value); setNewPasswordError('') }}
                                placeholder="Mínimo 6 caracteres"
                                error={newPasswordError}
                                required
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <Input
                                type="password"
                                label="Confirmar nova senha"
                                id="confirmPasswordInput"
                                icon={faLock}
                                value={confirmPassword}
                                onChange={e => { setConfirmPassword(e.target.value); setNewPasswordError('') }}
                                placeholder="Repita a nova senha"
                                error={newPasswordError ? ' ' : ''}
                                required
                            />
                        </div>
                    </div>
                </div>

                <FixedTopicsBottom>
                    <div className={styles.footerBar}>
                        <Link href="/" className={styles.btnCancel}>
                            Cancelar
                        </Link>
                        {loadingSave ? (
                            <button className={styles.btnSave} disabled>
                                <SpinnerSM />
                            </button>
                        ) : (
                            <button className={styles.btnSave} onClick={handleSave}>
                                Salvar alterações
                            </button>
                        )}
                    </div>
                </FixedTopicsBottom>
            </div>
        </div>
    )
}

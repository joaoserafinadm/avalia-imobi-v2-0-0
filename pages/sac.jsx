import Title from "../src/components/title/Title2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleExclamation, faEnvelope, faLocationDot, faPaperPlane, faPhone, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useDispatch } from "react-redux";
import navbarHide from "../utils/navbarHide";
import Input from "../src/components/Input";
import TitleLabel from "../src/components/TitleLabel";
import { SpinnerSM } from "../src/components/loading/Spinners";
import styles from "./sac.module.scss";

export default function Sac() {

    const token = jwt.decode(Cookie.get('auth'))
    const dispatch = useDispatch()

    const [text, setText] = useState('')
    const [errorText, setErrorText] = useState('')

    const [loading, setLoading] = useState(false)
    const [errorLoading, setErrorLoading] = useState(false)

    const [questionStatus, setQuestionStatus] = useState(null) // 'success' | 'error' | null
    const [reportStatus, setReportStatus] = useState(null)

    useEffect(() => { navbarHide(dispatch) }, [])

    const handleSend = async (type) => {
        const value = type === 'question' ? text : errorText
        if (!value.trim()) return

        if (type === 'question') setLoading(true)
        else setErrorLoading(true)

        try {
            await axios.post(`/api/sac`, {
                company_id: token.company_id,
                user_id: token.sub,
                type,
                text: value
            })
            if (type === 'question') { setQuestionStatus('success'); setText('') }
            else { setReportStatus('success'); setErrorText('') }
        } catch {
            if (type === 'question') setQuestionStatus('error')
            else setReportStatus('error')
        } finally {
            if (type === 'question') setLoading(false)
            else setErrorLoading(false)
        }
    }

    return (
        <div>
            <Title title="Fale Conosco" subtitle="Suporte direto com nossa equipe" backButton="/" />

            <div className={`pagesContent ${styles.page}`}>
                <div className={styles.grid}>

                    {/* ── Forms ── */}
                    <div>
                        <TitleLabel>Enviar mensagem</TitleLabel>
                        <div className={styles.section}>
                            <p className={styles.sectionDesc}>
                                Tem alguma dúvida, sugestão ou precisa de ajuda? Escreva abaixo e nossa equipe responderá em breve.
                            </p>
                            <Input
                                type="textarea"
                                label="Sua mensagem"
                                placeholder="Digite sua dúvida ou comentário..."
                                value={text}
                                onChange={e => { setText(e.target.value); setQuestionStatus(null) }}
                                rows={4}
                            />
                            {questionStatus === 'success' && (
                                <div className={styles.feedbackSuccess}>
                                    <FontAwesomeIcon icon={faCheck} />
                                    Solicitação enviada! Em breve retornaremos seu contato.
                                </div>
                            )}
                            {questionStatus === 'error' && (
                                <div className={styles.feedbackError}>
                                    <FontAwesomeIcon icon={faCircleExclamation} />
                                    Erro ao enviar. Tente novamente mais tarde.
                                </div>
                            )}
                            <div className={styles.sectionFooter}>
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => handleSend('question')}
                                    disabled={loading || !text.trim()}
                                >
                                    {loading ? <SpinnerSM /> : <FontAwesomeIcon icon={faPaperPlane} />}
                                    {loading ? 'Enviando…' : 'Enviar mensagem'}
                                </button>
                            </div>
                        </div>

                        <TitleLabel>Reportar erro</TitleLabel>
                        <div className={styles.section}>
                            <p className={styles.sectionDesc}>
                                Encontrou algo que não está funcionando corretamente? Descreva o problema e iremos verificar.
                            </p>
                            <Input
                                type="textarea"
                                label="Descrição do erro"
                                placeholder="Descreva o que aconteceu e em qual parte da plataforma..."
                                value={errorText}
                                onChange={e => { setErrorText(e.target.value); setReportStatus(null) }}
                                rows={4}
                            />
                            {reportStatus === 'success' && (
                                <div className={styles.feedbackSuccess}>
                                    <FontAwesomeIcon icon={faCheck} />
                                    Erro reportado com sucesso. Obrigado pelo feedback!
                                </div>
                            )}
                            {reportStatus === 'error' && (
                                <div className={styles.feedbackError}>
                                    <FontAwesomeIcon icon={faCircleExclamation} />
                                    Erro ao enviar. Tente novamente mais tarde.
                                </div>
                            )}
                            <div className={styles.sectionFooter}>
                                <button
                                    className={styles.btnDanger}
                                    onClick={() => handleSend('error')}
                                    disabled={errorLoading || !errorText.trim()}
                                >
                                    {errorLoading ? <SpinnerSM /> : <FontAwesomeIcon icon={faTriangleExclamation} />}
                                    {errorLoading ? 'Enviando…' : 'Reportar erro'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Contact card ── */}
                    <div className={styles.contactCard}>
                        <div className={styles.contactLogo}>
                            <img src="/LOGO_01.png" alt="Avalia Imobi" />
                        </div>

                        <div className={styles.contactBody}>
                            <div className={styles.contactItem}>
                                <span className={styles.contactItemIcon}>
                                    <FontAwesomeIcon icon={faLocationDot} />
                                </span>
                                <div className={styles.contactItemText}>
                                    <p className={styles.contactItemLabel}>Endereço</p>
                                    <p className={styles.contactItemValue}>
                                        Rua Pedro Álvares Cabral, 610, Apt 701<br />
                                        Centro, Erechim — RS<br />
                                        CEP 99700-252
                                    </p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <span className={styles.contactItemIcon}>
                                    <FontAwesomeIcon icon={faPhone} />
                                </span>
                                <div className={styles.contactItemText}>
                                    <p className={styles.contactItemLabel}>Telefone</p>
                                    <p className={styles.contactItemValue}>(54) 99906-7474</p>
                                </div>
                            </div>

                            <div className={styles.contactItem}>
                                <span className={styles.contactItemIcon}>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <div className={styles.contactItemText}>
                                    <p className={styles.contactItemLabel}>E-mail</p>
                                    <p className={styles.contactItemValue}>contato@avaliaimobi.com.br</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.socialRow}>
                            <a
                                href="https://api.whatsapp.com/send?phone=5554999067474"
                                target="_blank"
                                rel="noreferrer"
                                className={styles.socialBtnWhatsapp}
                                title="WhatsApp"
                            >
                                <FontAwesomeIcon icon={faWhatsapp} />
                            </a>
                            <a
                                href="https://www.instagram.com/avaliaimobi/"
                                target="_blank"
                                rel="noreferrer"
                                className={styles.socialBtnInstagram}
                                title="Instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a
                                href="https://www.facebook.com/avalia.imobi/"
                                target="_blank"
                                rel="noreferrer"
                                className={styles.socialBtnFacebook}
                                title="Facebook"
                            >
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

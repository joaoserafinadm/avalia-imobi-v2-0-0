import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons"
import { driver } from "driver.js"
import tours from "./tours"
import styles from "./GuideTour.module.scss"

/* ─────────────────────────────────────────────
   GuideTour

   Botão que inicia o guia interativo da página.
   Fica alinhado ao canto superior direito do conteúdo.

   Props:
     tour   string – chave do roteiro em tours.js (ex: "index")
     label  string – texto do botão (padrão: "Guia da página")
     inline bool   – renderiza apenas o botão, em formato compacto,
                     para ser encaixado no cabeçalho da página
     beforeStart fn – prepara a tela antes do guia começar (por
                     exemplo, selecionar um tipo de imóvel para que o
                     formulário completo apareça)
     waitFor string – seletor que indica que a preparação terminou;
                     o guia só começa quando ele estiver visível

   O botão não é renderizado quando o usuário desativa
   os guias em Configurações (store.guideTour) ou quando
   nenhum elemento do roteiro existe na tela.
───────────────────────────────────────────── */

// O driver.js usa scrollIntoView para trazer o elemento à tela.
// Como o cabeçalho é fixo, os elementos do roteiro recebem este
// atributo antes do guia começar — o scroll-margin-top definido em
// styles/driverTheme.scss faz a rolagem parar abaixo do cabeçalho.
const SCROLL_ANCHOR_ATTR = "data-guide-anchor"

// Seletor reservado: em vez de procurar no documento, o passo é
// resolvido para o botão deste próprio GuideTour. Pode haver mais de
// um na tela (o da página e o de um modal, por exemplo) e cada guia
// precisa destacar o seu.
export const GUIDE_BUTTON_STEP = "#tourGuideButton"

export default function GuideTour({
    tour,
    label = "Guia da página",
    inline = false,
    beforeStart,
    waitFor,
}) {

    const guideTourEnabled = useSelector(state => state.guideTour)
    const driverRef = useRef(null)
    const anchorsRef = useRef([])
    const buttonRef = useRef(null)
    const scrollListenersRef = useRef([])

    const clearScrollAnchors = () => {
        anchorsRef.current.forEach(element => element.removeAttribute(SCROLL_ANCHOR_ATTR))
        anchorsRef.current = []
    }

    /* O driver.js só observa a rolagem da janela. Quando o guia roda
       dentro de um container com rolagem própria — o corpo de um modal,
       por exemplo — o destaque não acompanha a rolagem e acaba desenhado
       sobre outro elemento. Aqui escutamos esses containers e pedimos ao
       driver.js para recalcular a posição. */
    const clearScrollListeners = () => {
        scrollListenersRef.current.forEach(({ element, handler }) =>
            element.removeEventListener('scroll', handler))
        scrollListenersRef.current = []
    }

    const findScrollContainer = (element) => {
        let parent = element?.parentElement

        while (parent && parent !== document.body) {
            const { overflowY } = window.getComputedStyle(parent)
            const scrolls = overflowY === 'auto' || overflowY === 'scroll'

            if (scrolls && parent.scrollHeight > parent.clientHeight) return parent

            parent = parent.parentElement
        }

        return null
    }

    const watchScrollContainers = (elements) => {
        const handler = () => driverRef.current?.refresh()
        const containers = new Set()

        elements.forEach(element => {
            const container = findScrollContainer(element)
            if (container) containers.add(container)
        })

        scrollListenersRef.current = [...containers].map(element => {
            element.addEventListener('scroll', handler, { passive: true })
            return { element, handler }
        })
    }

    // Encerra o guia ao desmontar a página
    useEffect(() => {
        return () => {
            driverRef.current?.destroy()
            driverRef.current = null
            clearScrollAnchors()
            clearScrollListeners()
        }
    }, [])

    if (guideTourEnabled === false) return null

    const config = tours[tour]
    if (!config?.steps?.length) return null

    // Um passo só é exibido se o elemento existir e estiver visível.
    // Evita destacar áreas ocultas, como o menu lateral recolhido, a
    // barra de menu no desktop ou abas que não estão em primeiro plano.
    const isElementVisible = (element) => {
        const rect = element.getBoundingClientRect()
        if (!rect.width || !rect.height) return false
        if (rect.right <= 0 || rect.left >= window.innerWidth) return false

        return true
    }

    const resolveElement = (selector) =>
        selector === GUIDE_BUTTON_STEP ? buttonRef.current : document.querySelector(selector)

    const startTour = () => {
        // Os passos são resolvidos para elementos: assim o driver.js não
        // reconsulta o seletor e cada guia destaca os seus próprios alvos.
        const steps = config.steps
            .map(step => {
                if (!step.element) return step

                const element = resolveElement(step.element)
                if (!element || !isElementVisible(element)) return null

                return { ...step, element }
            })
            .filter(Boolean)

        if (!steps.length) return

        driverRef.current?.destroy()

        // Marca os alvos antes de iniciar: o driver.js rola até o
        // elemento antes de aplicar suas próprias classes, então o
        // scroll-margin precisa já estar valendo no primeiro passo.
        clearScrollAnchors()
        anchorsRef.current = steps
            .map(step => step.element)
            .filter(element => element instanceof Element)
        anchorsRef.current.forEach(element => element.setAttribute(SCROLL_ANCHOR_ATTR, ""))

        driverRef.current = driver({
            steps,
            showProgress: true,
            allowClose: true,
            // Rolagem instantânea: o driver.js mede o elemento logo após
            // rolar e, com rolagem suave, mediria com o conteúdo ainda em
            // movimento — o destaque acabaria sobre o elemento errado.
            smoothScroll: false,
            overlayColor: 'rgba(0, 0, 0, 0.65)',
            stagePadding: 6,
            stageRadius: 12,
            popoverClass: 'avaliaGuidePopover',
            progressText: 'Etapa {{current}} de {{total}}',
            nextBtnText: 'Avançar',
            prevBtnText: 'Voltar',
            doneBtnText: 'Concluir',
            onDestroyed: () => {
                driverRef.current = null
                clearScrollAnchors()
                clearScrollListeners()
            },
        })

        clearScrollListeners()
        watchScrollContainers(anchorsRef.current)

        driverRef.current.drive()
    }

    const handleStart = () => {
        if (!beforeStart) {
            startTour()
            return
        }

        beforeStart()

        // A preparação pode revelar partes da tela que ainda não estavam
        // renderizadas; só resolvemos os passos depois que elas aparecem.
        if (!waitFor) {
            window.requestAnimationFrame(startTour)
            return
        }

        const deadline = Date.now() + 2000

        const tick = () => {
            const element = document.querySelector(waitFor)

            if ((element && isElementVisible(element)) || Date.now() > deadline) {
                startTour()
                return
            }

            window.requestAnimationFrame(tick)
        }

        tick()
    }

    const button = (
        <button
            type="button"
            ref={buttonRef}
            className={inline ? styles.guideBtnInline : styles.guideBtn}
            onClick={handleStart}
            title={config.title || label}
        >
            <FontAwesomeIcon icon={faCircleQuestion} />
            <span className={styles.guideBtnLabel}>{label}</span>
        </button>
    )

    // No modo inline o botão é posicionado por quem o renderiza
    // (o cabeçalho da página, por exemplo), sem faixa própria.
    if (inline) return button

    return <div className={styles.wrap}>{button}</div>
}

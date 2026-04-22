import { faBars, faDownload, faPlusCircle, faCrop, faCheck, faTimes, faArrowLeft, faTrashAlt, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useRef, useEffect } from 'react'
import { createImageUrl } from '../../utils/createImageUrl'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import tippy from 'tippy.js'
import ImageCrop from './ImageCrop'
import Modal, { ModalBtnPrimary, ModalBtnSecondary } from '../components/Modal'

export default function ImageHeaderModal(props) {

    const token = jwt.decode(Cookies.get('auth'))
    const fileInputRef = useRef(null)
    const carouselRef = useRef(null)

    const [headerImgPreview, setHeaderImgPreview] = useState('')
    const [showCropper, setShowCropper] = useState(false)
    const [originalImageSrc, setOriginalImageSrc] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => { tooltipFunction() }, 500)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (carouselRef.current && window.bootstrap) {
            new window.bootstrap.Carousel(carouselRef.current, {
                interval: false,
                wrap: false,
                keyboard: false,
                touch: false,
            })
        }
    }, [])

    const tooltipFunction = () => {
        tippy('#addHeaderImagBtn', {
            content: 'Adicionar foto de capa',
            placement: 'bottom',
        })
    }

    const goToSlide = (slideIndex) => {
        if (carouselRef.current && window.bootstrap) {
            const carousel = window.bootstrap.Carousel.getInstance(carouselRef.current)
            if (carousel) {
                carousel.to(slideIndex)
                setCurrentSlide(slideIndex)
            }
        }
    }

    const handleFileSelect = (file) => {
        if (!file) return
        if (!file.type.startsWith('image/')) { alert('Por favor, selecione apenas arquivos de imagem.'); return }
        if (file.size > 10 * 1024 * 1024) { alert('A imagem deve ter no máximo 10MB.'); return }
        const reader = new FileReader()
        reader.onload = (e) => {
            setOriginalImageSrc(e.target.result)
            setShowCropper(true)
            goToSlide(1)
        }
        reader.readAsDataURL(file)
    }

    const handleCropConfirm = async (croppedBlob) => {
        setIsLoading(true)
        try {
            const croppedFile = new File([croppedBlob], 'cropped-header.jpg', { type: 'image/jpeg' })
            await handleUploadImage(token.company_id, croppedFile)
            handleCropCancel()
        } catch (error) {
            console.error('Erro ao processar imagem:', error)
            alert('Erro ao processar a imagem. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCropCancel = () => {
        setShowCropper(false)
        setOriginalImageSrc(null)
        goToSlide(0)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleUploadImage = async (company_id, file) => {
        try {
            const newHeaderImgUrl = await createImageUrl([file], 'AVALIAIMOBI_HEADER_IMG')
            const data = {
                company_id,
                user_id: token.sub,
                imageUrl: newHeaderImgUrl[0].url,
            }
            const response = await axios.post(`${baseUrl()}/api/companyEdit/headerImg`, data)
            props.backgroundImagesData()
            setHeaderImgPreview(response.data.newId)
        } catch (error) {
            console.error('Erro ao fazer upload:', error)
            throw error
        }
    }

    const handleDeleteImg = async (company_id, id) => {
        if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
            if (headerImgPreview === id) setHeaderImgPreview('')
            try {
                await axios.delete(`${baseUrl()}/api/companyEdit/headerImg`, {
                    params: { company_id, backgroundImg_id: id },
                })
                props.backgroundImagesData()
            } catch (error) {
                console.error('Erro ao deletar imagem:', error)
                alert('Erro ao deletar a imagem. Tente novamente.')
            }
        }
    }

    /* ── footer dinâmico por slide ── */
    const footer = currentSlide === 0 ? (
        <>
            <ModalBtnSecondary>Cancelar</ModalBtnSecondary>
            <ModalBtnPrimary
                icon={faCheck}
                onClick={() => props.setBackgroundImg_id(headerImgPreview)}
                disabled={!headerImgPreview}
            >
                Selecionar
            </ModalBtnPrimary>
        </>
    ) : (
        <ModalBtnSecondary dismiss={false} onClick={handleCropCancel} icon={faArrowLeft}>
            Voltar
        </ModalBtnSecondary>
    )

    return (
        <Modal
            id="ImageHeaderModal"
            title={currentSlide === 0 ? 'Imagem de capa' : 'Ajustar imagem'}
            subtitle={currentSlide === 0 ? 'Selecione ou adicione uma imagem de capa' : 'Posicione e ajuste o recorte'}
            icon={faImage}
            size="xl"
            footer={footer}
        >
            {/* Bootstrap carousel — estrutura preservada */}
            <div
                id="imageHeaderCarousel"
                className="carousel slide"
                data-bs-ride="false"
                ref={carouselRef}
            >
                <div className="carousel-inner">

                    {/* ── Slide 0: Seleção ── */}
                    <div className="carousel-item active">

                        {/* Banner informativo */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            background: 'rgba(245,135,79,0.06)',
                            border: '1px solid rgba(245,135,79,0.18)',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            marginBottom: '1.25rem',
                        }}>
                            <FontAwesomeIcon
                                icon={faCrop}
                                style={{ color: '#f5874f', fontSize: '0.8rem', marginTop: '3px', flexShrink: 0 }}
                            />
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                                <strong style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>Como funciona:</strong>
                                <ul style={{ margin: '6px 0 0', paddingLeft: '1rem' }}>
                                    <li>Selecione uma das imagens pré-definidas ou adicione uma personalizada</li>
                                    <li>Novas imagens serão ajustadas para formato 16:9</li>
                                    <li>Use o editor para posicionar e ajustar sua imagem</li>
                                </ul>
                            </div>
                        </div>

                        {/* Grid de imagens */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>

                            {props.backgroundImages?.map((elem, index) => {
                                const isSelected = headerImgPreview === elem._id
                                return (
                                    <div
                                        key={elem._id}
                                        onClick={() => setHeaderImgPreview(elem._id)}
                                        style={{
                                            background: 'rgba(255,255,255,0.02)',
                                            border: isSelected
                                                ? '1.5px solid rgba(245,135,79,0.55)'
                                                : '1px solid rgba(255,255,255,0.06)',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            boxShadow: isSelected
                                                ? '0 0 0 3px rgba(245,135,79,0.12), 0 8px 24px rgba(245,135,79,0.1)'
                                                : 'none',
                                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Imagem 16:9 */}
                                        <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
                                            <img
                                                src={elem.imageUrl}
                                                alt={`Modelo ${index + 1}`}
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                            />
                                        </div>

                                        {/* Footer do card */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px 12px',
                                        }}>
                                            <span style={{
                                                fontFamily: "'DM Sans', sans-serif",
                                                fontSize: '0.75rem',
                                                fontWeight: 500,
                                                color: isSelected ? '#f5874f' : 'rgba(255,255,255,0.45)',
                                                transition: 'color 0.2s ease',
                                            }}>
                                                Modelo {index + 1}
                                            </span>
                                            <button
                                                onClick={e => { e.stopPropagation(); handleDeleteImg(token.company_id, elem._id) }}
                                                title="Deletar imagem"
                                                style={{
                                                    background: 'rgba(248,113,113,0.08)',
                                                    border: '1px solid rgba(248,113,113,0.2)',
                                                    borderRadius: '7px',
                                                    color: '#f87171',
                                                    fontSize: '0.72rem',
                                                    cursor: 'pointer',
                                                    padding: '4px 9px',
                                                    transition: 'background 0.18s ease',
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </div>

                                        {/* Checkmark selecionado */}
                                        {isSelected && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '8px',
                                                right: '8px',
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: '#f5874f',
                                                border: '2px solid #0d1420',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.6rem',
                                                color: '#0d1420',
                                            }}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {/* Card adicionar nova imagem */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => handleFileSelect(e.target.files[0])}
                            />
                            <div
                                id="addHeaderImagBtn"
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    background: 'rgba(255,255,255,0.01)',
                                    border: '1.5px dashed rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    padding: '2rem 1rem',
                                    cursor: 'pointer',
                                    minHeight: '140px',
                                    transition: 'border-color 0.2s ease, background 0.2s ease',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'rgba(245,135,79,0.35)'
                                    e.currentTarget.style.background = 'rgba(245,135,79,0.03)'
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.01)'
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faPlusCircle}
                                    style={{ fontSize: '1.6rem', color: 'rgba(245,135,79,0.5)' }}
                                />
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: 'rgba(245,135,79,0.8)',
                                        margin: '0 0 4px',
                                    }}>
                                        Adicionar imagem
                                    </p>
                                    <p style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.7rem',
                                        color: 'rgba(255,255,255,0.25)',
                                        margin: 0,
                                    }}>
                                        JPG, PNG · Máx 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Loading overlay */}
                        {isLoading && currentSlide === 0 && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(13,20,32,0.8)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '14px',
                                zIndex: 10,
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="spinner-border" role="status"
                                        style={{ color: '#f5874f', width: '2rem', height: '2rem' }}>
                                        <span className="visually-hidden">Processando...</span>
                                    </div>
                                    <p style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.78rem',
                                        color: 'rgba(255,255,255,0.45)',
                                        marginTop: '10px',
                                        marginBottom: 0,
                                    }}>
                                        Processando imagem...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Slide 1: Crop ── */}
                    <div className="carousel-item">
                        <div style={{ minHeight: '400px' }}>
                            {showCropper && originalImageSrc && (
                                <ImageCrop
                                    imageSrc={originalImageSrc}
                                    onConfirm={handleCropConfirm}
                                    onCancel={handleCropCancel}
                                    aspectRatio={16 / 9}
                                    isLoading={isLoading}
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </Modal>
    )
}

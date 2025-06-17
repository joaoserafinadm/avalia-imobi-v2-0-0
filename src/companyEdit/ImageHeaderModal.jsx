import { faBars, faDownload, faPlusCircle, faCrop, faCheck, faTimes, faArrowLeft, faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useRef, useEffect } from "react"
import { createImageUrl } from "../../utils/createImageUrl"
import axios from "axios"
import baseUrl from "../../utils/baseUrl"
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import tippy from "tippy.js"
import ImageCrop from "./ImageCrop" // Importar o componente de crop

export default function ImageHeaderModal(props) {

    const token = jwt.decode(Cookies.get("auth"));
    const fileInputRef = useRef(null);
    const carouselRef = useRef(null);

    const [headerImgPreview, setHeaderImgPreview] = useState('')
    const [showCropper, setShowCropper] = useState(false)
    const [originalImageSrc, setOriginalImageSrc] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0) // 0 = seleção, 1 = crop

    useEffect(() => {
        const timer = setTimeout(() => {
            tooltipFunction()
        }, 500)
        
        return () => clearTimeout(timer) // Cleanup do timeout
    }, [])

    useEffect(() => {
        // Inicializar o carousel do Bootstrap quando o componente montar
        if (carouselRef.current && window.bootstrap) {
            const carousel = new window.bootstrap.Carousel(carouselRef.current, {
                interval: false, // Desabilita auto-play
                wrap: false, // Desabilita loop
                keyboard: false, // Desabilita controle por teclado
                touch: false // Desabilita controle por touch
            });
        }
    }, [])

    const tooltipFunction = () => {
        tippy('#addHeaderImagBtn', {
            content: "Adicionar foto de capa",
            placement: "bottom",
        })
    }

    const goToSlide = (slideIndex) => {
        if (carouselRef.current && window.bootstrap) {
            const carousel = window.bootstrap.Carousel.getInstance(carouselRef.current);
            if (carousel) {
                carousel.to(slideIndex);
                setCurrentSlide(slideIndex);
            }
        }
    }

    const handleFileSelect = (file) => {
        if (!file) return;

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }

        // Validar tamanho (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setOriginalImageSrc(e.target.result);
            setShowCropper(true);
            goToSlide(1); // Vai para o slide do crop
        };
        reader.readAsDataURL(file);
    };

    const handleCropConfirm = async (croppedBlob) => {
        setIsLoading(true);
        try {
            const croppedFile = new File([croppedBlob], 'cropped-header.jpg', { type: 'image/jpeg' });
            await handleUploadImage(token.company_id, croppedFile);
            handleCropCancel(); // Voltar para a seleção
        } catch (error) {
            console.error('Erro ao processar imagem:', error);
            alert('Erro ao processar a imagem. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setOriginalImageSrc(null);
        goToSlide(0); // Volta para o slide de seleção

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadImage = async (company_id, file) => {
        try {
            const newHeaderImgUrl = await createImageUrl([file], "AVALIAIMOBI_HEADER_IMG")

            console.log('newHeaderImgUrl[0].url', newHeaderImgUrl[0].url)
            const data = {
                company_id: company_id,
                user_id: token.sub,
                imageUrl: newHeaderImgUrl[0].url
            }

            const response = await axios.post(`${baseUrl()}/api/companyEdit/headerImg`, data)
            props.backgroundImagesData()
            setHeaderImgPreview(response.data.newId)
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            throw error; // Re-throw para ser capturado pelo handleCropConfirm
        }
    }

    const handleDeleteImg = async (company_id, id) => {
        if (window.confirm('Tem certeza que deseja deletar esta imagem?')) {
            if (headerImgPreview === id) {
                setHeaderImgPreview('')
            }

            try {
                await axios.delete(`${baseUrl()}/api/companyEdit/headerImg`, {
                    params: {
                        company_id,
                        backgroundImg_id: id
                    }
                })
                props.backgroundImagesData()
            } catch (error) {
                console.error('Erro ao deletar imagem:', error);
                alert('Erro ao deletar a imagem. Tente novamente.');
            }
        }
    }

    return (
        <>
            <div className="modal fade" id="ImageHeaderModal" tabIndex="-1" aria-labelledby="ImageHeaderModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-scrollable modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title title-dark" id="ImageHeaderModalLabel">
                                {currentSlide === 0 ? 'Imagem de capa' : 'Ajustar imagem'}
                            </h5>
                            <div className="d-flex align-items-center">
                                {currentSlide === 1 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm me-2"
                                        onClick={handleCropCancel}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                                        Voltar
                                    </button>
                                )}
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        </div>

                        <div
                            id="imageHeaderCarousel"
                            className="carousel slide"
                            data-bs-ride="false"
                            ref={carouselRef}
                        >
                            <div className="carousel-inner">
                                {/* Slide 1: Seleção de Imagem */}
                                <div className="carousel-item active">
                                    <div className="modal-body p-0">
                                        <div className="p-4" style={{ minHeight: '500px' }}>
                                            {/* Alert informativo */}
                                            <div className="alert alert-info border-0 bg-light" role="alert">
                                                <div className="d-flex">
                                                    <div className="flex-shrink-0">
                                                        <FontAwesomeIcon icon={faCrop} className="text-info" />
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <strong>Como funciona:</strong>
                                                        <ul className="mb-0 mt-2">
                                                            <li>Selecione uma das imagens pré-definidas ou adicione uma personalizada</li>
                                                            <li>Novas imagens serão automaticamente ajustadas para formato 16:9 (ideal para desktop)</li>
                                                            <li>Use o editor para posicionar e ajustar sua imagem perfeitamente</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Grid de imagens */}
                                            <div className="row g-3">
                                                {props.backgroundImages?.map((elem, index) => (
                                                    <div key={elem._id} className="col-12 col-sm-6 col-lg-4">
                                                        <div className="position-relative">
                                                            <div
                                                                className={`card h-100 overflow-hidden cursor-pointer shadow-sm transition-all ${headerImgPreview === elem._id
                                                                    ? 'border-orange border-3 bg-opacity-10'
                                                                    : 'border-light hover-lift'
                                                                    }`}
                                                                onClick={() => setHeaderImgPreview(elem._id)}
                                                            >
                                                                {/* Container da imagem com aspect ratio fixo */}
                                                                <div className="image-container position-relative overflow-hidden">
                                                                    <img
                                                                        src={elem.imageUrl}
                                                                        className="card-img w-100 h-100"
                                                                        alt={`Opção ${index + 1}`}
                                                                        loading="lazy"
                                                                    />
                                                                    {headerImgPreview === elem._id && (
                                                                        <div className="position-absolute top-0 end-0 p-2 fadeItem">
                                                                            <div className="bg-orange text-white rounded-circle d-flex align-items-center justify-content-center border border-white"
                                                                                style={{ width: '35px', height: '35px' }}>
                                                                                <FontAwesomeIcon icon={faCheck} />
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="card-body p-3">
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div>
                                                                            <h6 className="card-title mb-0">Modelo {index + 1}</h6>
                                                                        </div>
                                                                        <div className="d-flex gap-1">
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDeleteImg(token.company_id, elem._id);
                                                                                }}
                                                                                className="btn btn-outline-danger btn-sm"
                                                                                title="Deletar imagem"
                                                                            >
                                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Card para adicionar nova imagem */}
                                                <div className="col-12 col-sm-6 col-lg-4">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/*"
                                                        className="d-none"
                                                        onChange={e => handleFileSelect(e.target.files[0])}
                                                    />
                                                    <div
                                                        id="addHeaderImagBtn"
                                                        className="card h-100 d-flex justify-content-center align-items-center text-center border-2 border-dashed hover-bg-light transition-all cursor-pointer add-image-card"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <div className="p-4">
                                                            <div className="mb-3">
                                                                <FontAwesomeIcon icon={faPlusCircle} className="text-primary" size="3x" />
                                                            </div>
                                                            <h6 className="text-primary mb-2">Adicionar nova imagem</h6>
                                                            <p className="text-muted small mb-0">
                                                                Clique para selecionar uma imagem do seu dispositivo
                                                                <br />
                                                                <small className="text-muted">JPG, PNG • Máx 10MB</small>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Loading overlay para a seleção */}
                                        {isLoading && currentSlide === 0 && (
                                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
                                                <div className="text-center bg-white p-4 rounded shadow">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Processando...</span>
                                                    </div>
                                                    <p className="text-muted mt-2 mb-0">Processando sua imagem...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="modal-footer bg-light">
                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                            <FontAwesomeIcon icon={faTimes} className="me-1" />
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-orange"
                                            data-bs-dismiss="modal"
                                            onClick={() => props.setBackgroundImg_id(headerImgPreview)}
                                            disabled={!headerImgPreview}
                                        >
                                            <FontAwesomeIcon icon={faCheck} className="me-1" />
                                            Selecionar imagem
                                        </button>
                                    </div>
                                </div>

                                {/* Slide 2: Image Crop */}
                                <div className="carousel-item">
                                    <div className="modal-body p-0" style={{ minHeight: '500px' }}>
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
                    </div>
                </div>
            </div>

            <style jsx>{`
                .border-dashed {
                    border: 2px dashed #dee2e6 !important;
                }
                
                .hover-lift:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                
                .hover-bg-light:hover {
                    background-color: #f8f9fa !important;
                }
                
                .transition-all {
                    transition: all 0.2s ease-in-out;
                }
                
                .cursor-pointer {
                    cursor: pointer;
                }
                
                .carousel-item {
                    transition: transform 0.3s ease-in-out;
                }
                
                /* Container da imagem com aspect ratio fixo para evitar distorção */
                .image-container {
                    aspect-ratio: 16/9;
                    background-color: #f8f9fa;
                }
                
                .image-container img {
                    object-fit: cover;
                    object-position: center;
                }
                
                /* Card de adicionar imagem com altura mínima consistente */
                .add-image-card {
                    min-height: 280px; /* Altura similar aos cards das imagens */
                }
                
                /* Responsividade melhorada */
                @media (max-width: 576px) {
                    .image-container {
                        aspect-ratio: 4/3; /* Aspect ratio mais adequado para mobile */
                    }
                    
                    .add-image-card {
                        min-height: 250px;
                    }
                }
                
                @media (max-width: 768px) {
                    .modal-xl {
                        margin: 0.5rem;
                    }
                    
                    .p-4 {
                        padding: 1rem !important;
                    }
                }
                
                /* Melhorias de acessibilidade */
                .card:focus-visible {
                    outline: 2px solid #0d6efd;
                    outline-offset: 2px;
                }
                
                /* Animação suave para o estado selecionado */
                .border-orange {
                    border-color: #fd7e14 !important;
                    animation: pulseGlow 2s infinite;
                }
                
                @keyframes pulseGlow {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(253, 126, 20, 0.4);
                    }
                    50% {
                        box-shadow: 0 0 0 8px rgba(253, 126, 20, 0);
                    }
                }
                
                .fadeItem {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </>
    )
}
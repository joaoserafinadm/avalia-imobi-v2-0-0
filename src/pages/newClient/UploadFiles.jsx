import { useState, useEffect, useRef } from "react"
import StyledDropzone from "../../components/styledDropzone/StyledDropzone"
import { useDispatch, useSelector } from "react-redux"
import { setFiles } from "../../../store/NewClientForm/NewClientForm.actions"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { ChevronLeft, ChevronRight, Star, Trash2Icon } from "lucide-react"

export default function UploadFiles(props) {
    const newClientForm = useSelector(state => state.newClientForm)
    const dispatch = useDispatch()
    const scrollContainerRef = useRef(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)

    useEffect(() => {
        props.setFiles(props.files)
    }, [props.files?.length])

    // Função para verificar se precisa mostrar as setas de scroll
    const checkScrollButtons = () => {
        const container = scrollContainerRef.current
        if (container) {
            setShowLeftArrow(container.scrollLeft > 0)
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth
            )
        }
    }

    // Atualiza as setas quando as imagens mudam
    useEffect(() => {
        checkScrollButtons()
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkScrollButtons)
            return () => container.removeEventListener('scroll', checkScrollButtons)
        }
    }, [props.files])

    const handleOrderChange = (result) => {
        const { source, destination } = result

        if (!destination) return

        const reorderedFiles = Array.from(props.files)
        const [movedItem] = reorderedFiles.splice(source.index, 1)
        reorderedFiles.splice(destination.index, 0, movedItem)

        props.setFiles(reorderedFiles)
    }

    const scrollLeft = () => {
        scrollContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
    }

    const scrollRight = () => {
        scrollContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
    }

    const removeFile = (index) => {
        const newFiles = props.files.filter((_, i) => i !== index)
        props.setFiles(newFiles)
    }

    const getImageUrl = (file) => {
        return file.url || URL.createObjectURL(file)
    }

    return (
        <div className="row fadeItem mt-3">
            <label htmlFor="geralForm" className="form-label fw-bold">Fotos</label>
            <div className="col-12">
                <div className="row">
                    <label htmlFor="" className="form-label">Importe as fotos do seu imóvel:</label>
                    
                    {/* Dropzone */}
                    <StyledDropzone 
                        setFiles={array => props.setFiles([...props.files, ...array])} 
                        img 
                        baseStyle 
                        multiFiles 
                        filesLength={props.files?.length}
                    >
                        <div className="row mt-3 d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                            <div className="col-12 d-flex justify-content-center align-items-center">
                                <span>
                                    <small className="text-center small">
                                        Clique aqui ou arraste as imagens
                                    </small>
                                </span>
                            </div>
                        </div>
                    </StyledDropzone>
                    <div className="col-12">
                        <small>A primeira foto será a foto de capa do imóvel</small>
                    </div>

                    {/* Container das imagens com scroll melhorado */}
                    {props.files?.length > 0 && (
                        <div className="col-12 my-3 position-relative">
                            {/* Seta esquerda */}
                            {showLeftArrow && (
                                <button 
                                    className="scroll-arrow scroll-arrow-left"
                                    onClick={scrollLeft}
                                    type="button"
                                >
                                    <ChevronLeft/>
                                </button>
                            )}
                            
                            {/* Seta direita */}
                            {showRightArrow && (
                                <button 
                                    className="scroll-arrow scroll-arrow-right"
                                    onClick={scrollRight}
                                    type="button"
                                >
                                    <ChevronRight/>
                                </button>
                            )}

                            {/* Container de scroll */}
                            <div 
                                ref={scrollContainerRef}
                                className="images-scroll-container"
                                onScroll={checkScrollButtons}
                            >
                                <DragDropContext onDragEnd={handleOrderChange}>
                                    <Droppable droppableId="droppable" direction="horizontal">
                                        {(provided) => (
                                            <div 
                                                className="images-container"
                                                {...provided.droppableProps} 
                                                ref={provided.innerRef}
                                            >
                                                {props.files.map((file, index) => (
                                                    <Draggable 
                                                        key={`image-${index}`} 
                                                        draggableId={`image-${index}`} 
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`image-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                                            >
                                                                <div className="image-wrapper">
                                                                    {/* Imagem de fundo desfocada */}
                                                                    <div 
                                                                        className="image-background"
                                                                        style={{
                                                                            backgroundImage: `url(${getImageUrl(file)})`
                                                                        }}
                                                                    />
                                                                    
                                                                    {/* Imagem principal */}
                                                                    <img 
                                                                        src={getImageUrl(file)} 
                                                                        alt="Imagem do imóvel" 
                                                                        className="main-image"
                                                                    />
                                                                    
                                                                    {/* Botão de remover */}
                                                                    <button 
                                                                        type="button" 
                                                                        className="remove-btn"
                                                                        onClick={() => removeFile(index)}
                                                                        aria-label="Remover imagem"
                                                                    >
                                                                        <Trash2Icon/>
                                                                    </button>
                                                                    
                                                                    {/* Indicador de foto de capa */}
                                                                    {index === 0 && (
                                                                        <div className="cover-badge">
                                                                            <Star size={14} className="me-2"/>
                                                                            Capa
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Estilos CSS */}
            <style jsx>{`
                .images-scroll-container {
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding: 10px 0;
                    position: relative;
                    scrollbar-width: thin;
                    scrollbar-color: #ccc transparent;
                }

                .images-scroll-container::-webkit-scrollbar {
                    height: 6px;
                }

                .images-scroll-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }

                .images-scroll-container::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 3px;
                }

                .images-scroll-container::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }

                .images-container {
                    display: flex;
                    gap: 15px;
                    padding: 0 5px;
                    min-width: min-content;
                }

                .image-item {
                    flex-shrink: 0;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .image-item.dragging {
                    transform: rotate(3deg);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }

                .image-wrapper {
                    position: relative;
                    width: 150px;
                    height: 150px;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: grab;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .image-wrapper:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }

                .image-wrapper:active {
                    cursor: grabbing;
                }

                .image-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    filter: blur(8px);
                    transform: scale(1.1);
                    opacity: 0.3;
                }

                .main-image {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    z-index: 1;
                }

                .remove-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 2;
                    transition: all 0.2s ease;
                    color: #666;
                }

                .remove-btn:hover {
                    background: #ff4757;
                    color: white;
                    transform: scale(1.1);
                }

                .cover-badge {
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    background: linear-gradient(45deg, #ffd700, #ffed4e);
                    color: #333;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: bold;
                    z-index: 2;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                }

                .scroll-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.2s ease;
                    color: #666;
                }

                .scroll-arrow:hover {
                    background: white;
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .scroll-arrow-left {
                    left: 10px;
                }

                .scroll-arrow-right {
                    right: 10px;
                }

                .fadeItem {
                    animation: fadeIn 0.3s ease-in;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .image-wrapper {
                        width: 120px;
                        height: 120px;
                    }
                    
                    .images-container {
                        gap: 10px;
                    }
                    
                    .scroll-arrow {
                        width: 32px;
                        height: 32px;
                    }
                }
            `}</style>
        </div>
    )
}
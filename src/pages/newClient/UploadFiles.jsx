import { useState, useEffect, useRef } from "react"
import StyledDropzone from "../../components/styledDropzone/StyledDropzone"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { ChevronLeft, ChevronRight, Trash2Icon, Star } from "lucide-react"
import TitleLabel from "../../components/TitleLabel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons"
import s from "./formInputs.module.scss"

export default function UploadFiles(props) {
    const scrollContainerRef = useRef(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(false)

    useEffect(() => {
        props.setFiles(props.files)
    }, [props.files?.length])

    const checkScrollButtons = () => {
        const container = scrollContainerRef.current
        if (container) {
            setShowLeftArrow(container.scrollLeft > 0)
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth
            )
        }
    }

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
        <>
            <TitleLabel>Fotos do imóvel</TitleLabel>
            <div className={s.section}>

                {/* Dropzone */}
                <StyledDropzone
                    setFiles={array => props.setFiles([...props.files, ...array])}
                    img
                    baseStyle
                    multiFiles
                    filesLength={props.files?.length}
                >
                    <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        style={{ fontSize: '1.8rem', color: 'rgba(245,135,79,0.5)', marginBottom: '6px' }}
                    />
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.82rem',
                        color: 'rgba(255,255,255,0.35)',
                        margin: 0,
                        textAlign: 'center',
                        lineHeight: 1.5,
                    }}>
                        <strong style={{ color: '#f5874f', fontWeight: 600 }}>Clique para selecionar</strong>
                        {' '}ou arraste as imagens aqui
                    </p>
                    <p style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.68rem',
                        color: 'rgba(255,255,255,0.18)',
                        margin: '4px 0 0',
                    }}>
                        JPG · PNG · WEBP
                    </p>
                </StyledDropzone>

                {/* Caption */}
                <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.72rem',
                    color: 'rgba(255,255,255,0.22)',
                    margin: '10px 0 0',
                }}>
                    A primeira foto será a foto de capa do imóvel. Arraste para reordenar.
                </p>

                {/* Image strip */}
                {props.files?.length > 0 && (
                    <div style={{ position: 'relative', marginTop: '1.25rem' }}>

                        {/* Left arrow */}
                        {showLeftArrow && (
                            <button type="button" onClick={scrollLeft} style={arrowStyle('left')}>
                                <ChevronLeft size={16} />
                            </button>
                        )}

                        {/* Right arrow */}
                        {showRightArrow && (
                            <button type="button" onClick={scrollRight} style={arrowStyle('right')}>
                                <ChevronRight size={16} />
                            </button>
                        )}

                        <div
                            ref={scrollContainerRef}
                            onScroll={checkScrollButtons}
                            style={{
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                paddingBottom: '6px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
                            }}
                        >
                            <DragDropContext onDragEnd={handleOrderChange}>
                                <Droppable droppableId="droppable" direction="horizontal">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{ display: 'flex', gap: '12px', padding: '4px 2px', minWidth: 'min-content' }}
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
                                                            style={{
                                                                flexShrink: 0,
                                                                transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >
                                                            {/* Card */}
                                                            <div style={{
                                                                position: 'relative',
                                                                width: '140px',
                                                                height: '140px',
                                                                borderRadius: '10px',
                                                                overflow: 'hidden',
                                                                cursor: 'grab',
                                                                border: snapshot.isDragging
                                                                    ? '1.5px solid rgba(245,135,79,0.5)'
                                                                    : index === 0
                                                                        ? '1.5px solid rgba(245,135,79,0.35)'
                                                                        : '1px solid rgba(255,255,255,0.08)',
                                                                background: 'rgba(255,255,255,0.02)',
                                                                boxShadow: snapshot.isDragging
                                                                    ? '0 8px 28px rgba(245,135,79,0.18)'
                                                                    : index === 0
                                                                        ? '0 0 0 3px rgba(245,135,79,0.08)'
                                                                        : 'none',
                                                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                                            }}>
                                                                {/* Blurred background */}
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    inset: 0,
                                                                    backgroundImage: `url(${getImageUrl(file)})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center',
                                                                    filter: 'blur(8px)',
                                                                    transform: 'scale(1.1)',
                                                                    opacity: 0.25,
                                                                }} />

                                                                {/* Main image */}
                                                                <img
                                                                    src={getImageUrl(file)}
                                                                    alt="Imagem do imóvel"
                                                                    style={{
                                                                        position: 'relative',
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'contain',
                                                                        zIndex: 1,
                                                                    }}
                                                                />

                                                                {/* Remove button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeFile(index)}
                                                                    aria-label="Remover imagem"
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '7px',
                                                                        right: '7px',
                                                                        zIndex: 2,
                                                                        background: 'rgba(13,20,32,0.75)',
                                                                        border: '1px solid rgba(248,113,113,0.3)',
                                                                        borderRadius: '7px',
                                                                        color: '#f87171',
                                                                        width: '26px',
                                                                        height: '26px',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        cursor: 'pointer',
                                                                        fontSize: '0.7rem',
                                                                        backdropFilter: 'blur(4px)',
                                                                        transition: 'background 0.18s ease, border-color 0.18s ease',
                                                                    }}
                                                                    onMouseEnter={e => {
                                                                        e.currentTarget.style.background = 'rgba(248,113,113,0.2)'
                                                                        e.currentTarget.style.borderColor = 'rgba(248,113,113,0.6)'
                                                                    }}
                                                                    onMouseLeave={e => {
                                                                        e.currentTarget.style.background = 'rgba(13,20,32,0.75)'
                                                                        e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'
                                                                    }}
                                                                >
                                                                    <Trash2Icon size={11} />
                                                                </button>

                                                                {/* Cover badge */}
                                                                {index === 0 && (
                                                                    <div style={{
                                                                        position: 'absolute',
                                                                        bottom: '7px',
                                                                        left: '7px',
                                                                        zIndex: 2,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '4px',
                                                                        background: 'rgba(245,135,79,0.9)',
                                                                        color: '#0d1420',
                                                                        padding: '3px 8px',
                                                                        borderRadius: '6px',
                                                                        fontFamily: "'DM Sans', sans-serif",
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 700,
                                                                        letterSpacing: '0.03em',
                                                                    }}>
                                                                        <Star size={9} strokeWidth={2.5} />
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
        </>
    )
}

function arrowStyle(side) {
    return {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [side === 'left' ? 'left' : 'right']: '6px',
        zIndex: 10,
        background: 'rgba(13,20,32,0.8)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(4px)',
        transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
    }
}

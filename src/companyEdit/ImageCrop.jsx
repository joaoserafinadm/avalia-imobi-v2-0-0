import { faCheck, faTimes, faSearchPlus, faSearchMinus, faRotateRight, faRotateLeft, faUndo } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useRef, useEffect, useCallback } from "react"

export default function ImageCrop({
    imageSrc,
    onConfirm,
    onCancel,
    aspectRatio = 16 / 9,
    isLoading = false
}) {
    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    const [imageData, setImageData] = useState({
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        naturalWidth: 0,
        naturalHeight: 0
    });

    const [initialImageData, setInitialImageData] = useState(null);

    const [cropArea, setCropArea] = useState({
        width: 300,
        height: 300 / aspectRatio
    });

    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, imageX: 0, imageY: 0 });
    const [isZooming, setIsZooming] = useState(false);

    // Configurar tamanho do crop area baseado no container
    useEffect(() => {
        const updateCropArea = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const containerWidth = container.clientWidth - 40; // margin
                const containerHeight = container.clientHeight - 200; // espaço para controles

                let cropWidth = Math.min(containerWidth, 500);
                let cropHeight = cropWidth / aspectRatio;

                // Ajustar se altura for muito grande
                if (cropHeight > containerHeight) {
                    cropHeight = containerHeight;
                    cropWidth = cropHeight * aspectRatio;
                }

                setCropArea({ width: cropWidth, height: cropHeight });
            }
        };

        updateCropArea();
        window.addEventListener('resize', updateCropArea);
        return () => window.removeEventListener('resize', updateCropArea);
    }, [aspectRatio]);

    // Carregar imagem e configurar posição inicial
    useEffect(() => {
        if (imageSrc && imageRef.current) {
            const img = imageRef.current;

            const handleLoad = () => {
                const { naturalWidth, naturalHeight } = img;

                // Calcular escala inicial para preencher o crop area
                const scaleX = cropArea.width / naturalWidth;
                const scaleY = cropArea.height / naturalHeight;
                const initialScale = Math.max(scaleX, scaleY, 0.1);

                const initialData = {
                    scale: initialScale,
                    x: 0,
                    y: 0,
                    rotation: 0,
                    naturalWidth,
                    naturalHeight
                };

                setImageData(initialData);
                setInitialImageData(initialData); // Salvar estado inicial
            };

            if (img.complete) {
                handleLoad();
            } else {
                img.addEventListener('load', handleLoad);
                return () => img.removeEventListener('load', handleLoad);
            }
        }
    }, [imageSrc, cropArea]);

    // Função para aplicar limites de posição
    const applyPositionLimits = useCallback((x, y, scale, rotation) => {
        const scaledWidth = imageData.naturalWidth * scale;
        const scaledHeight = imageData.naturalHeight * scale;

        // Para rotações, precisamos considerar as dimensões rotacionadas
        let effectiveWidth = scaledWidth;
        let effectiveHeight = scaledHeight;

        if (rotation % 180 !== 0) {
            effectiveWidth = scaledHeight;
            effectiveHeight = scaledWidth;
        }

        // Calcular limites para manter a imagem cobrindo o crop area
        const minX = -(effectiveWidth - cropArea.width) / 2;
        const maxX = (effectiveWidth - cropArea.width) / 2;
        const minY = -(effectiveHeight - cropArea.height) / 2;
        const maxY = (effectiveHeight - cropArea.height) / 2;

        // Se a imagem for menor que o crop area, centralizar
        const limitedX = effectiveWidth <= cropArea.width ? 0 : Math.max(minX, Math.min(maxX, x));
        const limitedY = effectiveHeight <= cropArea.height ? 0 : Math.max(minY, Math.min(maxY, y));

        return { x: limitedX, y: limitedY };
    }, [imageData.naturalWidth, cropArea.width, cropArea.height]);

    // Handlers para touch/mouse events
    const getEventPos = (e) => {
        if (e.touches && e.touches[0]) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    };

    const handleStart = (e) => {
        e.preventDefault();
        const pos = getEventPos(e);
        setIsDragging(true);
        setDragStart({
            x: pos.x,
            y: pos.y,
            imageX: imageData.x,
            imageY: imageData.y
        });
    };

    const handleMove = useCallback((e) => {
        if (!isDragging) return;
        e.preventDefault();

        const pos = getEventPos(e);
        const deltaX = pos.x - dragStart.x;
        const deltaY = pos.y - dragStart.y;

        const newX = dragStart.imageX + deltaX;
        const newY = dragStart.imageY + deltaY;

        // Aplicar limites
        const limitedPos = applyPositionLimits(newX, newY, imageData.scale, imageData.rotation);

        setImageData(prev => ({
            ...prev,
            x: limitedPos.x,
            y: limitedPos.y
        }));
    }, [isDragging, dragStart, applyPositionLimits, imageData.scale, imageData.rotation]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Event listeners
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handleEnd);

            return () => {
                document.removeEventListener('mousemove', handleMove);
                document.removeEventListener('mouseup', handleEnd);
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('touchend', handleEnd);
            };
        }
    }, [isDragging, handleMove, handleEnd]);

    // Zoom handlers
    const handleZoom = (delta) => {
        const newScale = Math.max(0.1, Math.min(3, imageData.scale + delta));

        // Aplicar limites de posição após zoom
        const limitedPos = applyPositionLimits(imageData.x, imageData.y, newScale, imageData.rotation);

        setImageData(prev => ({
            ...prev,
            scale: newScale,
            x: limitedPos.x,
            y: limitedPos.y
        }));
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        handleZoom(delta);
    };

    // Touch zoom
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            setIsZooming(true);
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );
            setDragStart(prev => ({ ...prev, pinchDistance: distance, initialScale: imageData.scale }));
        } else {
            handleStart(e);
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && isZooming) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.sqrt(
                Math.pow(touch2.clientX - touch1.clientX, 2) +
                Math.pow(touch2.clientY - touch1.clientY, 2)
            );

            const scaleRatio = distance / dragStart.pinchDistance;
            const newScale = Math.max(0.1, Math.min(3, dragStart.initialScale * scaleRatio));

            // Aplicar limites de posição após zoom
            const limitedPos = applyPositionLimits(imageData.x, imageData.y, newScale, imageData.rotation);

            setImageData(prev => ({
                ...prev,
                scale: newScale,
                x: limitedPos.x,
                y: limitedPos.y
            }));
        } else if (!isZooming) {
            handleMove(e);
        }
    };

    const handleTouchEnd = (e) => {
        if (e.touches.length < 2) {
            setIsZooming(false);
        }
        if (e.touches.length === 0) {
            handleEnd();
        }
    };

    // Rotação
    const handleRotate = (degrees) => {
        const newRotation = (imageData.rotation + degrees) % 360;

        // Aplicar limites de posição após rotação
        const limitedPos = applyPositionLimits(imageData.x, imageData.y, imageData.scale, newRotation);

        setImageData(prev => ({
            ...prev,
            rotation: newRotation,
            x: limitedPos.x,
            y: limitedPos.y
        }));
    };

    // Reset para posição inicial
    const handleReset = () => {
        if (initialImageData) {
            setImageData({ ...initialImageData });
        }
    };

    // Ajustar escala via slider
    const handleScaleChange = (newScale) => {
        const limitedPos = applyPositionLimits(imageData.x, imageData.y, newScale, imageData.rotation);

        setImageData(prev => ({
            ...prev,
            scale: newScale,
            x: limitedPos.x,
            y: limitedPos.y
        }));
    };

    // Processar crop
    const processCrop = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imageRef.current;

        canvas.width = 800; // Resolução final
        canvas.height = 800 / aspectRatio;

        // Calcular transformações
        const centerX = cropArea.width / 2;
        const centerY = cropArea.height / 2;

        const scaledWidth = imageData.naturalWidth * imageData.scale;
        const scaledHeight = imageData.naturalHeight * imageData.scale;

        // Calcular posição da imagem relativa ao crop area
        const imgX = imageData.x + centerX - scaledWidth / 2;
        const imgY = imageData.y + centerY - scaledHeight / 2;

        // Mapear coordenadas do crop area para a imagem original
        const sourceX = Math.max(0, -imgX / imageData.scale);
        const sourceY = Math.max(0, -imgY / imageData.scale);
        const sourceWidth = Math.min(
            imageData.naturalWidth - sourceX,
            cropArea.width / imageData.scale
        );
        const sourceHeight = Math.min(
            imageData.naturalHeight - sourceY,
            cropArea.height / imageData.scale
        );

        // Aplicar transformações no canvas
        ctx.save();

        if (imageData.rotation !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((imageData.rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }

        ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, canvas.width, canvas.height
        );

        ctx.restore();

        return new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.9);
        });
    };

    const handleConfirm = async () => {
        const croppedBlob = await processCrop();
        onConfirm(croppedBlob);
    };

    return (
        <>
            <div className="h-100 d-flex flex-column" ref={containerRef}>
                {/* Crop Area */}
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3 position-relative">
                    <div
                        className="position-relative overflow-hidden border border-light rounded"
                        style={{
                            width: cropArea.width,
                            height: cropArea.height,
                            cursor: isDragging ? 'grabbing' : 'grab',
                            // boxShadow: '0 0 0 2000px rgba(0,0,0,0.5)'
                        }}
                        onWheel={handleWheel}
                        onMouseDown={handleStart}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt="Crop preview"
                            className="position-absolute"
                            style={{
                                width: imageData.naturalWidth * imageData.scale,
                                height: imageData.naturalHeight * imageData.scale,
                                left: imageData.x + cropArea.width / 2 - (imageData.naturalWidth * imageData.scale) / 2,
                                top: imageData.y + cropArea.height / 2 - (imageData.naturalHeight * imageData.scale) / 2,
                                transform: `rotate(${imageData.rotation}deg)`,
                                transformOrigin: 'center',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }}
                            draggable={false}
                        />

                        {/* Grid overlay */}
                        <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none">
                            <svg width="100%" height="100%" className="opacity-50">
                                <defs>
                                    <pattern id="grid" width="33.333%" height="33.333%" patternUnits="objectBoundingBox">
                                        <path d="M 33.333 0 L 33.333 33.333 M 0 33.333 L 33.333 33.333"
                                            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>
                    </div>

                    {/* Aspect ratio info */}
                    <div className="mt-2 text-center">
                        <small className="text-muted">
                            Formato: {aspectRatio.toFixed(2)}:1 ({cropArea.width}×{cropArea.height}px)
                        </small>
                    </div>
                </div>

                {/* Controls */}
                <div className="p-3 border-top" style={{ borderColor: '#444' }}>
                    <div className="row g-3">
                        {/* Zoom Controls */}
                        <div className="col-12">
                            <label className="form-label small text-muted mb-1">Zoom</label>
                            <div className="d-flex align-items-center gap-2">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handleZoom(-0.2)}
                                    disabled={imageData.scale <= 0.1}
                                >
                                    <FontAwesomeIcon icon={faSearchMinus} />
                                </button>
                                <input
                                    type="range"
                                    className="form-range flex-grow-1"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={imageData.scale}
                                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                                />
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handleZoom(0.2)}
                                    disabled={imageData.scale >= 3}
                                >
                                    <FontAwesomeIcon icon={faSearchPlus} />
                                </button>
                                <span className="small text-muted" style={{ minWidth: '45px' }}>
                                    {(imageData.scale * 100).toFixed(0)}%
                                </span>
                            </div>
                        </div>

                        {/* Rotation Controls */}
                        <div className="col-12 col-md-8">
                            <label className="form-label small text-muted mb-1">Rotação</label>
                            <div className="d-flex justify-content-center justify-content-md-start gap-2">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handleRotate(-90)}
                                >
                                    <FontAwesomeIcon icon={faRotateLeft} />
                                </button>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handleRotate(-15)}
                                >
                                    -15°
                                </button>
                                <span className="align-self-center small text-muted px-2" style={{ minWidth: '50px', textAlign: 'center' }}>
                                    {imageData.rotation}°
                                </span>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handleRotate(15)}
                                >
                                    +15°
                                </button>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => handleRotate(90)}
                                >
                                    <FontAwesomeIcon icon={faRotateRight} />
                                </button>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="col-12 col-md-4">
                            <label className="form-label small text-muted mb-1">Ações</label>
                            <div className="d-flex justify-content-center justify-content-md-start">
                                <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={handleReset}
                                >
                                    <FontAwesomeIcon icon={faUndo} className="me-1" />
                                    Resetar
                                </button>
                            </div>
                        </div>
                    </div>

                    
                </div>

                {/* Action Buttons */}
                <div className="modal-footer  " >
                    <button
                        className="btn btn-outline-secondary"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <FontAwesomeIcon icon={faTimes} className="me-1" />
                        Cancelar
                    </button>
                    <button
                        className="btn btn-orange px-4"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Processando...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCheck} className="me-1" />
                                Confirmar
                            </>
                        )}
                    </button>
                </div>

                {/* Canvas oculto */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </>

    );
}
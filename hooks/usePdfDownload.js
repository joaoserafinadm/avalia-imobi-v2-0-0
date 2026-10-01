import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { buildPdfBlob, pdfFileName, triggerDownload } from "../utils/generatePdf";

export function pdfErrorMessage(err) {
    const detail = err?.message ? ` (${err.message})` : '';
    return `Não foi possível gerar o PDF${detail}. Tente novamente em alguns instantes.`;
}

// status: 'idle' | 'generating' | 'done' | 'error'
// pdfUrl fica disponível após a geração para servir de fallback ("abrir PDF"),
// caso alguma extensão do navegador impeça o download automático.
export default function usePdfDownload() {
    const [status, setStatus] = useState('idle');
    const [pdfUrl, setPdfUrl] = useState(null);
    const urlRef = useRef(null);
    const busyRef = useRef(false);

    useEffect(() => () => {
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    }, []);

    const download = useCallback(async (elementId, companyName) => {
        if (busyRef.current) return;
        busyRef.current = true;
        setStatus('generating');
        const toastId = toast.loading('Gerando o PDF da avaliação, aguarde...');

        try {
            const blob = await buildPdfBlob(elementId);

            if (urlRef.current) URL.revokeObjectURL(urlRef.current);
            urlRef.current = URL.createObjectURL(blob);
            setPdfUrl(urlRef.current);

            triggerDownload(urlRef.current, pdfFileName(companyName));
            setStatus('done');
            toast.update(toastId, {
                render: 'PDF gerado! O download foi iniciado.',
                type: 'success', isLoading: false, autoClose: 4000, closeButton: true,
            });
        } catch (err) {
            console.error('Erro ao gerar PDF:', err);
            setStatus('error');
            toast.update(toastId, {
                render: pdfErrorMessage(err),
                type: 'error', isLoading: false, autoClose: 8000, closeButton: true,
            });
        } finally {
            busyRef.current = false;
        }
    }, []);

    return { download, status, pdfUrl, generating: status === 'generating' };
}

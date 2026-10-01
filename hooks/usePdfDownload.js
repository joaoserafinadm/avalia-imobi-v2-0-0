import { useCallback, useEffect, useRef, useState } from "react";
import { buildPdfBlob, pdfFileName, triggerDownload } from "../utils/generatePdf";

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

        try {
            const blob = await buildPdfBlob(elementId);

            if (urlRef.current) URL.revokeObjectURL(urlRef.current);
            urlRef.current = URL.createObjectURL(blob);
            setPdfUrl(urlRef.current);

            triggerDownload(urlRef.current, pdfFileName(companyName));
            setStatus('done');
        } catch (err) {
            console.error('Erro ao gerar PDF:', err);
            setStatus('error');
        } finally {
            busyRef.current = false;
        }
    }, []);

    return { download, status, pdfUrl, generating: status === 'generating' };
}

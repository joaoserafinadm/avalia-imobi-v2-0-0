/* ─────────────────────────────────────────────
   PdfDownloadNotice
   Link exibido após gerar o PDF, para abri-lo numa nova aba caso o
   download não inicie (erros são informados via toast)
   Props: status, pdfUrl (vindos de usePdfDownload), style
───────────────────────────────────────────── */
export default function PdfDownloadNotice({ status, pdfUrl, style }) {
    if (status !== 'done' || !pdfUrl) return null;

    return (
        <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.78rem',
            color: 'var(--theme-text-faint, #6c757d)',
            margin: 0,
            ...style,
        }}>
            O download não começou?{' '}
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#f5874f', fontWeight: 600 }}>
                Abrir PDF
            </a>
        </p>
    );
}

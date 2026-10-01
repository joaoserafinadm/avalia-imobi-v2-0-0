/* ─────────────────────────────────────────────
   PdfDownloadNotice
   Mensagem exibida após tentar baixar o PDF:
     – done:  link para abrir o PDF numa nova aba, caso o download não inicie
     – error: aviso de falha na geração
   Props: status, pdfUrl (vindos de usePdfDownload), style
───────────────────────────────────────────── */
export default function PdfDownloadNotice({ status, pdfUrl, style }) {
    if (status !== 'done' && status !== 'error') return null;

    const baseStyle = {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem',
        color: 'var(--theme-text-faint, #6c757d)',
        margin: 0,
        ...style,
    };

    if (status === 'error') {
        return (
            <p style={{ ...baseStyle, color: '#dc3545' }}>
                Não foi possível gerar o PDF. Tente novamente em alguns instantes.
            </p>
        );
    }

    return (
        <p style={baseStyle}>
            O download não começou?{' '}
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#f5874f', fontWeight: 600 }}>
                Abrir PDF
            </a>
        </p>
    );
}

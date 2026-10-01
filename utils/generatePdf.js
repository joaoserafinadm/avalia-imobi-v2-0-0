// Tempo máximo de espera por cada imagem antes de seguir sem ela
const IMAGE_TIMEOUT_MS = 8000;

export function pdfFileName(companyName) {
    return `Avaliação - ${companyName || 'Imóvel'}.pdf`;
}

// Resolve true se a imagem carregou e false se falhou ou estourou o timeout.
// Imagens bloqueadas (extensões do navegador, CORS, host fora do ar) nunca disparam
// onload — sem onerror/timeout a geração do PDF ficaria pendente para sempre.
function waitForImage(img) {
    if (img.complete) return Promise.resolve(img.naturalWidth > 0);

    return new Promise(resolve => {
        const done = ok => {
            clearTimeout(timer);
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
            resolve(ok);
        };
        const onLoad = () => done(true);
        const onError = () => done(false);
        const timer = setTimeout(() => done(false), IMAGE_TIMEOUT_MS);

        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
    });
}

// Gera o PDF do elemento e retorna um Blob. Imagens que não carregaram são
// ocultadas (mantendo o layout) para não travar nem quebrar o html2canvas.
export async function buildPdfBlob(elementId) {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(elementId);
    if (!element) throw new Error(`Elemento #${elementId} não encontrado`);

    const images = Array.from(element.querySelectorAll('img'));
    const loaded = await Promise.all(images.map(waitForImage));
    const failed = images
        .filter((_, i) => !loaded[i])
        .map(img => ({ img, visibility: img.style.visibility }));

    failed.forEach(({ img }) => { img.style.visibility = 'hidden'; });

    const opt = {
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, imageTimeout: IMAGE_TIMEOUT_MS },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        return await html2pdf().set(opt).from(element).outputPdf('blob');
    } finally {
        failed.forEach(({ img, visibility }) => { img.style.visibility = visibility; });
    }
}

export function triggerDownload(url, fileName) {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

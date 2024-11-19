export async function generatePDF(id, fileName) {
    if (typeof window !== 'undefined') {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById(id);

        // Aguarde o carregamento das imagens
        const images = Array.from(element.querySelectorAll('img'));
        await Promise.all(images.map(img => new Promise(resolve => {
            if (img.complete) resolve();
            else img.onload = resolve;
        })));

        const opt = {
            margin: 0,
            filename: `Avaliação - ${fileName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    }
};
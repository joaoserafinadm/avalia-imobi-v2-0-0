
import html2canvas from "html2canvas";
import saveAs from "./saveAs";

export default function downloadContent(id, fileName) {

    const chartContainer = document.getElementById(id);
  const scale = 10;

    html2canvas(chartContainer, {
        scale,
        dpi:144,
        letterRendering: 1,
        allowTaint: true,
        useCORS:true,
        onrendered: function (canvas) {saveAs(canvas.toDataURL(), fileName) }
    })
    .then(canvas => {
        saveAs(canvas.toDataURL(), fileName)
    });
}
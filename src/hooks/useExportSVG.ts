import { useCallback } from 'react';

function useExportSVG(svgPaths: SVGPathElement[], width: number = 500, height: number = 200) {
    const exportSVG = useCallback(() => {
        const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
        const svgFooter = `</svg>`;
        const svgContent = svgPaths.map((path, index) => (
            `<path d="${path.getAttribute('d') ?? ''}" class="path-${index}" />`
        )).join('');

        const svgData = `${svgHeader}${svgContent}${svgFooter}`;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported.svg';
        a.click();

        URL.revokeObjectURL(url);
    }, [svgPaths, width, height]);

    return exportSVG;
}

export default useExportSVG; 
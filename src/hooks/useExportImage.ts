// src/hooks/useExportImage.ts
import { useCallback } from 'react';

const useExportImage = (svgRef: React.RefObject<SVGSVGElement>) => {
    const exportImage = useCallback(() => {
        if (!svgRef.current) return;

        const svgElement = svgRef.current;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = svgElement.clientWidth;
            canvas.height = svgElement.clientHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(image, 0, 0);
                const pngUrl = canvas.toDataURL('image/png');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = 'exported-image.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
            URL.revokeObjectURL(url);
        };
        image.src = url;
    }, [svgRef]);

    return exportImage;
};

export default useExportImage;
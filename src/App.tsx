import { useState, useRef } from 'react'
import useFontRenderer from './hooks/useFontRenderer'
import useExportSVG from './hooks/useExportSVG'
import useExportImage from './hooks/useExportImage'
import './App.css'

function App() {
  const [text, setText] = useState('Hello, Suxiong!')
  const [fontFile, setFontFile] = useState<File | null>(null)

  const svgPaths = useFontRenderer({ fontFile, text })
  console.log('svgPaths', svgPaths)

  const exportSVG = useExportSVG(svgPaths);

  const svgRef = useRef<SVGSVGElement>(null);
  const exportImage = useExportImage(svgRef);

  const handleFontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log('file', file)

    setFontFile(file || null)
  }

  return (
    <div className="font-renderer-container">
      <div className="controls">
        <input
          type="file"
          accept=".ttf,.otf"
          onChange={handleFontUpload}
        />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={exportSVG}>导出SVG</button>
        <button onClick={exportImage}>导出图片</button>
      </div>
      <svg ref={svgRef} width="500" height="200">
        {svgPaths.map((path, index) => (
          path && (
            <path
              key={`${index}-${fontFile?.name}`}
              d={path.getAttribute('d') ?? ''}
              className={`path-${index}`}
              style={{ animation: `draw 10s ease forwards ${index * 1}s` }}
            />
          )
        ))}
      </svg>
    </div>
  )
}

export default App

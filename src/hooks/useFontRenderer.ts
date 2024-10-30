import { useState, useCallback, useEffect } from 'react'
import opentype from 'opentype.js'

interface UseFontRendererProps {
  fontFile: File | null
  text: string
}

const useFontRenderer = ({ fontFile, text }: UseFontRendererProps) => {
  const [svgPaths, setSvgPaths] = useState<SVGPathElement[]>([])
  const [font, setFont] = useState<opentype.Font>()

  useEffect(() => {
    if (!fontFile) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result
      if (!arrayBuffer) return

      try {
        const loadedFont = await opentype.parse(arrayBuffer as ArrayBuffer)
        setFont(loadedFont)
      } catch (error) {
        console.error('Font parsing error:', error)
      }
    }
    reader.readAsArrayBuffer(fontFile)
  }, [fontFile])

  const renderText = useCallback(() => {
    if (!font) return

    let x = 0
    const paths = text.split('').map(char => {
      const path = font.getPath(char, x, 150, 72) // x, y, fontSize
      const bbox = path.getBoundingBox()

      x += bbox.x2 - bbox.x1 // 根据字符宽度更新 x 位置
      return path.toDOMElement(1)
    })

    setSvgPaths(paths)
  }, [font, text])

  useEffect(() => {
    renderText()
  }, [font, text, renderText])

  return svgPaths
}

export default useFontRenderer 
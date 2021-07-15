import { Button } from 'antd'
import React, { useRef } from 'react'
import CanvasDraw from 'react-canvas-draw'

function Canvas() {
    const drawCanvas = useRef(null)

    const handleClear = () => {
        drawCanvas.current.clear()
    }

  return (
    <>
      <div>
        <Button onClick={handleClear}>Clear Canvas</Button>
      </div>
      <CanvasDraw
        brushRadius={0.5}
        brushColor='black'
        hideGrid={true}
        ref={drawCanvas}
      />
    </>
  )
}

export default Canvas

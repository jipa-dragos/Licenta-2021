import React from 'react'
import CanvasDraw from 'react-canvas-draw'

function Canvas() {


  return (
    <>
      <CanvasDraw
        brushRadius={0.5}
        brushColor='black'
        hideGrid={true}
      />
    </>
  )
}

export default Canvas

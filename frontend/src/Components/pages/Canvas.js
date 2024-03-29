import { Button, Col, InputNumber, Row } from 'antd'
import React, { useRef, useState } from 'react'
import { HuePicker } from 'react-color'
import CanvasDraw from 'react-canvas-draw'

function Canvas() {
  const drawCanvas = useRef(null)
  const [color, setColor] = useState('#ff0000')
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(534)
  const [brushRadius, setBrushRadius] = useState(1)
  const [drawingBoardON, setDrawingBoardON] = useState(false)

  const handleClear = () => {
    drawCanvas.current.clear()
  }

  const handleUndo = () => {
    drawCanvas.current.undo()
  }

  const handleWidth = (values) => {
    setWidth(values)
  }

  const handleHeight = (values) => {
    setHeight(values)
  }

  const handleBrush = (values) => {
    setBrushRadius(values)
  }

  const toggleDrawingBoard = () => {
    setDrawingBoardON(!drawingBoardON)
  }

  return (
    <>
      {!drawingBoardON && (
        <Row gutter={16}>
          <Col style={{ marginLeft: '10%' }}>
            <Button onClick={toggleDrawingBoard} type='primary'>
              Toggle Drawing Board
            </Button>
          </Col>
        </Row>
      )}
      {drawingBoardON && (
        <>
          <Row gutter={16}>
            <Col style={{ marginLeft: '10%' }}>
              <Button onClick={toggleDrawingBoard}>Toggle Drawing Board</Button>
            </Col>
            <Col>
              <Button onClick={handleUndo}>Undo</Button>
            </Col>
            <Col>
              <Button onClick={handleClear}>Clear Drawing Board</Button>
            </Col>
            <Col style={{ paddingTop: '.2%' }}>
              <label>width:</label>
            </Col>
            <Col>
              <InputNumber
                defaultValue={width}
                style={{ width: 60 }}
                min={1}
                onChange={handleWidth}
              />
            </Col>
            <Col style={{ paddingTop: '.2%' }}>
              <label>height:</label>
            </Col>
            <Col>
              <InputNumber
                defaultValue={height}
                style={{ width: 60 }}
                min={1}
                onChange={handleHeight}
              />
            </Col>
            <Col style={{ paddingTop: '.2%' }}>
              <label>Brush-Radius:</label>
            </Col>
            <Col>
              <InputNumber
                defaultValue={brushRadius}
                style={{ width: 60 }}
                min={0.1}
                onChange={handleBrush}
              />
            </Col>
            <Col style={{ paddingTop: '.2%' }}>
              <label>Brush-Color:</label>
            </Col>
            <Col style={{ paddingTop: '.5%' }}>
              <HuePicker
                color={color}
                onChangeComplete={(color) => {
                  setColor(color.hex)
                }}
              />
            </Col>
          </Row>

          <CanvasDraw
            brushRadius={brushRadius}
            brushColor={color}
            canvasWidth={width}
            canvasHeight={height}
            hideGrid={true}
            backgroundColor='grey'
            catenaryColor={color}
            ref={drawCanvas}
          />
        </>
      )}
    </>
  )
}

export default Canvas

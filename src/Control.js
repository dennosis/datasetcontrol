import React from 'react';

import { Button, Container, Row, Col, ButtonGroup} from 'reactstrap';

import { GenericPagination } from './GenericPagination'

export function Control({index, setIndex, length=1, color, setColor, furniture, setFurniture, openings, setOpenings, segmentation, setSegmentation, saveModel, saveAllModels, setSaveAllModels, saveApi, setSaveApi, saveImg, setSaveImg, isValid, setIsValid}) {
    return (
        <Container className="pt-3 controll" >
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <GenericPagination index={index} setIndex={setIndex}  length={length} />
                </Col>
            </Row>
            <Row className="justify-content-md-center mb-2">
                <Col className="m-2" md="auto">
                    <Button id="valid" size="sm" color={isValid?"dark":"outline-dark"} onClick={()=>{setIsValid(!isValid); console.log('validclick')}}>IsValid</Button>
                </Col>
                <Col className="m-2" md="auto">
                    <Button size="sm" color={saveAllModels?"dark":"outline-dark"} onClick={()=>setSaveAllModels(!saveAllModels)} >SaveAll</Button>
                </Col>
                <Col className="m-2" md="auto">
                    <ButtonGroup>
                        <Button size="sm" color={saveApi?"dark":"outline-dark"} onClick={()=>setSaveApi(!saveApi)}>api</Button>
                        <Button size="sm" color={saveImg?"dark":"outline-dark"} onClick={()=>setSaveImg(!saveImg)}>img</Button>
                    </ButtonGroup>
                </Col>
                <Col className="m-2" md="auto">
                    <Button id="save" size="sm" onClick={()=>saveModel()} color="success">Save</Button>
                </Col>
                <Col className="m-2" md="auto">
                    <ButtonGroup>
                        <Button size="sm" color={color?"dark":"outline-dark"} onClick={()=>setColor(!color)}>Color</Button>
                        <Button size="sm" color={furniture?"dark":"outline-dark"} onClick={()=>setFurniture(!furniture)}>Furniture</Button>
                        <Button size="sm" color={openings?"dark":"outline-dark"} onClick={()=>setOpenings(!openings)} >Openings</Button>
                        <Button size="sm" color={segmentation?"dark":"outline-dark"} onClick={()=>setSegmentation(!segmentation)}>Segmentation</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default Control;
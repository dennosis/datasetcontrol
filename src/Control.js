import React from 'react';

import { Button, Container, Row, Col, ButtonGroup} from 'reactstrap';

import { GenericPagination } from './GenericPagination'

export function Control({index, setIndex, length=1, color, setColor, furniture, setFurniture, openings, setOpenings, segmentation, setSegmentation, saveModel, saveAllModels, setSaveAllModels, saveApi, setSaveApi, saveImg, setSaveImg, isValid, setIsValid}) {
    return (
        <Container className="pt-3" >
            <Row className="justify-content-md-center">
                <Col className="m-2" md="auto">
                    <Button color={saveAllModels?"secondary":"outline-secondary"} onClick={()=>setSaveAllModels(!saveAllModels)} >SaveAll</Button>
                </Col>
                <Col className="m-2" md="auto">
                    <Button id="save" onClick={()=>saveModel()} color="secondary">Save</Button>
                </Col>
                <Col className="m-2" md="auto">
                    <Button id="valid" color={isValid?"success":"outline-success"} onClick={()=>{setIsValid(!isValid); console.log('validclick')}}>IsValid</Button>
                </Col>
                <Col className="m-2" md="auto">
                    <ButtonGroup>
                        <Button color={saveApi?"secondary":"outline-secondary"} onClick={()=>setSaveApi(!saveApi)}>api</Button>
                        <Button color={saveImg?"secondary":"outline-secondary"} onClick={()=>setSaveImg(!saveImg)}>img</Button>
                    </ButtonGroup>
                </Col>
                <Col className="m-2" md="auto">
                    <ButtonGroup>
                        <Button color={color?"secondary":"outline-secondary"} onClick={()=>setColor(!color)}>Color</Button>
                        <Button color={furniture?"secondary":"outline-secondary"} onClick={()=>setFurniture(!furniture)}>Furniture</Button>
                        <Button color={openings?"secondary":"outline-secondary"} onClick={()=>setOpenings(!openings)} >Openings</Button>
                        <Button color={segmentation?"secondary":"outline-secondary"} onClick={()=>setSegmentation(!segmentation)}>Segmentation</Button>
                    </ButtonGroup>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col className="m-2" md="auto">
                    <GenericPagination index={index} setIndex={setIndex}  length={length} />
                </Col>
            </Row>
        </Container>
    );
}

export default Control;
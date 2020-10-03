import React from 'react';

import { Button, Container, Row, Col, ButtonGroup} from 'reactstrap';

import { GenericPagination } from './GenericPagination'

export function Control({index, setIndex, length=1, path, id, color, setColor, furniture, setFurniture, openings, setOpenings, segmentation, setSegmentation, saveModel, saveAllModel, saveApi, setSaveApi, saveImg, setSaveImg}) {
    return (
        <Container className="pt-3" >
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Button onClick={()=>saveAllModel()} color="secondary">Save All</Button>
                </Col>
                <Col md="auto">
                    <Button onClick={()=>saveModel()} color="secondary">Save</Button>
                </Col>
                <Col md="auto">
                    <ButtonGroup>
                        <Button color={saveApi?"secondary":"outline-secondary"} onClick={()=>setSaveApi(!saveApi)}>api</Button>
                        <Button color={saveImg?"secondary":"outline-secondary"} onClick={()=>setSaveImg(!saveImg)}>img</Button>
                    </ButtonGroup>
                </Col>
                <Col md="auto">
                    <GenericPagination index={index} setIndex={setIndex}  length={length} />
                </Col>
                <Col md="auto">
                    <ButtonGroup>
                        <Button color={color?"secondary":"outline-secondary"} onClick={()=>setColor(!color)}>Color</Button>
                        <Button color={furniture?"secondary":"outline-secondary"} onClick={()=>setFurniture(!furniture)}>Furniture</Button>
                        <Button color={openings?"secondary":"outline-secondary"} onClick={()=>setOpenings(!openings)} >Openings</Button>
                        <Button color={segmentation?"secondary":"outline-secondary"} onClick={()=>setSegmentation(!segmentation)}>Segmentation</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </Container>
    );
}

export default Control;
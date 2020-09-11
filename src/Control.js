import React,{useState} from 'react';
//import htmlToImage from 'html-to-image';
import domtoimage from 'dom-to-image';

import { saveAs } from 'file-saver';

import { Button, Container, Row, Col, Pagination, PaginationItem, PaginationLink, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';


export function Control({index, setIndex, length=1, path, colorStyle, setColorStyle}) {
    const [dropdownOpen, setOpen] = useState(false);

    const toggle = () => setOpen(!dropdownOpen);
  

    const saveModelPng=()=>{
        domtoimage.toBlob(document.getElementById('model'))
        .then(function (blob) {
            saveAs(blob, 'temp.png');
        });
    }

    const selectPage=(pageIndex)=>{
        let selected = pageIndex
        selected = pageIndex >= length?length-1:selected
        selected = pageIndex < 0 ? 0 : selected
        setIndex(selected)
    }

    const createMapPages=(currentIndex, numPages)=>{
        let pages = []
        const midNumPages = Math.trunc(numPages/2)
        const fisrt = currentIndex - midNumPages > 0 ? currentIndex - midNumPages : 0
        const last = fisrt + numPages
        const init = last > length-1 ? length-1-numPages : fisrt
        for(let i=init; i <= init+numPages; i++){
            pages.push(i)
        }
        return pages
    } 

  return (
    <Container className="pt-3" >
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Button onClick={()=>saveModelPng()} color="primary">Save</Button>
                </Col>
                <Col md="auto">
                    <Pagination aria-label="Page navigation example" className='mb-auto'>
                        <PaginationItem>
                            <PaginationLink first href="#" onClick={()=>selectPage(0)} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink previous href="#" onClick={()=>selectPage(index-1)} />
                        </PaginationItem>
                        { 
                            createMapPages(index, 5).map(page =>(
                                <PaginationItem key={page} active={page===index} >
                                    <PaginationLink href="#" onClick={()=>selectPage(page)}>
                                        {page+1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))
                        }
                        <PaginationItem>
                            <PaginationLink next href="#" onClick={()=>selectPage(index+1)} />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink last href="#" onClick={()=>selectPage(length-1)} />
                        </PaginationItem>
                    </Pagination>
                </Col>

                <Col md="auto">
                    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                        <DropdownToggle caret>
                            Tipo de exibição
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={()=>setColorStyle(true)} disabled={colorStyle} >Cor</DropdownItem>
                            <DropdownItem onClick={()=>setColorStyle(false)} disabled={!colorStyle} >wireframe</DropdownItem>

                        </DropdownMenu>
                    </ButtonDropdown>
                
                </Col>

            </Row>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h2>{path}</h2>
                </Col>
            </Row>
    </Container>
  );
}

export default Control;
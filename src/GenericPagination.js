import React from 'react';

import { Pagination, PaginationItem, PaginationLink} from 'reactstrap';

export function GenericPagination({index, setIndex, length=1}) {

    const selectPage=async(pageIndex)=>{
        let selected = pageIndex
        selected = pageIndex >= length?length-1:selected
        selected = pageIndex < 0 ? 0 : selected
        await setIndex(selected)
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

    const setPagination=(e, index)=>{
        e.stopPropagation();
        selectPage(index)
    }

  return (
    <Pagination aria-label="Page navigation example" className='mb-auto'>
        <PaginationItem>
            <PaginationLink first href='' onClick={(e)=>setPagination(e, 0)} />
        </PaginationItem>
        <PaginationItem>
            <PaginationLink previous href='' onClick={(e)=>setPagination(e, index-1)} />
        </PaginationItem>
        { 
            createMapPages(index, 5).map(page =>(
                <PaginationItem key={page} active={page===index} >
                    <PaginationLink href='' onClick={(e)=>setPagination(e, page)}>
                        {page+1}
                    </PaginationLink>
                </PaginationItem>
            ))
        }
        <PaginationItem>
            <PaginationLink next href='' onClick={(e)=>setPagination(e, index+1)} />
        </PaginationItem>
        <PaginationItem>
            <PaginationLink last href='' onClick={(e)=>setPagination(e, length-1)} />
        </PaginationItem>
    </Pagination>
  );
}

export default GenericPagination;
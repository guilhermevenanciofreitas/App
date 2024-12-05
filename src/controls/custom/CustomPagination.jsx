import React from 'react'
import { Pagination } from 'rsuite'

const ControlPagination = ({total, limit, activePage, onChangePage, onChangeLimit}) => {
    return (
        <Pagination
            size={'md'} prev={true} next={true}
            layout={['-', 'limit', '|', 'pager']}
            first={true}
            last={true}
            ellipsis={false}
            boundaryLinks={false}
            total={total} 
            limit={limit}
            limitOptions={[30,50,100]} 
            maxButtons={4}
            activePage={activePage}
            onChangePage={onChangePage}
            onChangeLimit={onChangeLimit}
        />
    )
}

export const CustomPagination = ControlPagination
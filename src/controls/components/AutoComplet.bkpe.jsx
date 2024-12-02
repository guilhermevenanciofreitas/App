import React from 'react'
import { AutoComplete, InputGroup, Loader } from 'rsuite'
import SearchIcon from '@rsuite/icons/Search'
import CloseIcon from '@rsuite/icons/Close'

import _ from 'lodash'

const Result = React.createContext()

const ComponentAutoComplete = ({size, value = {}, text, onSearch, renderItem, onChange}) => {

    const [loading, setLoading] = React.useState(false)

    const [search, setSearch] = React.useState('')

    const [data, setData] = React.useState([])

    const onInuptChange = async (input = '') => {

        setLoading(true)

        setData([])

        setSearch(input?.toUpperCase())

        if (onSearch) {

            await onSearch(input)
                .then((data) => {
                    setData(_.map((data), (item) => Object.create({value: JSON.stringify(item), label: renderItem(item)})))
                })
                .finally(() => {
                    setLoading(false)
                })

        }
      
    }

    const onItemChange = (value) => {
        setSearch('')
        setLoading(false)
        onChange(JSON.parse(value))
    }

    return (
        <input type='text' />
    )

};

ComponentAutoComplete.Result = Result.Consumer

export const ControlAutoComplete = ComponentAutoComplete
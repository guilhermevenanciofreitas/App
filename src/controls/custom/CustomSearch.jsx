import React, { createRef, useState } from 'react'
import { Input, InputGroup, Loader, SelectPicker } from 'rsuite'
import { BiSearch } from 'react-icons/bi'
import _ from 'lodash'

const ControlSearch = ({placeholder, fields, loading, value, defaultPicker, onChange}) => {

  const inputRef = createRef()

  const [picker, setPicker] = useState(defaultPicker)
  const [input, setInput] = useState(value?.input || '')

  const onPickerChange = (picker) => {
    setPicker(picker)
    inputRef.current.focus()
  }  

  return (
      <InputGroup style={{width: '545px'}}>
        
          <InputGroup.Addon style={{padding: 0}}>
            <SelectPicker placeholder={placeholder} appearance='subtle' size='sm' data={fields} value={picker} searchable={false} style={{ width: 150 }} onChange={onPickerChange} />
          </InputGroup.Addon>

          <Input ref={inputRef} value={input} appearance={'default'} placeholder={`Pesquise por ${(picker ? _.filter(fields, (c) => c.value == picker)[0]?.label : _.map(_.filter(fields, (c) => c.value), (c) => c.label).join(', ')).toLowerCase()}`} autoFocus onChange={(input) => setInput(input)} />

          <InputGroup.Button onClick={() => onChange({picker, input})} disabled={loading} >
            {loading ? <Loader /> : <BiSearch />}
          </InputGroup.Button>
          
      </InputGroup>
  )
}

export const CustomSearch = ControlSearch
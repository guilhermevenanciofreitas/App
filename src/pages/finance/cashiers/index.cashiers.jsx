import React from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaTransgender } from 'react-icons/fa';

const fields = [
  { label: 'Todos', value: undefined },
  { label: 'Código', value: 'code' },
  { label: 'Descrição', value: 'description' },
  { label: 'GTIN/EAN', value: 'gtin' },
]

class Filter extends React.Component {

  state = {
    filter: {...this.props.filter}
  }

  data = [
    { label: 'Ativo', value: 'active' },
    { label: 'Inativo', value: 'inactive' },
  ]

  onApply = () => {
    this.props.onClose(this.props.onApply(this.state.filter))
  }

  render = () => (
    <CustomFilter>
      <CustomFilter.Item label={'Situação'} data={this.data} filter={this.state.filter} field={'situation'} onChange={(filter) => this.setState({filter})} />
        <hr />
      <Button appearance={'primary'} color='green' onClick={this.onApply}><MdCheckCircleOutline />&nbsp;Aplicar</Button>
    </CustomFilter>
  )

}

class FinanceCashiers extends React.Component {

  state = {
    loading: false
  }

  onApplyDate = (date) => {
    //this.setState({request: {date}})
  }

  onApplyFilter = (filter) => {
    this.setState({request: {filter}}, () => this.onSearch())
  }

  onSearch = () => {
    this.setState({loading: true}, async() => {
      try {
        //await new Service().Post('register/product/find-all', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  render = () => {

    return (
      <PageContent>
        
        <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
          
          <HStack>

            <CustomSearch loading={this.state.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
            
            {/*<CustomDateRangePicker value={this.state?.request?.date} onChange={this.onApplyDate} />*/}

            <CustomFilter.Whisper badge={_.size(this.state?.request?.filter)}>
              {(props) => <Filter filter={this.state?.request?.filter} onApply={this.onApplyFilter} {...props} />}
            </CustomFilter.Whisper>

          </HStack>

        </Stack>
        <hr></hr>
        <Nav appearance="subtle">
          <Nav.Item eventKey="home" active><center style={{width: 100}}>Todas<br></br>R$ 1.420,00</center></Nav.Item>
          <Nav.Item eventKey="news"><center style={{width: 100}}>Caixa 1<br></br>R$ 420,00</center></Nav.Item>
          <Nav.Item eventKey="solutions"><center style={{width: 100}}>Caixa 2<br></br>R$ 200,00</center></Nav.Item>
          <Nav.Item eventKey="products"><center style={{width: 100}}>Caixa 3<br></br>R$ 800,00</center></Nav.Item>
        </Nav>

        <DataTable rows={[]} loading={this.state.loading} />

        <hr></hr>

        <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />}>Incluir lançamento</Button>
        <Button appearance='ghost' color='blue' startIcon={<FaTransgender />}>Transferir</Button>

      </PageContent>
    )
  }

}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<Breadcrumb separator={'>'}><Breadcrumb.Item><h3 className="title">Finanças</h3></Breadcrumb.Item><Breadcrumb.Item active><h3 className="title">Caixa</h3></Breadcrumb.Item></Breadcrumb>}>
        <FinanceCashiers />
      </Panel>
    )
  }

}

export default Page;
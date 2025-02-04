import React from 'react';

import dayjs from 'dayjs'
import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaTransgender } from 'react-icons/fa';
import { Service } from '../../../service';
import ViewReceivement from './view.receivement';

const fields = [
  { label: 'Todos', value: undefined },
  { label: 'Nº Documento', value: 'documentNumber' },
  { label: 'Pagador', value: 'payer' },
  { label: 'Observações', value: 'observations' },
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

class FinanceReceivements extends React.Component {

  viewReceivement = React.createRef()

  componentDidMount = () => {
    this.onSearch()
  }

  onApplyDate = (date) => {
    //this.setState({request: {date}})
  }

  onApplyFilter = (filter) => {
    this.setState({request: {filter}}, () => this.onSearch())
  }

  onSearch = () => {
    this.setState({loading: true}, async () => {
      try {
        await new Service().Post('finance/receivement/receivements', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  onEditReceivement = async (receivement) => {
    this.viewReceivement.current.editReceivement(receivement.id).then((receivement) => {
      if (receivement) this.onSearch()
    })
  }

  onNewReceivement = () => {
    this.viewReceivement.current.newReceivement().then((receivement) => {
      if (receivement) this.onSearch()
    })
  }

  columns = [
    { selector: (row) => row.documentNumber, name: 'Nº Documento'},
    { selector: (row) => row.payer?.surname, name: 'Pagador' },
    { selector: (row) => row.currencyMethod?.name, name: 'Forma de pagamento' },
    { selector: (row) => dayjs(row.dueDate).format('DD/MM/YYYY'), name: 'Vencimento' },
    { selector: (row) => row.bankAccount?.bank?.name, name: 'Banco' },
    { selector: (row) => row.categorie?.name, name: 'Categoria' },
    { selector: (row) => row.amount, name: 'Valor' },
  ]

  render = () => {

    return (
      <>

        <ViewReceivement ref={this.viewReceivement} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
              
              <CustomDateRangePicker value={this.state?.request?.date} onChange={this.onApplyDate} />

              <CustomFilter.Whisper badge={_.size(this.state?.request?.filter)}>
                {(props) => <Filter filter={this.state?.request?.filter} onApply={this.onApplyFilter} {...props} />}
              </CustomFilter.Whisper>

            </HStack>

          </Stack>

          <hr></hr>

          <Nav appearance="subtle">
            <Nav.Item eventKey="all" active><center style={{width: 100}}>Todas<br></br>{this.state?.loading ? '-' : '2.356'}</center></Nav.Item>
            <Nav.Item eventKey="open"><center style={{width: 100}}>Em aberto<br></br>{this.state?.loading ? '-' : '32'}</center></Nav.Item>
            <Nav.Item eventKey="late"><center style={{width: 100}}>Atrasadas<br></br>{this.state?.loading ? '-' : '2.000'}</center></Nav.Item>
            <Nav.Item eventKey="payments"><center style={{width: 100}}>Pagas<br></br>{this.state?.loading ? '-' : '324'}</center></Nav.Item>
            <Nav.Item eventKey="cancelleds"><center style={{width: 100}}>Canceladas<br></br>{this.state?.loading ? '-' : '0'}</center></Nav.Item>
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditReceivement} />

          <hr></hr>

          <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewReceivement}>Novo recebimento</Button>

        </PageContent>
      </>
    )
  }

}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb menu='Finanças' title='Contas a receber' />}>
        <FinanceReceivements />
      </Panel>
    )
  }

}

export default Page;
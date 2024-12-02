import React from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaTransgender } from 'react-icons/fa';
import { Service } from '../../../service';
import ViewPayment from './view.payment';

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

class FinancePayments extends React.Component {

  viewPayment = React.createRef()

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
    this.setState({loading: true}, async() => {
      try {
        await new Service().Post('finance/payment/payments', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  onNewPayment = () => {
    this.viewPayment.current.newPayment()
  }

  columns = [
    { selector: (row) => row.id, name: 'Id'},
    { selector: (row) => row.partner?.surname, name: 'Nome' },
    { selector: (row) => row.categorie?.name, name: 'Categoria' },
    { selector: (row) => row.paymentMethod?.name, name: 'Forma de pagamento' },
    { selector: (row) => row.bankAccount?.bank?.name, name: 'Banco' },
    { selector: (row) => row.amount, name: 'Valor' },
  ]

  render = () => {

    return (
      <>

        <ViewPayment ref={this.viewPayment} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
              
              {/*<CustomDateRangePicker value={this.state?.request?.date} onChange={this.onApplyDate} />*/}

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

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} />

          <hr></hr>

          <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewPayment}>Novo pagamento</Button>
          {/*<Button appearance='ghost' color='blue' startIcon={<FaTransgender />}>Pagamentos</Button>*/}

        </PageContent>
      </>
    )
  }

}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<Breadcrumb separator={'>'}><Breadcrumb.Item><h3 className="title">Finanças</h3></Breadcrumb.Item><Breadcrumb.Item active><h3 className="title">Contas a pagar</h3></Breadcrumb.Item></Breadcrumb>}>
        <FinancePayments />
      </Panel>
    )
  }

}

export default Page;
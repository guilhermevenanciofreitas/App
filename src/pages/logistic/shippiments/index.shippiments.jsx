import React from 'react';

import _ from 'lodash'

import dayjs from 'dayjs'

import { Breadcrumb, Button, HStack, Nav, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaFileImport, FaTransgender, FaUpload } from 'react-icons/fa';
import { Service } from '../../../service';
import ViewShippiment from './view.shippiment';

const fields = [
  { label: 'Todos', value: undefined },
  { label: 'Pagador', value: 'code' },
  { label: 'Beneficiário', value: 'description' },
  { label: 'Observação', value: 'gtin' },
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

class LogisticShippiments extends React.Component {

  viewShippiment = React.createRef()

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
        await new Service().Post('logistic/shippiment/shippiments', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  onEditShippiment = async (shippiment) => {
    this.viewShippiment.current.editShippiment(shippiment.id).then((shippiment) => {
      if (shippiment) this.onSearch()
    })
  }

  onNewShippiment = () => {
    this.viewShippiment.current.newShippiment({}).then((shippiment) => {
      if (shippiment) this.onSearch()
    })
  }

  columns = [
    { selector: (row) => row.id, name: 'Id'},
    { selector: (row) => row.documento_transporte, name: 'Documento transporte'},
    { selector: (row) => row.sender?.surname, name: 'Remetente'},
    { selector: (row) => row.peso, name: 'Peso'},
    { selector: (row) => row.valor_frete, name: 'Valor frete'},
    //{ selector: (row) => <DataTable.RowColor color={parseFloat(row.amount) > 0 ? 'springgreen' : 'tomato'}>{dayjs(row.entryAt).format('DD/MM/YYYY HH:mm')}</DataTable.RowColor>, name: 'Data'},
    //{ selector: (row) => row.partner?.surname, name: 'Pagador / Beneficiário'},
    //{ selector: (row) => row.currencyMethod?.name, name: 'Forma de pagamento'},
    //{ selector: (row) => row.categorie?.name, name: 'Categoria'},
    //{ selector: (row) => row.amount, name: 'Valor' },
    //{ selector: (row) => <><img src={row.bankAccount?.bank?.image} style={{height: '20px'}} />&nbsp;&nbsp;{row.bankAccount.name || <>{row.bankAccount?.agency}-{row.bankAccount?.agencyDigit} / {row.bankAccount?.account}-{row.bankAccount?.accountDigit}</>}</>, name: 'Banco' },
  ]

  render = () => {

    return (
      <>

        <ViewShippiment ref={this.viewShippiment} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
      
              {/*
              <CustomFilter.Whisper badge={_.size(this.state?.request?.filter)}>
                {(props) => <Filter filter={this.state?.request?.filter} onApply={this.onApplyFilter} {...props} />}
              </CustomFilter.Whisper>
              */}

            </HStack>

          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <Nav.Item active={!this.state?.request?.bankAccount} onClick={() => this.setState({request: {...this.state.request, bankAccount: undefined}}, () => this.onSearch())}><center style={{width: 140}}>Todos<br></br>{this.state?.loading ? "-" : <>{this.state?.response?.count}</>}</center></Nav.Item>
            {_.map(this.state?.response?.bankAccounts, (bankAccount) => {
              return <Nav.Item eventKey="home" active={this.state?.request?.bankAccount?.id == bankAccount.id} onClick={() => this.setState({request: {...this.state.request, bankAccount: bankAccount}}, () => this.onSearch())}><center style={{width: 160}}>{<><img src={bankAccount?.bank?.image} style={{height: '16px'}} />&nbsp;&nbsp;{bankAccount.name || <>{bankAccount?.agency}-{bankAccount?.agencyDigit} / {bankAccount?.account}-{bankAccount?.accountDigit}</>}</>}<br></br>{this.state?.loading ? '-' : <>R$ {bankAccount.balance}</>}</center></Nav.Item>
            })}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditShippiment} />

          <hr></hr>

          <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewShippiment}>&nbsp;Novo romaneio</Button>

        </PageContent>
      </>
    )
  }
}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb menu={'Logística'} title={'Romaneios'} />}>
        <LogisticShippiments />
      </Panel>
    )
  }

}

export default Page;
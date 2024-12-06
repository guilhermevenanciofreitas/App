import React from 'react';

import _ from 'lodash'

import dayjs from 'dayjs'

import { Badge, Breadcrumb, Button, HStack, Nav, Pagination, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomPagination, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaFileImport, FaTransgender, FaUpload } from 'react-icons/fa';
import { Service } from '../../../service';
import ViewStatement from './view.cte';
import ViewUpload from './view.upload';
import ViewNfes from './view.nfes';
import ViewCte from './view.cte';

const fields = [
  { label: 'Número', value: 'nCT' },
  { label: 'Remetente', value: 'sender' },
  { label: 'Chave de acesso', value: 'chaveCt' },
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

class FinanceBankAccounts extends React.Component {

  viewCte = React.createRef()
  viewUpload = React.createRef()
  viewNfes = React.createRef()

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
        await new Service().Post('logistic/cte/ctes', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  onUpload = () => {
    this.viewUpload.current.upload().then((ctes) => {
      if (ctes) this.onSearch()
    })
  }

  onEditCte = async (cte) => {
    this.viewCte.current.editCte(cte.id).then((cte) => {
      if (cte) this.onSearch()
    })
  }

  onNewCte = () => {
    this.viewCte.current.newCte().then((cte) => {
      if (cte) this.onSearch()
    })
  }

  onViewNfe = async (cteNfes) => {
    await this.viewNfes.current.show(cteNfes)
    await this.onSearch()
  }

  columns = [
    { selector: (row) => dayjs(row.dhEmi).format('DD/MM/YYYY HH:mm'), name: 'Emissão', minWidth: '150px', maxWidth: '150px'},
    { selector: (row) => row.nCT, name: 'Número', minWidth: '120px', maxWidth: '120px'},
    { selector: (row) => row.serieCT, name: 'Série', minWidth: '60px', maxWidth: '60px'},
    { selector: (row) => row.chaveCT, name: 'Chave de acesso', minWidth: '350px', maxWidth: '350px'},
    { selector: (row) => row.shippiment?.sender?.surname, name: 'Remetente'},
    { selector: (row) => row.recipient?.surname, name: 'Destinatário'},
    { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.baseCalculo)), name: 'Valor', minWidth: '100px', maxWidth: '100px', right: true},
    { selector: (row) => row.cStat, name: 'Status', minWidth: '100px', maxWidth: '100px'},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onViewNfe(row)} content={_.size(row.cteNfes)}></Badge>, name: '#', minWidth: '80px', maxWidth: '80px'},
  ]

  render = () => {

    return (
      <>

        <ViewUpload ref={this.viewUpload} />

        <ViewNfes ref={this.viewNfes} />

        <ViewCte ref={this.viewCte} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'nCT'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
      
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

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditCte} />

          <hr></hr>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
          
            <Button appearance='primary' color='blue' startIcon={<FaUpload />} onClick={this.onUpload}>&nbsp;Upload</Button>

            <CustomPagination total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1}
              onChangePage={(offset) => this.setState({request: {...this.state.request, offset: offset - 1}}, () => this.onSearch())}
              onChangeLimit={(limit) => this.setState({request: {...this.state.request, limit}}, () => this.onSearch())}
            />

          </Stack>
          
        </PageContent>
      </>
    )
  }
}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb menu={'Logística'} title={'Conhecimentos de Transporte'} />}>
        <FinanceBankAccounts />
      </Panel>
    )
  }

}

export default Page;
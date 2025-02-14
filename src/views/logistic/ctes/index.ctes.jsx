import React from 'react'
import { Badge, Button, HStack, IconButton, List, Nav, Panel, Popover, Stack, Whisper } from 'rsuite'

import dayjs from 'dayjs'

import PageContent from '../../../components/PageContent'

import { CustomBreadcrumb, CustomPagination, CustomSearch, DataTable } from '../../../controls'
import { FaEllipsisV, FaFileDownload, FaPrint, FaUpload } from 'react-icons/fa'
import { Service } from '../../../service'

import ViewUpload from './view.upload'
import ViewNfes from './view.nfes'
import ViewCte from './view.cte'
import ViewDacte from './view.dacte'

import _ from 'lodash'

const fields = [
  { label: 'Número', value: 'nCT' },
  { label: 'Remetente', value: 'sender' },
  { label: 'Chave de acesso', value: 'chaveCt' },
]

class FinanceBankAccounts extends React.Component {

  viewCte = React.createRef()
  viewUpload = React.createRef()
  viewNfes = React.createRef()
  viewDacte = React.createRef()

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
        console.error(error.message)
      }
    })
  }

  onUpload = () => {
    this.viewUpload.current.upload().then((ctes) => {
      if (ctes) this.onSearch()
    })
  }

  onEditCTe = async (cte) => {
    this.viewCte.current.editCTe(cte.id).then((cte) => {
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
    this.onSearch()
  }

  onDacte = async (id, chaveCT) => {

    await new Service().Post('logistic/cte/dacte', {id}).then((response) => {
  
      if (response.data.pdf && typeof response.data.pdf === 'string') {
        // Decode Base64 and create a Blob
        const binaryString = atob(response.data.pdf); // Decodifica o Base64
        const binaryData = new Uint8Array(
          binaryString.split('').map((char) => char.charCodeAt(0))
        );
        const pdfBlob = new Blob([binaryData], { type: 'application/pdf' });
  
        // Create download link
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${chaveCT}.pdf`; // Nome do arquivo baixado
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  
    }).finally(() => this.setState({loading: false}))
  }

  columns = [
    //
    { selector: (row) => <Whisper
      trigger="click"
      placement={'bottomStart'}
      speaker={(props, ref) => {
        return (
          <Popover ref={ref} className={props.className} style={{width: '200px'}}>
            <List size={'md'} hover style={{cursor: 'pointer'}}>
              <List.Item onClick={() => this.onDacte(row.id, row.chaveCT)}><FaPrint /> Imprimir dacte</List.Item>
              <List.Item><FaFileDownload /> Arquivo xml</List.Item>
            </List>
          </Popover>
        )
      }}
    >
      <IconButton className='hover-blue' size='sm' circle icon={<FaEllipsisV />} appearance="default" />
    </Whisper>, minWidth: '60px', maxWidth: '60px', left: true},
    { selector: (row) => dayjs(row.dhEmi).format('DD/MM/YYYY HH:mm'), name: 'Emissão', minWidth: '140px', maxWidth: '140px'},
    { selector: (row) => row.nCT, name: 'Número', minWidth: '100px', maxWidth: '100px'},
    { selector: (row) => row.serieCT, name: 'Série', minWidth: '60px', maxWidth: '60px'},
    { selector: (row) => row.chaveCT, name: 'Chave de acesso', minWidth: '350px', maxWidth: '350px'},
    { selector: (row) => row.shippiment?.sender?.surname, name: 'Remetente'},
    { selector: (row) => row.recipient?.surname, name: 'Destinatário', minWidth: '300px', maxWidth: '300px'},
    { selector: (row) => new Intl.NumberFormat('pt-BR', {style: 'decimal', minimumFractionDigits: 2}).format(parseFloat(row.baseCalculo)), name: 'Valor', minWidth: '100px', maxWidth: '100px', right: true},
    { selector: (row) => <Badge style={{cursor: 'pointer'}} color={'blue'} onClick={() => this.onViewNfe(row)} content={_.size(row.cteNfes)}></Badge>, name: '#', center: true, minWidth: '55px', maxWidth: '55px'},
  ]

  render = () => {

    return (
      <>

        <ViewUpload ref={this.viewUpload} />

        <ViewNfes ref={this.viewNfes} />

        <ViewCte ref={this.viewCte} />

        <ViewDacte ref={this.viewDacte} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} defaultPicker={'nCT'} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
      
            </HStack>

          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <Nav.Item active={!this.state?.request?.bankAccount} onClick={() => this.setState({request: {...this.state.request, bankAccount: undefined}}, () => this.onSearch())}><center style={{width: 140}}>Todos<br></br>{this.state?.loading ? "-" : <>{this.state?.response?.count}</>}</center></Nav.Item>
            {_.map(this.state?.response?.bankAccounts, (bankAccount) => {
              return <Nav.Item eventKey="home" active={this.state?.request?.bankAccount?.id == bankAccount.id} onClick={() => this.setState({request: {...this.state.request, bankAccount: bankAccount}}, () => this.onSearch())}><center style={{width: 160}}>{<><img src={bankAccount?.bank?.image} style={{height: '16px'}} />&nbsp;&nbsp;{bankAccount.name || <>{bankAccount?.agency}-{bankAccount?.agencyDigit} / {bankAccount?.account}-{bankAccount?.accountDigit}</>}</>}<br></br>{this.state?.loading ? '-' : <>R$ {bankAccount.balance}</>}</center></Nav.Item>
            })}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditCTe} selectedRows={true} />
      
          <hr></hr>
          
          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>
          
            <Button appearance='primary' color='blue' startIcon={<FaUpload />} onClick={this.onUpload}>&nbsp;Upload</Button>

            <CustomPagination isLoading={this.state?.loading} total={this.state?.response?.count} limit={this.state?.request?.limit} activePage={this.state?.request?.offset + 1}
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
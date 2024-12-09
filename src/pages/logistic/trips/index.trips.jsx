import React from 'react';

import _ from 'lodash'

import dayjs from 'dayjs'

import { Badge, Breadcrumb, Button, Col, HStack, Nav, Pagination, Panel, Placeholder, Row, Stack, Text } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomPagination, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaFileImport, FaTransgender, FaUpload } from 'react-icons/fa';
import { Service } from '../../../service';

const fields = [
  { label: 'Número', value: 'nCT' },
  { label: 'Remetente', value: 'sender' },
  { label: 'Chave de acesso', value: 'chaveCt' },
]

const Card = props => (
  <Panel {...props} bordered header="Card title">
    <Placeholder.Paragraph />
  </Panel>
)

class LogisticTrips extends React.Component {

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

        <PageContent>
              
          <Row style={{display: 'flex'}} >
            <Card style={{width: '300px', height: 'calc(100vh - 160px)', margin: '5px'}} />
            <Card style={{width: '300px', height: 'calc(100vh - 160px)', margin: '5px'}} />
            <Card style={{width: '300px', height: 'calc(100vh - 160px)', margin: '5px'}} />
            <Card style={{width: '300px', height: 'calc(100vh - 160px)', margin: '5px'}} />
          </Row>
            
        </PageContent>
      </>
    )
  }
}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb menu={'Logística'} title={'Viagens'} />}>
        <LogisticTrips />
      </Panel>
    )
  }

}

export default Page;
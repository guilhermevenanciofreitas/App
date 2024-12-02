import React from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Pagination, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';

import Link from '../../components/NavLink'
import { Service } from '../../service';
import ViewUser from './view.user';
import ViewRole from './view.role';

const fields = [
  //{ label: 'Todos', value: undefined },
  { label: 'Nome', value: 'name' },
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

class SettingPaymentMethods extends React.Component {

  viewRole = React.createRef()

  componentDidMount() {
    this.onSearch()
  }

  onNewRole = () => {
    this.viewRole.current.newRole()
  }

  onEditRole = (role) => {
    this.viewRole.current.editRole(role.id)
  }

  onApplyFilter = (filter) => {
    this.setState({request: {filter}}, () => this.onSearch())
  }

  onSearch = () => {
    this.setState({loading: true}, async() => {
      try {
        await new Service().Post('setting/payment-method/payment-methods', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  columns = [
    { selector: (row) => row.id, name: 'Id' },
    { selector: (row) => row.name, name: 'Nome' },
  ]

  render = () => {

    return (
      <>

        <ViewRole ref={this.viewRole} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch placeholder={'Nome'} loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
              
              <CustomFilter.Whisper badge={_.size(this.state?.request?.filter)}>
                {(props) => <Filter filter={this.state?.request?.filter} onApply={this.onApplyFilter} {...props} />}
              </CustomFilter.Whisper>

            </HStack>

          </Stack>

          <hr></hr>

          <Nav appearance="subtle">
            <Nav.Item eventKey="all" active><center style={{width: 100}}>Todos<br></br>{this.state?.loading ? '-' : '339'}</center></Nav.Item>
            <Nav.Item eventKey="active"><center style={{width: 100}}>Ativos<br></br>{this.state?.loading ? '-' : '334'}</center></Nav.Item>
            <Nav.Item eventKey="inactive"><center style={{width: 100}}>Inativos<br></br>{this.state?.loading ? '-' : '5'}</center></Nav.Item>
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditRole} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>

            <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewRole}>Nova forma de pagamento</Button>

            <Pagination layout={['-', 'limit', '|', 'pager']} size={'md'} prev={true} next={true} first={true} last={true} ellipsis={false} boundaryLinks={false} total={200} limit={50} limitOptions={[30,50,100]} maxButtons={6} activePage={1}
              //onChangePage={setActivePage}
              //onChangeLimit={setLimit}
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
      <Panel header={<CustomBreadcrumb menu={'Configurações'} title={'Formas de pagamento'} />}>
        <SettingPaymentMethods />
      </Panel>
    )
  }

}

export default Page;
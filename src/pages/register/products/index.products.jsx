import React, { createRef } from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Pagination, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import ViewProduct from './view.product';

const fields = [
  { label: 'Todos', value: null },
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

class RegisterProducts extends React.Component {

  viewProduct = createRef()

  onNewProduct = () => {
    this.viewProduct.current.newProduct()
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
      <>
      
        <ViewProduct ref={this.viewProduct} />
        
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
            <Nav.Item eventKey="home" active><center style={{width: 100}}>Todos<br></br>339</center></Nav.Item>
            <Nav.Item eventKey="news"><center style={{width: 100}}>Simples<br></br>212</center></Nav.Item>
            <Nav.Item eventKey="solutions"><center style={{width: 90}}>Kits<br></br>101</center></Nav.Item>
            <Nav.Item eventKey="products"><center style={{width: 100}}>Variações<br></br>5</center></Nav.Item>
            <Nav.Item eventKey="about"><center style={{width: 100}}>Fabricados<br></br>2</center></Nav.Item>
            <Nav.Item eventKey="all"><center style={{width: 100}}>Matérias-prima<br></br>51</center></Nav.Item>
          </Nav>

          <DataTable rows={[]} loading={this.state?.loading} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>

            <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewProduct}>Novo produto</Button>

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
      <Panel header={<CustomBreadcrumb menu={'Cadastros'} title={'Produtos'} />}>
        <RegisterProducts />
      </Panel>
    )
  }

}

export default Page;
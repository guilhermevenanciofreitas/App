import React from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, HStack, Nav, Pagination, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';

import Link from '../../components/NavLink'
import { Service } from '../../service';
import ViewTask from './view.task';
import ViewTaskHistory from './view.task-history';

const fields = [
  { label: 'Todos', value: undefined },
  { label: 'Nome', value: 'name' },
  { label: 'E-mail', value: 'email' },
]

class Tasks extends React.Component {

  viewTask = React.createRef()
  viewTaskHistory = React.createRef()

  componentDidMount() {
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
        await new Service().Post('task/tasks', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
      } catch (error) {
        toast.error(error.message)
      }
    })
  }

  onEditTask = async (task) => {
    this.viewTask.current.editTask(task.id).then((task) => {
      if (task) this.onSearch()
    })
  }

  onNewTask = () => {
    this.viewTask.current.newTask().then((task) => {
      if (task) this.onSearch()
    })
  }

  onHistories = (taskId) => {
    this.viewTaskHistory.current.histories(taskId)
  }

  columns = [
    { selector: (row) => <DataTable.RowColor color={row.status == 'active' ? 'springgreen' : 'tomato'}>{row.method.name}</DataTable.RowColor>, name: 'Nome' },
    { selector: (row) => <button onClick={() => this.onHistories(row.id)}>Visualizar</button>, name: 'Histórico' },
  ]

  render = () => {

    return (
      <>

        <ViewTask ref={this.viewTask} />
        <ViewTaskHistory ref={this.viewTaskHistory} />

        <PageContent>
          
          <Stack spacing={'6px'} direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
            
            <HStack>

              <CustomSearch loading={this.state?.loading} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
              
              {/*<CustomDateRangePicker value={this.state?.request?.date} onChange={this.onApplyDate} />*/}

              {/*
              <CustomFilter.Whisper badge={_.size(this.state?.request?.filter)}>
                {(props) => <Filter filter={this.state?.request?.filter} onApply={this.onApplyFilter} {...props} />}
              </CustomFilter.Whisper>
              */}

            </HStack>

          </Stack>

          <hr></hr>
          
          <Nav appearance="subtle">
            <Nav.Item active={!this.state?.request?.status} onClick={() => this.setState({request: {...this.state.request, status: undefined}}, () => this.onSearch())}><center style={{width: 140}}>Todos<br></br>{this.state?.loading ? "-" : <>{_.sum(_.map(this.state?.response?.status, (c) => parseFloat(c.statusCount)))}</>}</center></Nav.Item>
            {_.map(this.state?.response?.status, (status) => {
              return <Nav.Item eventKey="home" active={this.state?.request?.status == status.status} onClick={() => this.setState({request: {...this.state.request, status: status.status}}, () => this.onSearch())}><center style={{width: 160}}>{<>{status.status == 'active' ? 'Ativos' : 'Inativos'}</>}<br></br>{this.state?.loading ? '-' : <>{status.statusCount}</>}</center></Nav.Item>
            })}
          </Nav>

          <DataTable columns={this.columns} rows={this.state?.response?.rows} loading={this.state?.loading} onItem={this.onEditTask} />

          <hr></hr>

          <Stack direction='row' alignItems='flexStart' justifyContent='space-between'>

            <Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />} onClick={this.onNewTask}>Nova tarefa</Button>

            {/*
            <Pagination layout={['-', 'limit', '|', 'pager']} size={'md'} prev={true} next={true} first={true} last={true} ellipsis={false} boundaryLinks={false} total={200} limit={50} limitOptions={[30,50,100]} maxButtons={6} activePage={1}
              //onChangePage={setActivePage}
              //onChangeLimit={setLimit}
            />
            */}

          </Stack>
        </PageContent>
      </>
    )
  }

}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb title={'Tarefas'} />}>
        <Tasks />
      </Panel>
    )
  }

}

export default Page;
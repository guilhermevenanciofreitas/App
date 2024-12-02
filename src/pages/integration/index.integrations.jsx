import React from 'react';

import _ from 'lodash'

import { Breadcrumb, Button, FlexboxGrid, HStack, List, Nav, Panel, Stack } from 'rsuite';

import { Divider } from 'rsuite';
import PageContent from '../../components/PageContent';

import { CustomBreadcrumb, CustomDateRangePicker, CustomFilter, CustomSearch, DataTable } from '../../controls';
import { MdAddCircleOutline, MdCheckCircleOutline } from 'react-icons/md';
import { FaTransgender } from 'react-icons/fa';

import ImageIcon from '@rsuite/icons/legacy/Image';
import FilmIcon from '@rsuite/icons/legacy/Film';
import UserCircleIcon from '@rsuite/icons/legacy/UserCircleO';
import { Service } from '../../service';

const fields = [
  { label: 'Nome', value: 'name' },
]

const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px'
}

const titleStyle = {
  paddingBottom: 5,
  whiteSpace: 'nowrap',
  fontWeight: 500
}

class Integrations extends React.Component {

  state = {
    loading: false
  }

  componentDidMount = () => {
    this.onSearch()
  }

  onSearch = () => {
    this.setState({loading: true}, async() => {
      try {
        await new Service().Post('integration/integrations', this.state.request).then((result) => this.setState({...result.data})).finally(() => this.setState({loading: false}))
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
            <CustomSearch loading={this.state.loading} placeholder={'Nome'} fields={fields} value={this.state?.request?.search} onChange={(search) => this.setState({request: {search}}, () => this.onSearch())} />
          </HStack>
        </Stack>
        
        <hr></hr>

        <Nav appearance="subtle">
          <Nav.Item eventKey="installeds" active><center style={{width: 100}}>Instaladas<br></br>{this.state?.response?.count ?? '-'}</center></Nav.Item>
        </Nav>

        <List hover>
          {this.state?.response?.rows?.map((item, index) => (
            <List.Item key={item['title']} index={index + 1}>
              <FlexboxGrid>
                {/*icon*/}
                <FlexboxGrid.Item colspan={2} style={styleCenter}>
                  <img src={item.integration?.image} style={{height: 50}} />
                </FlexboxGrid.Item>
                {/*base info*/}

                <FlexboxGrid.Item colspan={18} style={{ ...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                  <div style={titleStyle}>{item.integration?.name}</div>
                  <div style={titleStyle}>
                    <div>Configuração</div>
                  </div>
                </FlexboxGrid.Item>
                {/*uv data*/}

                <FlexboxGrid.Item colspan={4} style={{ ...styleCenter }} >
                  Instalado
                </FlexboxGrid.Item>

              </FlexboxGrid>
            </List.Item>
          ))}
        </List>

        <hr></hr>

        {/*<Button appearance='primary' color='blue' startIcon={<MdAddCircleOutline />}>Instalar integração</Button>*/}

      </PageContent>
    )
  }

}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb title={'Integrações'} />}>
        <Integrations />
      </Panel>
    )
  }

}

export default Page;
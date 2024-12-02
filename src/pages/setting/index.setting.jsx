import React from 'react'
import { List, Nav, Panel } from 'rsuite'
import PageContent from '../../components/PageContent'
import _ from 'lodash'

import Link from '../../components/NavLink'
import { CustomBreadcrumb } from '../../controls'

class Setting extends React.Component {

  state = {
    nav: 'general'
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
      <PageContent>
        
        <Nav appearance="subtle">
            <Nav.Item eventKey="general" active={this.state.nav == 'general'} onClick={() => this.setState({nav: 'general'})}><div style={{width: 100}}><h5>Geral</h5></div></Nav.Item>
            {/*
            <Nav.Item eventKey="register" active={this.state.nav == 'register'} onClick={() => this.setState({nav: 'register'})}><div style={{width: 120}}><h5>Cadastros</h5></div></Nav.Item>
            <Nav.Item eventKey="supplies" active={this.state.nav == 'supplies'} onClick={() => this.setState({nav: 'supplies'})}><div style={{width: 130}}><h5>Suprimentos</h5></div></Nav.Item>
            <Nav.Item eventKey="services" active={this.state.nav == 'services'} onClick={() => this.setState({nav: 'services'})}><div style={{width: 110}}><h5>Serviços</h5></div></Nav.Item>
            <Nav.Item eventKey="sales" active={this.state.nav == 'sales'} onClick={() => this.setState({nav: 'sales'})}><div style={{width: 105}}><h5>Vendas</h5></div></Nav.Item>
            <Nav.Item eventKey="finances" active={this.state.nav == 'finances'} onClick={() => this.setState({nav: 'finances'})}><div style={{width: 110}}><h5>Finanças</h5></div></Nav.Item>
            <Nav.Item eventKey="fiscal" active={this.state.nav == 'fiscal'} onClick={() => this.setState({nav: 'fiscal'})}><div style={{width: 90}}><h5>Fiscal</h5></div></Nav.Item>
            <Nav.Item eventKey="integrations" active={this.state.nav == 'integrations'} onClick={() => this.setState({nav: 'integrations'})}><div style={{width: 120}}><h5>Integraçoes</h5></div></Nav.Item>
            */}
        </Nav>

        {/* Geral */}
        {this.state.nav == 'general' &&
        <>
          <Panel header={<h5>Empresa</h5>}>
            <List size="lg" style={{cursor: 'pointer'}}>
              <List.Item>Informações</List.Item>
              <List.Item>Usuários</List.Item>
              <List.Item>Cargos</List.Item>
            </List>
          </Panel>
        </>
        }

        {/* Cadastros */}
        {this.state.nav == 'register' &&
        <Panel header={<h5>Produto</h5>}>
          <List size="lg" style={{cursor: 'pointer'}}>
            <List.Item>Variações</List.Item>
            <List.Item>Atributos</List.Item>
            <List.Item>Marcas</List.Item>
            <List.Item>Medidas</List.Item>
          </List>
        </Panel>
        }

        {/* Suprimentos */}
        {this.state.nav == 'supplies' &&
          <>
            <Panel header={<h5>Estoque</h5>}>
              <List size="lg" style={{cursor: 'pointer'}}>
                <List.Item>Depositos</List.Item>
              </List>
            </Panel>
          </>
        }

        {/* Vendas */}
        {this.state.nav == 'sales' &&
          <>
            <Panel header={<h5>Expedição</h5>}>
              <List size="lg" style={{cursor: 'pointer'}}>
                <List.Item>Formas de envio</List.Item>
              </List>
            </Panel>
          </>
        }

        {/* Finanças */}
        {this.state.nav == 'finances' &&
          <>
            <Panel header={<h5>Cadastros</h5>}>
              <List size="lg" style={{cursor: 'pointer'}}>
                <List.Item>Caixa</List.Item>
                <List.Item>Bancos</List.Item>
                <List.Item>Categorias</List.Item>
                <List.Item>Formas de recebimentos</List.Item>
                <List.Item>Formas de pagamentos</List.Item>
              </List>
            </Panel>
          </>
        }

        {/* Fiscal */}
        {this.state.nav == 'fiscal' &&
          <>
            <Panel header={<h5>Assinatura eletrônica</h5>}>
              <List size="lg" style={{cursor: 'pointer'}}>
                <List.Item>Certificado Digital</List.Item>
              </List>
            </Panel>
            <Panel header={<h5>Entrada</h5>}>
              <List size="lg" style={{cursor: 'pointer'}}>
                <List.Item>Natureza de operação</List.Item>
              </List>
            </Panel>
            <Panel header={<h5>Saída</h5>}>
              <List size="lg" style={{cursor: 'pointer'}}>
                <List.Item>Natureza de operação</List.Item>
              </List>
            </Panel>
          </>
        }

        {/* Integrações */}
        {this.state.nav == 'integrations' &&
          <>
            <Panel header={<h5>e-Commerce</h5>}>
              <List size="lg" style={{cursor: 'pointer'}}>
                <List.Item>Mercado Livre</List.Item>
                <List.Item>Shopee</List.Item>
                <List.Item>iFood</List.Item>
              </List>
            </Panel>
          </>
        }

      </PageContent>
    )
  }

}

class Page extends React.Component {

  render = () => {
    return (
      <Panel header={<CustomBreadcrumb title={'Configuração'} />}>
        <Setting />
      </Panel>
    )
  }

}

export default Page;
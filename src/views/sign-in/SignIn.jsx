import React from 'react'
import { Form, Button, Panel, Stack, Divider, Steps, SelectPicker, Loader, Heading, toaster, Message } from 'rsuite'
import { FaSignInAlt, FaCheck } from 'react-icons/fa'
import { Service } from '../../service'
import { Col, Row } from 'react-grid-system'
import _ from 'lodash'
import { Exception } from '../../utils/exception'

class SignUp extends React.Component {

  state = {
    companies: [],
    email: 'guilherme.venancio@tcltransporte.com.br',
    password: '@Rped94ft',
    companyId: ''
  }
  
  signIn = async () => {
    try {

      this.setState({loading: true})
      const signIn = await new Service().Post('login/sign-in', {email: this.state.email, password: this.state.password})
      this.authorize(signIn)

    } catch(error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  companyCorporationApply = async() => {
    try {

      this.setState({loading: true})

      if (_.isEmpty(this.state?.companyId)) {
        await toaster.push(<Message showIcon type='warning'>Informe a empresa!</Message>, {placement: 'topCenter', duration: 5000 })
        return
      }
  
      await new Service().Post('login/sign-in', {email: this.state.email, password: this.state.password, companyCorporationId: this.state.companyCorporationId})
      this.authorize(signIn)

    } catch(error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  companyApply = async() => {
    try {

      this.setState({loading: true})

      if (_.isEmpty(this.state?.companyId)) {
        await toaster.push(<Message showIcon type='warning'>Informe a filial!</Message>, {placement: 'topCenter', duration: 5000 })
        return
      }
  
      await new Service().Post('login/sign-in', {email: this.state.email, password: this.state.password, companyId: this.state.companyId})
      this.authorize(signIn)

    } catch(error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  authorize = async (signIn) => {

    //authorized
    if (signIn?.status == 200) {
      localStorage.setItem("Authorization", JSON.stringify(signIn.data))
      await toaster.push(<Message showIcon type='success'>{signIn.data.message}</Message>, {placement: 'topCenter', duration: 5000 })
      window.location.replace('/dashboard')
    }

    //incorrect email/password
    if (signIn?.status == 201) {
      await toaster.push(<Message showIcon type='warning'>{signIn.data.message} 🤨</Message>, {placement: 'topCenter', duration: 5000 })
    }

    //companyCorporation
    if (signIn?.status == 202) {
      this.setState({...this.state, companies: _.map(signIn.data, (item) => { return {label: item.name, value: item.id} })});
    }

    //company
    if (signIn?.status == 203) {
      this.setState({...this.state, companies: _.map(signIn.data, (item) => { return {label: item.name, value: item.id} })});
    }

  }

  render = () => {

    return (
      <Stack justifyContent="center" alignItems="center" direction="column" style={{height: '100vh'}}>

        {_.size(this.state?.companies) == 0 &&
          <Panel bordered style={{ background: '#fff', width: 400 }} header={<div><Heading level={3}>Acesse sua conta!</Heading></div>}>

            <Form onSubmit={this.signIn}>

              <Row gutterWidth={0}>
                <Col md={12}>
                  <div className='form-control'>
                    <label class="textfield-filled">
                        <input type='text' value={this.state?.email} onChange={(event) => this.setState({email: event.target.value})} autoFocus />
                        <span>E-mail</span>
                    </label>
                  </div>
                </Col>
                <Col md={12}>
                  <div className='form-control'>
                    <label class="textfield-filled">
                        <input type='password' value={this.state?.password} onChange={(event) => this.setState({password: event.target.value})} />
                        <span>Senha</span>
                    </label>
                  </div>
                  <a style={{ float: 'right' }}>Esqueceu sua senha?</a>
                </Col>
              </Row>

              <Form.Group>
                <Stack spacing={6} divider={<Divider vertical />}>
                  <Button appearance="primary" type='submit' disabled={this.state?.loading}>{this.state?.loading ? <><Loader />&nbsp;&nbsp; Entrando...</> : <><FaSignInAlt />&nbsp;&nbsp; Entrar</>}</Button>
                </Stack>
              </Form.Group>

            </Form>
          </Panel>
        }

        {_.size(this.state?.companies) >= 1 &&
          <Panel bordered style={{ background: '#fff', width: 400 }}>
            <Form onSubmit={this.companyApply}>
              <Steps current={1}>
                <Steps.Item title="Entrar" />
                <Steps.Item title="Empresa" />
                <Steps.Item title="Confirmar" />
              </Steps>

              <hr></hr>
            
              <Form.Group>
                <Form.ControlLabel>
                  <span>Empresa</span>
                </Form.ControlLabel>
                <SelectPicker data={this.state?.companies} value={this.state?.companyId} onChange={(companyId) => this.setState({companyId})} searchable={false} style={{ width: '100%' }} placeholder="[Selecione]"/>
              </Form.Group>

              <Form.Group>
                <Stack spacing={6} justifyContent='flex-end' divider={<Divider vertical />}>
                  <Button appearance="primary" type='submit' disabled={this.state?.loading}>{this.state?.loading ? <><Loader />&nbsp;&nbsp; Confirmando...</> : <><FaCheck />&nbsp;&nbsp; Confirmar</>}</Button>
                </Stack>
              </Form.Group>
            </Form>
          </Panel>
        }

      </Stack>
    )
  }

}

export default SignUp;

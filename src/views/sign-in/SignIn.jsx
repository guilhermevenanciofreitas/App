import React from 'react'
import { Form, Button, Panel, Stack, Divider, Steps, SelectPicker, Loader, Heading, toaster, Message } from 'rsuite'
import { FaSignInAlt, FaCheck } from 'react-icons/fa'
import { Service } from '../../service'
import { Col, Row } from 'react-grid-system'
import _ from 'lodash'
import { Exception } from '../../utils/exception'

class SignUp extends React.Component {

  state = {
    companyBusiness: [],
    company: [],
    email: 'guilherme.venancio@tcltransporte.com.br',
    password: '@Rped94ft',
    companyBusinessId: '',
    companyId: '',
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

  companyBusinessChange = async(companyBusinessId) => {
    try {

      this.setState({companyBusinessId, loading: true})
      const signIn = await new Service().Post('login/sign-in', {email: this.state.email, password: this.state.password, companyBusinessId})
      this.authorize(signIn)

    } catch(error) {
      Exception.error(error)
    } finally {
      this.setState({loading: false})
    }
  }

  companyChange = async(companyId) => {
    try {

      this.setState({companyId, loading: true})
      const signIn = await new Service().Post('login/sign-in', {email: this.state.email, password: this.state.password, companyBusinessId: this.state.companyBusinessId, companyId})
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
      const companyBusiness = _.map(signIn.data, (item) => { return {label: item.description, value: item.id} })
      this.setState({...this.state, companyBusiness});
    }

    //company
    if (signIn?.status == 203) {
      const company = _.map(signIn.data, (item) => { return {label: item.surname, value: item.id} })
      this.setState({...this.state, company});
    }

  }

  render = () => {

    return (
      <Stack justifyContent="center" alignItems="center" direction="column" style={{height: '100vh'}}>

        {_.size(this.state?.companyBusiness) == 0 &&
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

        {_.size(this.state?.companyBusiness) >= 1 &&
          <Panel bordered style={{ background: '#fff', width: 400 }}>
            <Form>
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
                <SelectPicker data={this.state?.companyBusiness} value={this.state?.companyBusinessId} onChange={this.companyBusinessChange} searchable={false} style={{ width: '100%' }} placeholder="[Selecione]"/>
              </Form.Group>

              {_.size(this.state?.company) >= 1 &&
                <Form.Group>
                  <Form.ControlLabel>
                    <span>Filial</span>
                  </Form.ControlLabel>
                  <SelectPicker data={this.state?.company} value={this.state?.companyId} onChange={this.companyChange} searchable={false} style={{ width: '100%' }} placeholder="[Selecione]"/>
                </Form.Group>
              }

            </Form>
          </Panel>
        }

      </Stack>
    )
  }

}

export default SignUp;

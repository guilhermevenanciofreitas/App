import React from 'react'
import { Form, Button, Panel, Stack, Divider, Steps, SelectPicker, Loader, Heading, toaster, Message } from 'rsuite'
import Brand from '../../../components/Brand'
import { FaSignInAlt, FaCheck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { Service } from '../../../service'
import { Col, Row } from 'react-grid-system'

class SignUp extends React.Component {

  state = {
    companies: [],
    email: 'guilherme9180@gmail.com',
    password: '123',
    companyId: ''
  }
  
  signIn = async() => {
    this.setState({loading: true, companies: []}, async () => {
      try {
        await new Service().Post("login/sign-in", {email: this.state.email, password: this.state.password}).then((signIn) => this.authorized(signIn)).finally(() => this.setState({loading: false}));
      } catch(error) {
        toast.error(error.message, {position: 'top-center'});
      }
    });
  }

  companyApply = async() => {

    if (_.isEmpty(this.state.companyId)) {
      await toaster.push(<Message showIcon type='warning'>Informe a empresa!</Message>, {placement: 'topCenter', duration: 5000 })
      return
    }

    this.setState({loading: true}, async () => {
      try {
        await new Service().Post("login/sign-in", {email: this.state.email, password: this.state.password, companyId: this.state.companyId}).then((signIn) => this.authorized(signIn)).finally(() => this.setState({loading: false}));
      } catch(error) {
        toast.error(error.message, {position: 'top-center'});
      }
    });
  }

  authorized = async(signIn) => {

    //authorized
    if (signIn?.status == 200) {

      //var url = new URL(window.location.href.replace('/#/', '/'));
      //var to = url.searchParams.get('returnUrl');
  
      localStorage.setItem("Authorization", JSON.stringify(signIn.data));

      toast.success(signIn.data.message, {position: 'top-center'});

      window.location.replace('/dashboard');

    }

    //incorrect email/password
    if (signIn?.status == 201) await toaster.push(<Message showIcon type='warning'>{signIn.data.message} 🤨</Message>, {placement: 'topCenter', duration: 5000 }) //toast(signIn.data.message, {position: 'top-center', icon: '🤨',});

    //inform account
    if (signIn?.status == 202) {
      this.setState({...this.state, companies: _.map(signIn.data, (item) => { return {label: item.name, value: item.id} })});
    }

  }

  render = () => {

    return (
      <Stack justifyContent="center" alignItems="center" direction="column" style={{height: '100vh'}}>

        <Brand style={{ marginBottom: 10 }} />
        
        {_.size(this.state.companies) == 0 &&
          <Panel bordered style={{ background: '#fff', width: 400 }} header={<div><Heading level={3}>Acesse sua conta!</Heading></div>}>

            <Form onSubmit={this.signIn}>

              <Row gutterWidth={0}>
                <Col md={12}>
                  <div className='form-control'>
                    <label class="textfield-filled">
                        <input type='text' value={this.state.email} onChange={(event) => this.setState({email: event.target.value})} />
                        <span>E-mail</span>
                    </label>
                  </div>
                </Col>
                <Col md={12}>
                  <div className='form-control'>
                    <label class="textfield-filled">
                        <input type='password' value={this.state.password} onChange={(event) => this.setState({password: event.target.value})} />
                        <span>Senha</span>
                    </label>
                  </div>
                  <a style={{ float: 'right' }}>Esqueceu sua senha?</a>
                </Col>
                
              </Row>

              <Form.Group>
                <Stack spacing={6} divider={<Divider vertical />}>
                  <Button appearance="primary" type='submit' disabled={this.state.loading}>{this.state.loading ? <><Loader />&nbsp;&nbsp; Entrando...</> : <><FaSignInAlt />&nbsp;&nbsp; Entrar</>}</Button>
                </Stack>
              </Form.Group>

            </Form>
          </Panel>
        }

        {_.size(this.state.companies) >= 1 &&
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
                <SelectPicker data={this.state.companies} value={this.state.companyId} onChange={(companyId) => this.setState({companyId})} searchable={false} style={{ width: '100%' }} placeholder="[Selecione]"/>
              </Form.Group>

              <Form.Group>
                <Stack spacing={6} justifyContent='flex-end' divider={<Divider vertical />}>
                  <Button appearance="primary" type='submit' disabled={this.state.loading}>{this.state.loading ? <><Loader />&nbsp;&nbsp; Confirmando...</> : <><FaCheck />&nbsp;&nbsp; Confirmar</>}</Button>
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

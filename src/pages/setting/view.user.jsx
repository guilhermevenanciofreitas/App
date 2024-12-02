import React from "react"
import { Container, Row, Col } from 'react-grid-system'
import { Button, CheckPicker, Form, Input, Loader, Message, Modal, toaster } from 'rsuite'
import { PhotoPicker, ViewModal } from "../../controls"
import { Loading } from '../../App'
import { MdCheckCircleOutline } from "react-icons/md"
import { Service } from "../../service"
import _ from "lodash"

class ViewUser extends React.Component {

    viewModal = React.createRef();

    newUser = async (user) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...user})
        return this.viewModal.current.show()
    }

    editUser = async (id) => {
        Loading.Show()
        await new Service().Post('setting/user/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide())
        return this.viewModal.current.show()
    }

    submit = async () => {
        this.setState({submting: true}, async () => {

            const user = _.pick(this.state, [
                'id',
                'name',
                'email',
                'status'
            ])

            await new Service().Post('setting/user/submit', user).then(async (result) => {
                await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
                this.viewModal.current?.close(result.data)
            }).finally(() => this.setState({submting: false}))

        })
    }

    close(value) {
        this.viewModal.current?.close(value)
    }

    render = () => {
        
        const data = this.state?.companies.map(
            (item) => ({ label: item.surname, value: item.id })
        )

        return (
            <ViewModal ref={this.viewModal} size={700}>
                <Form autoComplete='off' onSubmit={this.submit}>
                    <Modal.Header><Modal.Title>{this.props.title ? this.props.title : 'Usuário'}</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={4}>
                                <PhotoPicker padding={0} />
                            </Col>
                            <Col md={8}>
                                <Col md={12}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='text' value={this.state?.name} onChange={(event) => this.setState({name: event.target.value})} />
                                            <span>Nome</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='text' value={this.state?.email} onChange={(event) => this.setState({email: event.target.value})} />
                                            <span>E-mail</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className='form-control'>
                                        <label>Empresas</label>
                                        <CheckPicker value={this.state?.companyUsers} data={data} searchable={false} onChange={(companyUsers) => this.setState({companyUsers})} style={{width: '100%'}} />
                                    </div>
                                </Col>
                                <br></br>
                                {!this.props.title && 
                                    <Col md={4}>
                                        <div className='form-control'>
                                            <label>
                                                <input type='checkbox' checked={this.state?.status == 'active' ? true : false} onChange={(event) => this.setState({status: event.target.checked ? 'active' : 'inactivated'})} />
                                                <span>&nbsp;Ativo</span>
                                            </label>
                                        </div>
                                    </Col>
                                }
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='submit' appearance="primary" color='green' disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Confirmando...</> : <><MdCheckCircleOutline /> &nbsp; Confirmar</>}</Button>
                    </Modal.Footer>
                </Form>
            </ViewModal>
        )
    }

}

export default ViewUser;
import React from "react"
import { Container, Row, Col } from 'react-grid-system'
import { Button, CheckPicker, Form, Input, Loader, Message, Modal, toaster } from 'rsuite'
import { AutoComplete, PhotoPicker, ViewModal } from "../../controls"
import { Loading } from '../../App'
import { MdCheckCircleOutline } from "react-icons/md"
import { Service } from "../../service"
import _ from "lodash"
import { Search } from "../../search"

import { ReQuartzCron, ReUnixCron } from '@sbzen/re-cron';
//import 'react-cron-generator/dist/cron-builder.css'

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

class ViewTask extends React.Component {

    viewModal = React.createRef();

    newTask = async (task) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...task})
        return this.viewModal.current.show()
    }

    editTask = async (id) => {
        Loading.Show()
        await new Service().Post('task/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide())
        return this.viewModal.current.show()
    }

    submit = async () => {
        this.setState({submting: true}, async () => {

            const user = _.pick(this.state, [
                'id',
                'method.id',
                'schedule',
                'status'
            ])

            await new Service().Post('task/submit', user).then(async (result) => {
                await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
                this.viewModal.current?.close(result.data)
            }).finally(() => this.setState({submting: false}))

        })
    }

    close(value) {
        this.viewModal.current?.close(value)
    }

    render = () => {
        
        return (
            <ViewModal ref={this.viewModal} size={660}>
                <Form autoComplete='off' onSubmit={this.submit}>
                    <Modal.Header><Modal.Title>Tarefa</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={12}>
                                <div className='form-control'>
                                    <AutoComplete label='Nome' value={this.state?.method} text={(item) => item.name} onChange={(method) => this.setState({method})} onSearch={async (search) => await Search.taskMethod(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={12}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.schedule} onChange={(event) => this.setState({schedule: event.target.value})} />
                                        <span>Configuração</span>
                                    </label>
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

export default ViewTask;
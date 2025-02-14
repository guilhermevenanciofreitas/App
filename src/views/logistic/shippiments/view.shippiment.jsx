import React from "react";
import { Button, CheckTree, DatePicker, Form, Input, InputGroup, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, PhotoPicker, ViewModal } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import _ from "lodash";
import { Search } from "../../../search";

class ViewShippiment extends React.Component {

    viewModal = React.createRef()

    newShippiment = async (shippiment) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...shippiment})
        return this.viewModal.current.show()
    }

    editShippiment = async (id) => {
        Loading.Show();
        await new Service().Post('logistic/shippiment/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide());
        return this.viewModal.current.show()
    }

    submit = async () => {
        this.setState({submting: true}, async () => {

            const receivement = _.pick(this.state, [
                'id',
                'documento_transporte',
                'sender.id',
                'proPred',
            ])

            await new Service().Post('logistic/shippiment/submit', receivement).then(async (result) => {
                await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
                this.viewModal.current?.close(result.data)
            }).finally(() => this.setState({submting: false}));
        })
    }

    close(role) {
        this.viewModal.current?.close(role)
    }

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.submit}>
                <ViewModal ref={this.viewModal} size={1000}>
                    <Modal.Header><Modal.Title><Container>Romaneio</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={3}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.documento_transporte} onChange={(event) => this.setState({documento_transporte: event.target.value})} />
                                        <span>Documento transporte</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={5}>
                                <div className='form-control'>
                                    <AutoComplete label='Remetente' value={this.state?.sender} text={(item) => `${item.cpfCnpj} - ${item.name}`} onChange={(sender) => this.setState({sender})} onSearch={async (search) => await Search.sender(search)}>
                                        <AutoComplete.Result>
                                            {(item) => <span>{item.cpfCnpj} - {item.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.proPred} onChange={(event) => this.setState({proPred: event.target.value})} />
                                        <span>Produto predominante</span>
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Salvando...</> : <><MdCheckCircleOutline /> &nbsp; Salvar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        )

    }

}

export default ViewShippiment;
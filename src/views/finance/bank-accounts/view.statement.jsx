import React from "react";
import { Button, CheckTree, DatePicker, Form, Input, InputGroup, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, PhotoPicker, ViewModal } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import _ from "lodash";
import { Search } from "../../../search";

class ViewStatement extends React.Component {

    viewModal = React.createRef()

    newStatement = async (bankAccount) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...bankAccount})
        return this.viewModal.current.show()
    }

    editStatement = async (id) => {
        Loading.Show();
        await new Service().Post('finance/bank-account/statement/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide());
        return this.viewModal.current.show()
    }

    submit = async () => {
        this.setState({submting: true}, async () => {

            const receivement = _.pick(this.state, [
                'id',
                'documentNumber',
                'currencyMethod.id',
                'issueDate',
                'dueDate',

                'company.id',
                'payer.id',
                'bankAccount.id',

                'categorie.id',
                'amount',
            ])

            await new Service().Post('finance/receivement/submit', receivement).then(async (result) => {
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
                <ViewModal ref={this.viewModal} size={820}>
                    <Modal.Header><Modal.Title><Container>Lançamento</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                            <Col md={5}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <select value={this.state?.type} onChange={(event) => this.setState({type: event.target.value})}>
                                            <option>[Selecione]</option>
                                            <option>Entrada</option>
                                            <option>Saída</option>
                                        </select>
                                        <span>Tipo</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={7}>
                                <div className='form-control'>
                                    <AutoComplete label='Categoria' value={this.state?.categorie} text={(item) => item.name} onChange={(categorie) => this.setState({categorie})} onSearch={async (search) => await Search.contabilityCategorie(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            
                            <Col md={3}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='datetime-local' value={this.state?.entryAt} onChange={(event) => this.setState({entryAt: event.target.value})} />
                                        <span>Data</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Forma de pagamento' value={this.state?.currencyMethod} text={(item) => item.name} onChange={(currencyMethod) => this.setState({currencyMethod})} onSearch={async (search) => await Search.receivementMethod(search)} renderItem={(item) => item.name}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item?.name}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={Math.abs(this.state?.amount)} onChange={(event) => this.setState({amount: Math.abs(event.target.value)})} />
                                        <span>Valor</span>
                                    </label>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Banco' value={this.state?.bankAccount} text={(item) => item.name || `${item.bank?.name} - ${item.agency}-${item.agencyDigit} / ${item.account}-${item.accountDigit}`} onChange={(bankAccount) => this.setState({bankAccount})} onSearch={async (search) => await Search.bankAccount(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span><img src={item.bank?.image} style={{height: '20px'}} />&nbsp;&nbsp;{item.name || <>{item.bank?.name} - {item.agency}-{item.agencyDigit} / {item.account}-{item.accountDigit}</>}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className='form-control'>
                                    <AutoComplete label='Pagador' value={this.state?.partner} text={(item) => item.surname} onChange={(partner) => this.setState({partner})} onSearch={async (search) => await Search.partner(search)}>
                                        <AutoComplete.Result>
                                                {(item) => <span>{item.surname}</span>}
                                        </AutoComplete.Result>
                                    </AutoComplete>
                                </div>
                            </Col>
                            <Col md={12}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <textarea rows={2} type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                            <span>Observações</span>
                                        </label>
                                    </div>
                            </Col>
                        </Row>
                        
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Confirmando...</> : <><MdCheckCircleOutline /> &nbsp; Confirmar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        )

    }

}

export default ViewStatement;
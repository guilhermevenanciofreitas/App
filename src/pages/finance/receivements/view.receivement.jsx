import React from "react";
import { Button, CheckTree, DatePicker, Form, Input, InputGroup, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, PhotoPicker, ViewModal } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import _ from "lodash";
import { Search } from "../../../search";

class ViewReceivement extends React.Component {

    viewModal = React.createRef()

    newReceivement = async (receivement) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...receivement})
        return this.viewModal.current.show()
    }

    editReceivement = async (id) => {
        Loading.Show();
        await new Service().Post('finance/receivement/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide());
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
                <ViewModal ref={this.viewModal} size={1150}>
                    <Modal.Header><Modal.Title><Container>Conta a receber</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <fieldset>
                            <legend>Informações gerais</legend>

                            <Row gutterWidth={0}>
                                <Col md={2}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='text' value={this.state?.documentNumber} onChange={(event) => this.setState({documentNumber: event.target.value})} />
                                            <span>Nº Documento</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className='form-control'>
                                        <AutoComplete label='Forma de pagamento' value={this.state?.currencyMethod} text={(item) => item.name} onChange={(currencyMethod) => this.setState({currencyMethod})} onSearch={async (search) => await Search.receivementMethod(search)} renderItem={(item) => item.name}>
                                            <AutoComplete.Result>
                                                    {(item) => <span>{item?.name}</span>}
                                            </AutoComplete.Result>
                                        </AutoComplete>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='date' value={this.state?.issueDate} onChange={(event) => this.setState({issueDate: event.target.value})} />
                                            <span>Emissão</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='date' value={this.state?.dueDate} onChange={(event) => this.setState({dueDate: event.target.value})} />
                                            <span>Vencimento</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='text' value={this.state?.ourNumber} onChange={(event) => this.setState({ourNumber: event.target.value})} />
                                            <span>Nosso número</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className='form-control'>
                                        <AutoComplete label='Empresa' value={this.state?.company} text={(item) => item.surname} onChange={(company) => this.setState({company})} onSearch={async (search) => await Search.company(search)}>
                                            <AutoComplete.Result>
                                                    {(item) => <span>{item.surname}</span>}
                                            </AutoComplete.Result>
                                        </AutoComplete>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className='form-control'>
                                        <AutoComplete label='Pagador' value={this.state?.payer} text={(item) => item.surname} onChange={(payer) => this.setState({payer})} onSearch={async (search) => await Search.partner(search)}>
                                            <AutoComplete.Result>
                                                    {(item) => <span>{item.surname}</span>}
                                            </AutoComplete.Result>
                                        </AutoComplete>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className='form-control'>
                                        <AutoComplete label='Banco' value={this.state?.bankAccount} text={(item) => `${item.bank?.name} - ${item.agency}-${item.agencyDigit} / ${item.account}-${item.accountDigit}`} onChange={(bankAccount) => this.setState({bankAccount})} onSearch={async (search) => await Search.bankAccount(search)}>
                                            <AutoComplete.Result>
                                                    {(item) => <span>{item.bank?.name} - {item.agency}-{item.agencyDigit} / {item.account}-{item.accountDigit}</span>}
                                            </AutoComplete.Result>
                                        </AutoComplete>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className='form-control'>
                                        <AutoComplete label='Categoria' value={this.state?.categorie} text={(item) => item.name} onChange={(categorie) => this.setState({categorie})} onSearch={async (search) => await Search.contabilityCategorie(search)}>
                                            <AutoComplete.Result>
                                                    {(item) => <span>{item.name}</span>}
                                            </AutoComplete.Result>
                                        </AutoComplete>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='text' value={'R$'} readOnly />
                                            <span>Moeda</span>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className='form-control'>
                                        <label class="textfield-filled">
                                            <input type='text' value={this.state?.amount} onChange={(event) => this.setState({amount: event.target.value})} />
                                            <span>Valor</span>
                                        </label>
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
                        </fieldset>

                        {this.state?.currencyMethod?.id == '51dc90a7-3790-47a9-8365-8a8610f32f04' &&
                            
                            <fieldset>
                                <legend>Boleto</legend>

                                <Row gutterWidth={0}>
                                    <Col md={12}>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Linha digitável</span>
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                            
                                <Row gutterWidth={0}>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Valor do título</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Valor da multa</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Valor do juros</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Valor do descontos</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Valor total</span>
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                            </fieldset>

                        }

                        {this.state?.currencyMethod?.id == 'cae93f4b-c2de-43f0-821b-42d9697b6ddb' &&
                            
                            <fieldset>
                                <legend>PIX</legend>

                                <Row gutterWidth={0}>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <select value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})}>
                                                    <option>[Selecione]</option>
                                                    <option>CPF</option>
                                                    <option>CNPJ</option>
                                                    <option>E-mail</option>
                                                    <option>Chave aleatória</option>
                                                    <option>Copia e cola</option>
                                                </select>
                                                <span>Valor do título</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Chave</span>
                                            </label>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='form-control'>
                                            <label class="textfield-filled">
                                                <input type='text' value={this.state?.digitableLine} onChange={(event) => this.setState({digitableLine: event.target.value})} />
                                                <span>Valor da multa</span>
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                            </fieldset>

                        }
                            
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Confirmando...</> : <><MdCheckCircleOutline /> &nbsp; Confirmar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
            </Form>
        )

    }

}

export default ViewReceivement;
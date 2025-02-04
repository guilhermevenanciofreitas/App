import React from "react";
import { Button, CheckTree, DatePicker, Divider, Form, IconButton, Input, InputGroup, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, DataTable, PhotoPicker, ViewModal } from "../../../controls";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import _ from "lodash";
import { Search } from "../../../search";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdCheckCircleOutline } from "react-icons/md";

class ViewCtes extends React.Component {

    viewModal = React.createRef()

    show = async (shippiment) => {

        console.log(shippiment)

        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({shippiment})
        return this.viewModal.current.show()
    }

    onAddCte = async () => {
        this.setState({submting: true}, async () => {

            await new Service().Post('logistic/shippiment/add-cte', {shippimentId: this.state.shippiment.id, chaveCt: this.state.chaveCt}).then(async (result) => {
                if (result.status == 201) {
                    await toaster.push(<Message showIcon type='warning'>{result.data.message}</Message>, {placement: 'topEnd', duration: 5000 })
                    return
                }
                await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
                
                this.state?.shippiment.ctes.push({chaveCt: this.state.chaveCt})

                this.setState({shippiment: this.state?.shippiment})
                
            }).finally(() => this.setState({chaveCt: '', submting: false}))

        })
    }

    onDeleteNfe = async (row) => {

        this.setState({deleting: true}, async () => {
            await new Service().Post('logistic/cte/delete-nfe', {id: row.id}).then(async (result) => {

                await toaster.push(<Message showIcon type='success'>Excluído com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })

                this.state.cte.cteNfes = _.filter(this.state?.cte?.cteNfes, (cteNfe) => cteNfe.id !== row.id)

                console.log(this.state.cte)

                this.setState({cte: {...this.state.cte, cteNfes: this.state.cte.cteNfes}})
                
            }).finally(() => {
                this.setState({deleting: false})
            })

        })
    }

    close(role) {
        this.viewModal.current?.close(role)
    }

    columns = [
        { selector: (row) => row.chaveCt, name: 'Chave de acesso'},
        { selector: (row) => <IconButton color="red" size={'sm'} circle icon={<FaTrash />} appearance="ghost" onClick={() => this.onDeleteNfe(row)} />, name: '', minWidth: '80px', maxWidth: '80px'},
   ]

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.submit}>
                <ViewModal ref={this.viewModal} size={820}>
                    <Modal.Header><Modal.Title><Container>Conhecimentos</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                                
                            <Col md={12}>
                                <DataTable height={'auto'} columns={this.columns} rows={this.state?.shippiment.ctes} noDataComponent={'Nenhuma conhecimento'} />
                            </Col>

                            <Divider />

                            <Col md={8}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.chaveCt} onChange={(event) => this.setState({chaveCt: event.target.value})} />
                                        <span>Chave de acesso</span>
                                    </label>
                                </div>
                            </Col>

                            <p style={{marginTop: '10px', marginLeft: '10px'}}><Button appearance="primary" color='green' onClick={this.onAddCte} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Adicionando...</> : <><MdCheckCircleOutline /> &nbsp; Adicionar</>}</Button></p>

                        </Row>
                    </Modal.Body>
                </ViewModal>
            </Form>
        )

    }

}

export default ViewCtes;
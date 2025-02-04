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

class ViewNfes extends React.Component {

    viewModal = React.createRef()

    show = async (cte) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({cte})
        return this.viewModal.current.show()
    }

    onAddNfe = async () => {
        this.setState({submting: true}, async () => {

            await new Service().Post('logistic/cte/add-nfe', {cteId: this.state.cte.id, chaveNf: this.state.chaveNf}).then(async (result) => {
                if (result.status == 201) {
                    await toaster.push(<Message showIcon type='warning'>{result.data.message}</Message>, {placement: 'topEnd', duration: 5000 })
                    return
                }
                await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
                
                this.state?.cte?.cteNfes.push({nfe: {chaveNf: this.state.chaveNf}})

                this.setState({cte: this.state?.cte})
                
            }).finally(() => this.setState({chaveNf: '', submting: false}))

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
        { selector: (row) => row.nfe.chaveNf, name: 'Chave de acesso'},
        { selector: (row) => <IconButton color="red" size={'sm'} circle icon={<FaTrash />} appearance="ghost" onClick={() => this.onDeleteNfe(row)} />, name: '', minWidth: '80px', maxWidth: '80px'},
   ]

    render = () => {
        
        return (
            <Form autoComplete='off' onSubmit={this.submit}>
                <ViewModal ref={this.viewModal} size={820}>
                    <Modal.Header><Modal.Title><Container>Notas fiscais</Container></Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row gutterWidth={0}>
                                
                            <Col md={12}>
                                <DataTable height={'auto'} columns={this.columns} rows={this.state?.cte?.cteNfes} noDataComponent={'Nenhuma nota fiscal'} />
                            </Col>

                            <Divider />

                            <Col md={8}>
                                <div className='form-control'>
                                    <label class="textfield-filled">
                                        <input type='text' value={this.state?.chaveNf} onChange={(event) => this.setState({chaveNf: event.target.value})} />
                                        <span>Chave de acesso</span>
                                    </label>
                                </div>
                            </Col>

                            <p style={{marginTop: '10px', marginLeft: '10px'}}><Button appearance="primary" color='green' onClick={this.onAddNfe} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Adicionando...</> : <><MdCheckCircleOutline /> &nbsp; Adicionar</>}</Button></p>

                        </Row>
                    </Modal.Body>
                </ViewModal>
            </Form>
        )

    }

}

export default ViewNfes;
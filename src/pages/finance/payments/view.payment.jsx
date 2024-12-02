import React from "react";
import { Button, CheckTree, Col, Form, Grid, Input, Loader, Message, Modal, Row, toaster } from 'rsuite';
import { PhotoPicker, ViewModal } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import _ from "lodash";

const initialValues = {
    id: '',
    name: '',
}

class ViewPayment extends React.Component {

    viewModal = React.createRef();

    newPayment = async () => {
        this.setState({id: undefined, name: '', roleRules: []});
        return this.viewModal.current.show()
    }

    editRole = async (id) => {
        Loading.Show();
        this.setState(initialValues);
        await new Service().Post('setting/role/detail', {id}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide());
        return this.viewModal.current.show()
    }

    submit = async () => {
        this.setState({submting: true}, async () => {
            const role = _.pick(this.state, ['id', 'name', 'roleRules'])
            await new Service().Post('setting/role/submit', role).then(async (result) => {
                await toaster.push(<Message showIcon type='success'>Salvo com sucesso!</Message>, {placement: 'topEnd', duration: 5000 })
                this.viewModal.current?.close(result.data)
            }).finally(() => this.setState({submting: false}));
        })
    }

    close(role) {
        this.viewModal.current?.close(role)
    }

    onChangeRules = (roleRules) => {

        const index = ['1', '2', '3.1', '3.2', '3.3']

        const rules = []

        for (const roleRule of roleRules) {
            if (index.includes(roleRule)) {
                const r = _.map(_.filter(permissions, (c) => c.value == roleRule)[0]?.children, (c) => c.value)
                for(const c of r) {
                    rules.push(c)
                }
            } else {
                rules.push(roleRule)
            }
        }

        const roleRule = _.map(rules, (ruleId) => {
            return { ruleId }
        })

        this.setState({roleRules: roleRule})
    }

    render = () => {
        
        return (
            <ViewModal ref={this.viewModal} size={900}>
                <Modal.Header><Modal.Title>{this.props.title ? this.props.title : _.isEmpty(this.state?.id) ? 'Novo cargo' : 'Editar cargo'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col md={4}>
                                <label>Número</label>
                                <Input type='text' appearance='' value={this.state?.name} onChange={(name) => this.setState({name})} />
                            </Col>
                            <br></br>
                            <hr></hr>
                            <br></br>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Confirmando...</> : <><MdCheckCircleOutline /> &nbsp; Confirmar</>}</Button>
                </Modal.Footer>
            </ViewModal>
        )

    }

}

export default ViewPayment;
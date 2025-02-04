import React from "react";
import { Button, Col, Form, Grid, Input, Modal, Row } from 'rsuite';
import { ViewModal } from "../../../controls";
import _ from "lodash";
import { MdCheckCircleOutline } from "react-icons/md";

const initialValues = {
    saving: false,
    canceling: false,
    finishing: false,
    data: {
        id: '',
        travelId: '',
    }
}

class ViewProduct extends React.Component {

    viewModal = React.createRef();

    state = initialValues;

    newProduct = async () => {
        //Loading.Show();
        //this.setState(initialValues);
        //await new Service().Post('logistic/orders/find-one', {id}).then((result) => this.setState({data: result.data})).finally(() => Loading.Hide());
        return this.viewModal.current.show()
    }

    close(value) {
        this.viewModal.current?.close(value)
    }

    render = () => {
        
        return (
            <ViewModal ref={this.viewModal}>
                <Modal.Header><Modal.Title>{_.isEmpty(this.state?.id) ? 'Novo produto' : 'Editar produto'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col md={24}>
                                <label>Nome</label>
                                <Input type='text' value={this.state?.name} onChange={(name) => this.setState({name})} />
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button appearance="primary" color='green'><MdCheckCircleOutline />&nbsp; Confirmar</Button>
                </Modal.Footer>
            </ViewModal>
        )

    }

}

export default ViewProduct;
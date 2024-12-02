import React from "react";
import { Button, CheckTree, Col, Form, Grid, Input, Loader, Message, Modal, Row, toaster } from 'rsuite';
import { PhotoPicker, ViewModal } from "../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../service";
import { Loading } from "../../App";

import _ from "lodash";

const permissions = [
    { value: '3.1', children: [
        {label: 'Visualizar', value: 'c99a9c76-bce0-4007-8fe8-27da5c7ba141'},
        {label: 'Cadastrar', value: 'c947a01a-6d8b-4f47-9c54-92c9ce6fdfa7'},
        {label: 'Editar', value: '8d5c0b06-0f09-42ae-9823-a261f1e98108'},
        {label: 'Excluir', value: '0daae48e-bd1a-4c45-9644-5f90e3c4a451'},
    ]},
    { value: '3.2', children: [
        {label: 'Visualizar', value: '90ce2715-a5df-4ea3-a658-0f2e076a5441'},
        {label: 'Cadastrar', value: '9eb31bd7-eabb-46e8-b4b7-62053c561e56'},
        {label: 'Editar', value: '956e095e-46c9-4dd0-828b-ea456ed3e803'},
        {label: 'Excluir', value: 'a606b1cc-bbf7-4489-9948-2dd71d891cf2'},
    ]},
    { value: '3.3', children: [
        {label: 'Visualizar', value: 'ce879c5f-57d2-4a53-ac55-0f9e77cf20cb'},
        {label: 'Cadastrar', value: 'b2627091-06de-49fa-a0b1-508489fff04e'},
        {label: 'Editar', value: '650ea2f9-9365-4162-aacc-bb0b971cf4ba'},
        {label: 'Excluir', value: 'ffc90b11-f308-4b32-bb14-4f1180d90b09'},
    ]},
    { value: '9.1', children: [
        {label: 'Visualizar', value: ''},
        {label: 'Editar', value: ''},
    ]},
    { value: '9.2', children: [
        {label: 'Visualizar', value: ''},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]},
    { value: '9.3', children: [
        {label: 'Visualizar', value: ''},
        {label: 'Cadastrar', value: ''},
        {label: 'Editar', value: ''},
        {label: 'Excluir', value: ''},
    ]}
]

const data = [
    /*
    {
        label: 'Caledário', value: '1', children: [
            {label: 'Visualizar', value: '1.1'},
            {label: 'Cadastrar', value: '1.2'},
            {label: 'Editar', value: '1.3'},
            {label: 'Excluir', value: '1.4'},
        ]
    },
    {
        label: 'Chamados', value: '2', children: [
            {label: 'Visualizar', value: '2.1'},
            {label: 'Cadastrar', value: '2.2'},
            {label: 'Editar', value: '2.3'},
            {label: 'Excluir', value: '2.4'},
        ]
    },
    {
        label: 'Cadastros', value: '3', children: [
            {
                label: 'Clientes', value: '3.1', children: _.filter(permissions, (c) => c.value == '3.1')[0]?.children
            },
            {
                label: 'Fornecedores', value: '3.2', children: _.filter(permissions, (c) => c.value == '3.2')[0]?.children
            },
            {
                label: 'Produtos', value: '3.3', children: _.filter(permissions, (c) => c.value == '3.3')[0]?.children
            },
            {
                label: 'Serviços', value: '3.4', children: [
                    {label: 'Visualizar', value: '3.4.1'},
                    {label: 'Cadastrar', value: '3.4.2'},
                    {label: 'Editar', value: '3.4.3'},
                    {label: 'Excluir', value: '3.4.4'},
                ]
            },
            {
                label: 'Anúncios', value: '3.5', children: [
                    {label: 'Visualizar', value: '3.5.1'},
                    {label: 'Cadastrar', value: '3.5.2'},
                    {label: 'Editar', value: '3.5.3'},
                    {label: 'Excluir', value: '3.5.4'},
                ]
            },
            {
                label: 'Promoções', value: '3.6', children: [
                    {label: 'Visualizar', value: '7.1.1'},
                    {label: 'Cadastrar', value: '7.1.2'},
                    {label: 'Editar', value: '7.1.3'},
                    {label: 'Excluir', value: '7.1.4'},
                ]
            }
        ],
    },
    {
        label: 'Suprimentos', value: '4', children: []
    },
    {
        label: 'Finanças', value: '5', children: []
    },
    {
        label: 'Vendas', value: '6', children: [],
    },
    {
        label: 'Serviço', value: '7', children: [],
    },
    {
        label: 'Fiscal', value: '8', children: [],
    },
    */
    {
        label: 'Configurações', value: '9', children: [
            {
                label: 'Informações', value: '9.1', children: _.filter(permissions, (c) => c.value == '9.1')[0]?.children
            },
            {
                label: 'Usuários', value: '9.2', children: _.filter(permissions, (c) => c.value == '9.2')[0]?.children
            },
            {
                label: 'Cargos', value: '9.3', children: _.filter(permissions, (c) => c.value == '9.3')[0]?.children
            },
        ],
    }
]

class ViewRole extends React.Component {

    viewModal = React.createRef();

    newRole = async () => {
        this.setState({id: undefined, name: '', roleRules: []});
        return this.viewModal.current.show()
    }

    editRole = async (id) => {
        Loading.Show();
        this.setState();
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
            <ViewModal ref={this.viewModal} size={450}>
                <Modal.Header><Modal.Title>{'Cargo'}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Grid fluid>
                        <Row>
                            <Col md={24}>
                                <label>Nome</label>
                                <Input type='text' appearance='' value={this.state?.name} onChange={(name) => this.setState({name})} />
                            </Col>
                            <br></br>
                            <hr></hr>
                            <br></br>
                            <Col md={24}>
                                <label>Permissões</label>
                                <CheckTree data={data} value={_.map(this.state?.roleRules, (rule) => rule.ruleId)} onChange={this.onChangeRules} />
                            </Col>
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

export default ViewRole;
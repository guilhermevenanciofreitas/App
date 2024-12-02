import React from "react";
import { Button, Drawer, FlexboxGrid, List, Placeholder, Steps} from 'rsuite'

import _ from "lodash";
import { ViewDrawer } from "../../../controls";
import { Service } from "../../../service";
import { Loading } from "../../../App";
import ViewNewStatementMercadoPago from "./banks/mercado-livre";

const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
}

const titleStyle = {
    paddingBottom: 5,
    whiteSpace: 'nowrap',
    fontWeight: 500
}

class ViewNewStatement extends React.Component {

    viewDrawer = React.createRef();

    newStatement = async () => {
        Loading.Show()
        this.setState({bankAccount: undefined}, async () => {
            await new Service().Post('finance/statement/bank-accounts').then((result) => this.setState({...result.data})).finally(() => Loading.Hide());
            return this.viewDrawer.current.show()
        })
    }

    step = () => {

        if (!this.state?.bankAccount) return 0

        if (this.state?.bankAccount) return 1

    }

    render = () => {

        return (
            <ViewDrawer ref={this.viewDrawer} size={800}>
                <Drawer.Header><Drawer.Title>Novo extrato</Drawer.Title></Drawer.Header>
                <Drawer.Body>

                    <Steps current={this.step()}>
                        <Steps.Item title="Banco" />
                        <Steps.Item title="Extrato" />
                        <Steps.Item title="Confirmar" />
                    </Steps>

                    <br></br>
                    <hr></hr>
                    <br></br>

                    {!this.state?.bankAccount && <>
                        <List hover>
                            {this.state?.response?.bankAccounts?.rows?.map((bankAccount, index) => (
                                <List.Item key={index} index={index + 1} style={{cursor: 'pointer'}} onClick={() => this.setState({bankAccount})}>
                                    <FlexboxGrid>
                                        <FlexboxGrid.Item colspan={4} style={styleCenter}><img src={bankAccount.bank?.image} style={{height: 20}} /></FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={20} style={{ ...styleCenter, flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
                                        <div style={titleStyle}>{bankAccount.bank?.name}</div>
                                        <div style={titleStyle}>Agência: {bankAccount.agency}-{bankAccount.agencyDigit} / Conta: {bankAccount.account}-{bankAccount.accountDigit}</div>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </List.Item>
                            ))}
                        </List>
                    </>}
                    
                    {/* Mercado Pago */}
                    {this.state?.bankAccount?.bank?.id && <>
                        <ViewNewStatementMercadoPago bankAccountId={this.state.bankAccount.id} />
                    </>}

                </Drawer.Body>
            </ViewDrawer>
        )

    }

}

export default ViewNewStatement;
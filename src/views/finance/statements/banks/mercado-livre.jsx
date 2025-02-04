import React from 'react'
import { Service } from '../../../../service'
import { DataTable } from '../../../../controls'
import dayjs from "dayjs"
import _ from "lodash"

class ViewNewStatementMercadoPago extends React.Component {

    componentDidMount = async () => {
        this.setState({loading: true}, async () => {
            await new Service().Post('integration/mercado-livre/statement', this.props.bankAccountId).then((result) => this.setState({rows: result.data.response})).finally(() => this.setState({loading: false}))
        })
    }

    columns = [
        { selector: (row) => row.id, name: 'Id'},
        { selector: (row) => dayjs(row.date_created).add(-4, 'hour').format('DD/MM/YYYY HH:mm'), name: 'Data' },
        { selector: (row) => dayjs(row.begin_date).format('DD/MM/YYYY HH:mm'), sort: 'begin_date', name: 'Data Inicial' },
        { selector: (row) => dayjs(row.end_date).format('DD/MM/YYYY HH:mm'), name: 'Data Final' },
    ];

    render = () => {

        return (
            <>
            Mercado Pago
            <DataTable loading={this.state?.loading} placeholder={4} columns={this.columns} rows={this.state?.rows} />
            </>
        )

    }

}

export default ViewNewStatementMercadoPago
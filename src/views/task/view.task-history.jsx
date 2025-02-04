import React from "react"
import { Container, Row, Col } from 'react-grid-system'
import { Button, CheckPicker, Form, Input, Loader, Message, Modal, toaster } from 'rsuite'
import { AutoComplete, DataTable, PhotoPicker, ViewModal } from "../../controls"
import { Loading } from '../../App'
import { MdCheckCircleOutline } from "react-icons/md"
import { Service } from "../../service"
import _ from "lodash"
import { Search } from "../../search"
import dayjs from "dayjs"

class ViewTaskHistory extends React.Component {

    viewModal = React.createRef();

    histories = async (taskId) => {
        Loading.Show()
        await new Service().Post('task/histories', {taskId}).then((result) => this.setState({...result.data})).finally(() => Loading.Hide())
        return this.viewModal.current.show()
    }

    close(value) {
        this.viewModal.current?.close(value)
    }
    
    columns = [
        { selector: (row) => dayjs(row.entryAt).format('DD/MM/YYYY HH:mm:ss'), name: 'Data' },
        { selector: (row) => dayjs(row.finishedAt).format('DD/MM/YYYY HH:mm:ss'), name: 'Término' },
        { selector: (row) => row.error ? <>❌ Erro</> : <>✅ Executado com sucesso</>, name: 'Mensagem' },
    ]

    render = () => {
        
        return (
            <ViewModal ref={this.viewModal} size={660}>
                <Modal.Header><Modal.Title>Histórico</Modal.Title></Modal.Header>
                <Modal.Body>
                    <DataTable columns={this.columns} rows={this.state?.response?.rows} noDataComponent={'Sem histórico!'} />
                </Modal.Body>
            </ViewModal>
        )
    }

}

export default ViewTaskHistory;
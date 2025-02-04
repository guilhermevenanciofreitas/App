import React from "react";
import { Button, CheckTree, DatePicker, Form, Input, InputGroup, Loader, Message, Modal, toaster } from 'rsuite';
import { Container, Row, Col } from 'react-grid-system';
import { AutoComplete, PhotoPicker, ViewModal } from "../../../controls";
import { MdCheckCircleOutline } from "react-icons/md";
import { Service } from "../../../service";
import { Loading } from "../../../App";

import { Search } from "../../../search";

import { Worker, Viewer } from "@react-pdf-viewer/core";
//import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
//import { toolbarPlugin, ToolbarSlot } from "@react-pdf-viewer/toolbar";

import "@react-pdf-viewer/core/lib/styles/index.css";
//import "@react-pdf-viewer/default-layout/lib/styles/index.css";

class ViewDacte extends React.Component {

    viewModal = React.createRef()

    print = async (pdf) => {
        if (this.state) for (const prop of Object.getOwnPropertyNames(this.state)) delete this.state[prop]
        this.setState({...pdf})
        return this.viewModal.current.show()
    }

    close(role) {
        this.viewModal.current?.close(role)
    }

    render = () => {
        
        //const defaultLayoutPluginInstance = defaultLayoutPlugin();

        return (
                <ViewModal ref={this.viewModal} size={820}>
                    <Modal.Header><Modal.Title><Container>Dacte</Container></Modal.Title></Modal.Header>
                    <Modal.Body>

                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                        <div style={{ height: "720px" }}>
                            <Viewer fileUrl={'https://www.thecampusqdl.com/uploads/files/pdf_sample_2.pdf'} />
                        </div>
                    </Worker>
                            
                    </Modal.Body>
                    <Modal.Footer>
                        <Button appearance="primary" color='green' onClick={this.submit} disabled={this.state?.submting}>{this.state?.submting ? <><Loader /> &nbsp; Salvando...</> : <><MdCheckCircleOutline /> &nbsp; Salvar</>}</Button>
                    </Modal.Footer>
                </ViewModal>
        )

    }

}

export default ViewDacte;
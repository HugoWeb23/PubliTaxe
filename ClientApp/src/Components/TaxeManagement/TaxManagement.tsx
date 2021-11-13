import { useState } from 'react'
import {
    Card,
    ListGroup,
    Row,
    Col
} from 'react-bootstrap'
import { TaxeForm } from './TaxeForm'

export const TaxManagement = () => {

    return <>
        <Row className="me-0 mt-0">
            <Col xs="3">
            <div style={{ width: '100%', height: 'calc(100vh - 58px)', overflow: 'hidden', overflowY: 'scroll' }}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                    </ListGroup>
                </Card>
            </div>
            </Col>
            <Col xs="9">
            <TaxeForm/>
            </Col>
        </Row>
    </>
}
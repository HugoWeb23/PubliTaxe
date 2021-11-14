import axios from 'axios'
import { useEffect, useState } from 'react'
import {
    Card,
    ListGroup,
    Row,
    Col
} from 'react-bootstrap'
import { AxiosService } from '../../Services/AxiosService'
import { IEntreprise } from '../../Types/IEntreprise'
import { TaxeForm } from './TaxeForm'

export const TaxManagement = () => {

    const [entreprises, setEntreprises] = useState<IEntreprise[]>([])

    useEffect(() => {
        (async() => {
            const fetchEntreprises = await axios.get<IEntreprise[]>('https://localhost:5001/api/entreprises/getnames')
            setEntreprises(fetchEntreprises.data)
        })()
    }, [])

    return <>
        <Row className="me-0 mt-0">
            <Col xs="3">
            <div style={{ width: '100%', height: 'calc(100vh - 58px)', overflow: 'hidden', overflowY: 'scroll' }}>
                <Card>
                    <ListGroup variant="flush">
                        {entreprises.length > 0 && entreprises.map((entreprise: IEntreprise, index: number) => {
                            return <ListGroup.Item>#{entreprise.matricule_ciger} {entreprise.nom}</ListGroup.Item>
                        })}
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
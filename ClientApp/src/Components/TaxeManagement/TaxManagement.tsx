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
import { Loader } from '../UI/Loader'
import { EditTax } from './EditTax'

export const TaxManagement = () => {

    const [entreprises, setEntreprises] = useState<IEntreprise[]>([])
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async() => {
            const fetchEntreprises = await axios.get<IEntreprise[]>('https://localhost:5001/api/entreprises/names')
            setEntreprises(fetchEntreprises.data)
            setLoader(false)
        })()
    }, [])

    const ShowEntreprise = async(entreprise: IEntreprise) => {
        const fetchEntreprise = await axios.get<any>(`https://localhost:5001/api/entreprises/id/${entreprise.matricule_ciger}`)
        console.log(fetchEntreprise.data);
    }

    return <>
        <Row className="me-0 mt-0">
            <Col xs="3">
            <div style={{ width: '100%', height: 'calc(100vh - 58px)', overflow: 'hidden', overflowY: 'scroll' }}>
                <Card>
                    <ListGroup variant="flush">
                        {loader == true && <Loader variant="primary"/>}
                        {loader == false && entreprises.map((entreprise: IEntreprise, index: number) => {
                            return <ListGroup.Item action onClick={() => ShowEntreprise(entreprise)}>#{entreprise.matricule_ciger} {entreprise.nom}</ListGroup.Item>
                        })}
                    </ListGroup>
                </Card>
            </div>
            </Col>
            <Col xs="9">
            <EditTax/>
            </Col>
        </Row>
    </>
}
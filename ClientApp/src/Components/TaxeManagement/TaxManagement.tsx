import axios from 'axios'
import { useEffect, useState } from 'react'
import {
    Card,
    ListGroup,
    Row,
    Col
} from 'react-bootstrap'
import { AxiosService } from '../../Services/AxiosService'
import { ENames, Entreprise } from '../../Types/IEntreprise'
import { Loader } from '../UI/Loader'
import { EditTax } from './EditTax'

export const TaxManagement = () => {

    const [entreprises, setEntreprises] = useState<ENames[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [showEntrepriseLoader, setShowEntrepriseLoader] = useState<boolean>(false)
    const [entreprise, setEntreprise] = useState<any>({})

    useEffect(() => {
        (async() => {
            const fetchEntreprises = await AxiosService('/entreprises/names')
            setEntreprises(fetchEntreprises)
            setLoader(false)
        })()
    }, [])

    const ShowEntreprise = async(entreprise: ENames) => {
        setShowEntrepriseLoader(true)
        const fetchEntreprise = await AxiosService(`/entreprises/id/${entreprise.matricule_ciger}`)
        setEntreprise(fetchEntreprise)
        setShowEntrepriseLoader(false)
    }

    return <>
        <Row className="me-0 mt-0">
            <Col xs="3">
            <div style={{ width: '100%', height: 'calc(100vh - 58px)', overflow: 'hidden', overflowY: 'scroll' }}>
                <Card>
                    <ListGroup variant="flush">
                        {loader == true && <Loader variant="primary"/>}
                        {loader == false && entreprises.map((entreprise: ENames, index: number) => {
                            return <ListGroup.Item key={index} action onClick={() => ShowEntreprise(entreprise)}>#{entreprise.matricule_ciger} {entreprise.nom}</ListGroup.Item>
                        })}
                    </ListGroup>
                </Card>
            </div>
            </Col>
            <Col xs="9">
            <EditTax entreprise={entreprise} isLoading={showEntrepriseLoader}/>
            </Col>
        </Row>
    </>
}
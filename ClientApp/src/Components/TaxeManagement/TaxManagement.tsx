import axios from 'axios'
import { useEffect, useState } from 'react'
import {
    Card,
    ListGroup,
    Row,
    Col,
    Button
} from 'react-bootstrap'
import { apiFetch } from '../../Services/apiFetch'
import { ENames, Entreprise } from '../../Types/IEntreprise'
import { Loader } from '../UI/Loader'
import { EditTax } from './EditTax'
import {CreateTax} from './CreateTax'

export const TaxManagement = () => {

    const [entreprises, setEntreprises] = useState<ENames[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [mode, setMode] = useState<number>(2)
    const [showEntrepriseLoader, setShowEntrepriseLoader] = useState<boolean>(false)
    const [entreprise, setEntreprise] = useState<any>({})

    useEffect(() => {
        (async() => {
            const fetchEntreprises = await apiFetch('/entreprises/names')
            setEntreprises(fetchEntreprises)
            setLoader(false)
        })()
    }, [])

    const ShowEntreprise = async(entreprise: ENames) => {
        setMode(2)
        setShowEntrepriseLoader(true)
        const fetchEntreprise = await apiFetch(`/entreprises/id/${entreprise.matricule_ciger}`)
        setEntreprise(fetchEntreprise)
        setShowEntrepriseLoader(false)
    }

    return <>
        <Row className="me-0 mt-0">
            <Col xs="3">
            <div style={{ width: '100%', height: 'calc(100vh - 58px)', overflow: 'hidden', overflowY: 'scroll' }}>
            <div className="d-grid gap-2 mt-2 mb-2">
            <Button variant="primary" size="sm" onClick={() => setMode(1)}>Nouvel enregistrement</Button>
            </div>
                <Card>
                    <ListGroup variant="flush">
                        {loader == true && <Loader variant="primary"/>}
                        {loader == false && entreprises.map((ent: ENames, index: number) => {
                            return <ListGroup.Item key={index} action active={mode == 2 && (entreprise.matricule_ciger == ent.matricule_ciger)} onClick={() => ShowEntreprise(ent)}>#{entreprise.matricule_ciger} {ent.nom}</ListGroup.Item>
                        })}
                    </ListGroup>
                </Card>
            </div>
            </Col>
            <Col xs="9">
            {mode == 1 ? <CreateTax/> : <EditTax entreprise={entreprise} isLoading={showEntrepriseLoader}/>}
            </Col>
        </Row>
    </>
}
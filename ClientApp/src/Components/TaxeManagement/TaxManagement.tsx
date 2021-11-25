import { useEffect, useState } from 'react'
import {
    Card,
    Row,
    Col,
    Table,
    DropdownButton,
    Dropdown,
    Container,
    Button,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { apiFetch } from '../../Services/apiFetch'
import { Loader } from '../UI/Loader'
import { Link, useHistory } from 'react-router-dom'
import { IApercu_entreprise } from '../../Types/IApercu_entreprise'
import { Pencil } from '../UI/Pencil'
import { Eye } from '../UI/Eye'
import { Trash } from '../UI/Trash'

export const TaxManagement = () => {

    const [entreprises, setEntreprises] = useState<IApercu_entreprise[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const history = useHistory()

    useEffect(() => {
        (async () => {
            const fetchEntreprises = await apiFetch('/entreprises/names')
            setEntreprises(fetchEntreprises)
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    return <>
        <Container fluid={true}>
            <Row className="me-0 mt-0 mt-3">
                <Col md="3" xs="12">
                    <Card>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button variant="primary" size="sm" onClick={() => history.push('/entreprise/create')}>Nouvel enregistrement</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="9" xs="1">
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Matricule</th>
                                <th>Nom entreprise</th>
                                <th>Panneaux</th>
                                <th>Recu</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loader == false && entreprises.map((entreprise: IApercu_entreprise, index: number) => <Tax apercu_entreprise={entreprise} index={index} />)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    </>
}

interface ITax {
    apercu_entreprise: IApercu_entreprise,
    index: number
}


const Tax = ({ apercu_entreprise, index }: ITax) => {
    const history = useHistory();
    return <>
        <tr key={index}>
            <td>{apercu_entreprise.matricule_ciger}</td>
            <td>{apercu_entreprise.nom}</td>
            <td>{apercu_entreprise.nombre_panneaux}</td>
            <td className={apercu_entreprise.recu ? "table-success" : "table-danger"}>{apercu_entreprise.recu ? "Oui" : "Non"}</td>
            <td>
                <div className="d-flex">
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-1`}>
                                Éditer
                            </Tooltip>
                        }
                    >
                        <Button size="sm" variant="secondary" className="me-1" onClick={() => history.push(`/entreprise/edit/${apercu_entreprise.matricule_ciger}`)}><Pencil /></Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Visionner
                            </Tooltip>
                        }
                    >
                    <Button size="sm" className="me-1" variant="info" onClick={() => history.push(`/entreprise/view/${apercu_entreprise.matricule_ciger}`)}><Eye /></Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`tooltip-2`}>
                                Supprimer
                            </Tooltip>
                        }
                    >
                    <Button size="sm" variant="danger"><Trash /></Button>
                    </OverlayTrigger>
                </div>
            </td>
        </tr>
    </>
}
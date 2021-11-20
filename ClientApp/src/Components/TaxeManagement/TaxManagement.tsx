import { useEffect, useState } from 'react'
import {
    Card,
    Row,
    Col,
    Table,
    DropdownButton,
    Dropdown,
    Container
} from 'react-bootstrap'
import { apiFetch } from '../../Services/apiFetch'
import { Loader } from '../UI/Loader'
import { useHistory } from 'react-router-dom'
import { IApercu_entreprise } from '../../Types/IApercu_entreprise'

export const TaxManagement = () => {

    const [entreprises, setEntreprises] = useState<IApercu_entreprise[]>([])
    const [loader, setLoader] = useState<boolean>(true)

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
                    <Card.Body>This is some text within a card body.</Card.Body>
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
                        {loader == false && entreprises.map((entreprise: IApercu_entreprise, index: number) => <Tax apercu_entreprise={entreprise} index={index}/>)}
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
            <td><DropdownButton title="Actions" variant="warning" size="sm">
                <Dropdown.Item eventKey="1" onClick={() => history.push(`/entreprise/edit/${apercu_entreprise.matricule_ciger}`)}>Éditer</Dropdown.Item>
                <Dropdown.Item eventKey="2">Supprimer</Dropdown.Item>
            </DropdownButton></td>
        </tr>
    </>
}
import { useEffect, useState } from "react"
import { apiFetch } from "../../Services/apiFetch"
import { Entreprise } from "../../Types/IEntreprise"
import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Container,
    Table,
    Modal,
    Alert
} from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { LeftArrow } from "../UI/LeftArroy"
import { Loader } from "../UI/Loader"

export const ViewTax = ({ match }: any) => {
    const entrepriseID = match.params.id
    const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            const entreprise = await apiFetch(`/entreprises/id/${entrepriseID}`)
            setEntreprise(entreprise)
            setLoader(false)
        })()
    }, [])
    return <>
        <Container fluid="xl">
            <div className="mt-3">
                <Link to="/" className="link"><LeftArrow /> Retour à la liste des entreprises</Link>
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mt-3">Consulter les informations d'une entreprise {entreprise !== null && <span className="fw-bold">({entreprise.nom})</span>}</h4>
                </div>
                <hr className="my-3" />
            </div>
            {(loader === false && entreprise !== null) ? <>
                <div>Matricule Ciger : <span className="fw-bold">{entreprise.matricule_ciger}</span></div>
                <div>Procès-verbal : <span className="fw-bold">{entreprise.proces_verbal ? "Oui" : "Non"}</span></div>
                <div>Province : <span className="fw-bold">{entreprise.province ? "Oui" : "Non"}</span></div>
                <div>Reçu : <span className="fw-bold">{entreprise.recu ? "Oui" : "Non"}</span></div>
                <div>Langue : <span className="fw-bold">{entreprise.role_linguistique === 1 ? "Français" : "Néerlandais"}</span></div>
                <div>Nom : <span className="fw-bold">{entreprise.nom}</span></div>
                <div>Code rue : <span className="fw-bold">{entreprise.code_rue}</span></div>
                <div>Rue : <span className="fw-bold">{entreprise.adresse_rue}</span></div>
                <div>Numéro : <span className="fw-bold">{entreprise.adresse_numero}</span></div>
                <div>Index : <span className="fw-bold">{entreprise.adresse_index}</span></div>
                <div>Boite : <span className="fw-bold">{entreprise.adresse_boite}</span></div>
                <div>Numéro : <span className="fw-bold">{entreprise.adresse_numero}</span></div>
                <div>Code postal : <span className="fw-bold">{entreprise.code_postal.cp}</span></div>
                <div>Localité : <span className="fw-bold">{entreprise.code_postal.localite}</span></div>
                <div>Téléphone : <span className="fw-bold">{entreprise.numero_telephone}</span></div>
                <div>Fax : <span className="fw-bold">{entreprise.numero_fax}</span></div>
                <div>Personne de contact : <span className="fw-bold">{entreprise.personne_contact}</span></div>
                <div>Téléphone : <span className="fw-bold">{entreprise.telephone_contact}</span></div>
                <div>Adresse e-mail : <span className="fw-bold">{entreprise.mail_contact}</span></div>
                <div>Numéro de TVA : <span className="fw-bold">{entreprise.numero_tva}</span></div>
                <div>% majoration : <span className="fw-bold">{entreprise.pourcentage_majoration}</span></div>
                <div>Motif majoration : <span className="fw-bold">{entreprise.motif_majoration}</span></div>
                <div>Commentaire : <span className="fw-bold">{entreprise.commentaire_taxation}</span></div>
                <Card>
                    <Card.Header as="h6">Adresse de taxation</Card.Header>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col>
                                <div>Code rue taxation : <span className="fw-bold">{entreprise.code_rue_taxation}</span></div>
                            </Col>
                            <Col>
                                <div>Adresse taxation : <span className="fw-bold">{entreprise.adresse_taxation}</span></div>
                            </Col>
                            <Col>
                                <div>Numéro : <span className="fw-bold">{entreprise.adresse_numero_taxation}</span></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>Index : <span className="fw-bold">{entreprise.adresse_index_taxation}</span></div>
                            </Col>
                            <Col>
                                <div>Boite : <span className="fw-bold">{entreprise.adresse_boite_taxation}</span></div>
                            </Col>
                            <Col>
                                <div>Code postal : <span className="fw-bold">{entreprise.adresse_code_postal_taxation}</span></div>
                            </Col>
                            <Col>
                                <div>Localité : <span className="fw-bold">{entreprise.adresse_localite_taxation}</span></div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </> : <Loader />}
        </Container>
    </>
}
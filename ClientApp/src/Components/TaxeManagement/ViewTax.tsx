import { useEffect, useState } from "react"
import { apiFetch } from "../../Services/apiFetch"
import { Entreprise } from "../../Types/IEntreprise"
import {
    Button,
    Row,
    Col,
    Card,
    Container,
    Table,
    Badge
} from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { LeftArrow } from "../UI/LeftArroy"
import { Loader } from "../UI/Loader"
import { IPublicite, IPubliciteImage } from "../../Types/IPublicite"
import { ViewAdvertisingModal } from "./ViewAdvertisingModal"
import { IMotif_majoration } from "../../Types/IMotif_majoration"
import { IExercice } from "../../Types/IExercice"
import { IPrintData } from "../../Types/IPrintData"
import { IInformation } from "../../Types/IInformations"
import { IndividualPrint } from "./IndividualPrint"
import { Printer } from "../UI/Printer"

interface IViewTax {
    match?: any,
    motifs: IMotif_majoration[],
    tarifs: any,
    currentFiscalYear: IExercice,
    informations?: IInformation
}

interface IPaymentStatus {
    status: number
}

export const ViewTax = ({ match, motifs, tarifs, currentFiscalYear, informations }: IViewTax) => {
    const entrepriseID = match.params.id
    const [entreprise, setEntreprise] = useState<Entreprise | null>(null)
    const [viewPubModal, setViewPubModal] = useState<{ show: boolean, publicite: IPublicite }>({ show: false, publicite: {} as IPublicite })
    const [individualPrint, setIndiviualPrint] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            try {
                const entreprise = await apiFetch(`/entreprises/id/${entrepriseID}`)
                setEntreprise(entreprise)
                setTimeout(() => setLoader(false), 300)
            } catch (e: any) {

            }

        })()
    }, [])

    const PaymentStatus = ({ status }: IPaymentStatus) => {
        if (status === 0) {
            return <Badge bg="danger">Impayé</Badge>
        } else if (status === 1) {
            return <Badge bg="warning">Partiellement payé</Badge>
        } else if (status === 2) {
            return <Badge bg="success">Payé</Badge>
        } else {
            return <Badge></Badge>
        }
    }

    return <>
        {(loader === false && entreprise !== null) &&
            <IndividualPrint
                show={individualPrint}
                handleClose={() => setIndiviualPrint(false)}
                tax={entreprise}
                tarifs={tarifs}
                currentFiscalYear={currentFiscalYear}
                informations={informations}
                motifs={motifs}
            />
        }
        <ViewAdvertisingModal
            data={viewPubModal}
            handleClose={() => setViewPubModal(pub => ({ ...pub, show: false }))}
        />
        <Container fluid="xl">
            <div className="mt-3">
                <nav aria-label="breadcrumb" className="mt-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Consulter une entreprise</li>
                    </ol>
                </nav>
                <div className="d-flex mt-2 justify-content-between align-items-center">
                    <h4 className="mt-0">Consulter les informations d'une entreprise {entreprise !== null && <>(<span className="fw-bold">{entreprise.nom}</span>)</>}</h4>
                    {(loader === false && entreprise !== null) && <Button variant="outline-primary" className="me-4" size="sm" onClick={() => setIndiviualPrint(true)}><Printer /> Impression individuelle</Button>}
                </div>
                <hr className="my-3" />
            </div>
            {(loader === false && entreprise !== null) ? <>
                <div className="d-flex justify-content-between mb-3">
                <div><h3>Déclaration <Badge bg={entreprise.recu ? 'success' : 'danger'}>{entreprise.recu ? "Reçue" : "Non reçue"}</Badge></h3></div>
                <div><h3>Statut du paiement de la taxe <PaymentStatus status={entreprise.statut_paiement}/></h3></div>
                </div>
                <Row>
                    <Col><div>Matricule Ciger : <span className="fw-bold">{entreprise.matricule_ciger}</span></div></Col>
                    <Col><div>Procès-verbal : <span className="fw-bold">{entreprise.proces_verbal ? "Oui" : "Non"}</span></div></Col>
                    <Col><div>Province : <span className="fw-bold">{entreprise.province ? "Oui" : "Non"}</span></div></Col>
                    <Col><div>Langue : <span className="fw-bold">{entreprise.role_linguistique === 1 ? "Français" : "Néerlandais"}</span></div></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div>Nom : <span className="fw-bold">{entreprise.nom}</span></div></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div>Code rue : <span className="fw-bold">{entreprise.code_rue}</span></div></Col>
                    <Col><div>Rue : <span className="fw-bold">{entreprise.adresse_rue}</span></div></Col>
                    <Col><div>Numéro : <span className="fw-bold">{entreprise.adresse_numero}</span></div></Col>
                    <Col><div>Index : <span className="fw-bold">{entreprise.adresse_index}</span></div></Col>
                    <Col><div>Boite : <span className="fw-bold">{entreprise.adresse_boite}</span></div></Col>
                    <Col><div>Numéro : <span className="fw-bold">{entreprise.adresse_numero}</span></div></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div>Code postal : <span className="fw-bold">{entreprise.code_postal.cp}</span></div></Col>
                    <Col><div>Localité : <span className="fw-bold">{entreprise.code_postal.localite}</span></div></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div>Téléphone : <span className="fw-bold">{entreprise.numero_telephone}</span></div></Col>
                    <Col><div>Fax : <span className="fw-bold">{entreprise.numero_fax}</span></div></Col>
                    <Col><div>Personne de contact : <span className="fw-bold">{entreprise.personne_contact}</span></div></Col>
                    <Col><div>Téléphone : <span className="fw-bold">{entreprise.telephone_contact}</span></div></Col>
                    <Col><div>Adresse e-mail : <span className="fw-bold">{entreprise.mail_contact}</span></div></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div>Numéro de TVA : <span className="fw-bold">{entreprise.numero_tva}</span></div></Col>
                    <Col><div>% majoration : <span className="fw-bold">{entreprise.pourcentage_majoration}</span></div></Col>
                    <Col><div>Motif majoration : <span className="fw-bold">{motifs.find((motif: IMotif_majoration) => motif.id_motif == entreprise.motif_majorationId)?.libelle}</span></div></Col>
                </Row >
                <div className="mt-3">Commentaire : <span className="fw-bold">{entreprise.commentaire_taxation}</span></div>
                <Card className="mt-3">
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
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>Exercice</th>
                            <th>Code postal</th>
                            <th>Code rue</th>
                            <th>Rue</th>
                            <th>Numéro</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entreprise.publicites.map((pub: IPublicite) => {
                            return <tr key={pub.matricule_ciger}>
                                <td>{pub.exercice_courant}</td>
                                <td>{pub.rue.code_postal.cp}</td>
                                <td>{pub.rue.code_rue}</td>
                                <td>{pub.rue.nom_rue}</td>
                                <td>{pub.adresse_numero}</td>
                                <td><Button size="sm" variant="info" onClick={() => setViewPubModal({ show: true, publicite: pub })}>Consulter</Button></td>
                            </tr>
                        })}
                        <tr><td colSpan={6} className="text-end">Taxe totale (hors majoration) : <span className="fw-bold">{entreprise.publicites.reduce((acc: any, curr: any) => acc + parseFloat(curr.taxe_totale), 0)} €</span></td></tr>
                    </tbody>
                </Table>
            </> : <Loader />}
        </Container>
    </>
}
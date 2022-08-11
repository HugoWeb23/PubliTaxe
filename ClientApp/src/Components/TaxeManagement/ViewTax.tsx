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
import { Link } from 'react-router-dom'
import { Loader } from "../UI/Loader"
import { IPublicite } from "../../Types/IPublicite"
import { ViewAdvertisingModal } from "./ViewAdvertisingModal"
import { IMotif_majoration } from "../../Types/IMotif_majoration"
import { IExercice } from "../../Types/IExercice"
import { IInformation } from "../../Types/IInformations"
import { IndividualPrint } from "./IndividualPrint"
import { Printer } from "../UI/Printer"
import { OffensesModal } from "./OffensesModal"

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
    const [offensesModal, setOffensesModal] = useState<boolean>(false)
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
        } else if (status === 3) {
            return <Badge bg="primary">Rien à payer</Badge>
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
        {entreprise !== null && <OffensesModal 
        id_entreprise={entreprise.id_entreprise} 
        motifs={motifs} 
        currentFiscalYear={currentFiscalYear} 
        isOpen={offensesModal} 
        deletable={false} 
        handleClose={() => setOffensesModal(false)} 
        onDelete={() => {}} />}
        <Container fluid="xl">
            <div className="mt-3">
                <nav aria-label="breadcrumb" className="mt-3">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Consulter une entreprise</li>
                    </ol>
                </nav>
                <div className="d-flex mt-2 justify-content-between align-items-center">
                    <div className="mt-0"><span className="fs-4">Consulter les informations d'une entreprise {entreprise !== null && <>(<span className="fw-bold">{entreprise.nom}</span>) {entreprise.suppression && <>- <span className="fw-bold text-danger fs-6">Suppression programmée</span></>}</>}</span></div>
                    {(loader === false && entreprise !== null) && <Button variant="outline-primary" size="sm" onClick={() => setIndiviualPrint(true)}><Printer /> Impression individuelle</Button>}
                </div>
                <hr className="my-3" />
            </div>
            {(loader === false && entreprise !== null) ? <>
                <div className="d-flex justify-content-between mb-3">
                    <div><h5>Déclaration <Badge bg={entreprise.proces_verbal ? 'dark' : entreprise.recu ? 'success' : 'danger'}>{entreprise.proces_verbal ? "Procès-verbal" : entreprise.recu ? "Reçue" : "Non reçue"}</Badge></h5></div>
                    <div><h5>Paiement de la taxe <PaymentStatus status={entreprise.statut_paiement} /></h5></div>
                </div>
                <Row>
                    <Col><div className="fw-bold">Matricule</div><span className="d-block">{entreprise.matricule_ciger}</span></Col>
                    <Col><div className="fw-bold">Désactivée</div><span className="d-block">{entreprise.desactive ? "Oui" : "Non"}</span></Col>
                    <Col><div className="fw-bold">Procès-verbal</div><span className="d-block">{entreprise.proces_verbal ? "Oui" : "Non"}</span></Col>
                    <Col><div className="fw-bold">Langue</div><span className="d-block">{entreprise.role_linguistique === 1 ? "Français" : "Néerlandais"}</span></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div className="fw-bold">Nom</div><span className="d-block">{entreprise.nom}</span></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div className="fw-bold">Code rue</div><span className="d-block">{entreprise.code_rue}</span></Col>
                    <Col><div className="fw-bold">Rue</div><span className="d-block">{entreprise.adresse_rue}</span></Col>
                    <Col><div className="fw-bold">Numéro</div><span className="d-block">{entreprise.adresse_numero}</span></Col>
                    <Col><div className="fw-bold">Index</div><span className={`d-block ${(entreprise.adresse_index.length == 0 || entreprise.adresse_index == '0') && 'fw-light'}`}>{(entreprise.adresse_index.length > 0 && entreprise.adresse_index != '0') ? entreprise.adresse_index : "(Pas d'index)"}</span></Col>
                    <Col><div className="fw-bold">Boite</div><span className={`d-block ${entreprise.adresse_boite == 0 && 'fw-light'}`}>{entreprise.adresse_boite > 0 ? entreprise.adresse_boite : "(Pas de boite)"}</span></Col>
                    <Col><div className="fw-bold">Numéro</div><span className="d-block">{entreprise.adresse_numero}</span></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div className="fw-bold">Code postal</div><span className="d-block">{entreprise.code_postal.cp}</span></Col>
                    <Col><div className="fw-bold">Localité</div><span className="d-block">{entreprise.code_postal.localite}</span></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div className="fw-bold">Téléphone</div><span className="d-block">{entreprise.numero_telephone}</span></Col>
                    <Col><div className="fw-bold">Fax</div><span className={`d-block ${entreprise.numero_fax.length === 0 && 'fw-light'}`}>{entreprise.numero_fax.length > 0 ? entreprise.numero_fax : "(Pas de fax)"}</span></Col>
                    <Col><div className="fw-bold">Personne de contact</div><span className="d-block">{entreprise.personne_contact}</span></Col>
                    <Col><div className="fw-bold">Téléphone</div><span className="d-block">{entreprise.telephone_contact}</span></Col>
                    <Col><div className="fw-bold">Adresse e-mail</div><span className="d-block">{entreprise.mail_contact}</span></Col>
                </Row>
                <Row className="mt-3">
                    <Col><div className="fw-bold">Numéro de TVA</div><span className="d-block">{entreprise.numero_tva}</span></Col>
                    <Col><div className="fw-bold">% majoration</div><span className="d-block">{entreprise.pourcentage_majoration + ' %'}</span></Col>
                    <Col><div className="fw-bold">Motif majoration</div><span className={`d-block ${motifs.find((motif: IMotif_majoration) => motif.id_motif == entreprise.motif_majorationId) === undefined && 'fw-light'}`}>{motifs.find((motif: IMotif_majoration) => motif.id_motif == entreprise.motif_majorationId) !== undefined ? motifs.find((motif: IMotif_majoration) => motif.id_motif == entreprise.motif_majorationId)?.libelle : '(Aucun motif)'}</span></Col>
                </Row >
                <Row className="mt-3">
                <Col><div className="fw-bold">Commentaire</div><span className={`d-block ${entreprise.commentaire_taxation.length === 0 && 'fw-light'}`}>{entreprise.commentaire_taxation.length > 0 ? entreprise.commentaire_taxation : '(Aucun commentaire)'}</span></Col>
                <Col><div className="fw-bold">Infractions</div><div className="link" onClick={() => setOffensesModal(true)}>Voir l'historique des infractions</div></Col>
                </Row>
                <Card className="mt-3">
                    <Card.Header as="h6">Adresse de taxation</Card.Header>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col>
                                <div className="fw-bold">Code rue taxation</div><span className={`d-block ${(entreprise.code_rue_taxation.length == 0 || entreprise.code_rue_taxation == '0') && 'fw-light'}`}>{(entreprise.code_rue_taxation.length != 0 && entreprise.code_rue_taxation != '0') ? entreprise.code_rue_taxation : "(Pas de code rue)"}</span>
                            </Col>
                            <Col>
                                <div className="fw-bold">Adresse taxation</div><span className={`d-block ${(entreprise.adresse_taxation.length == 0 || entreprise.adresse_taxation == '0') && 'fw-light'}`}>{(entreprise.adresse_taxation.length != 0 && entreprise.adresse_taxation != '0') ? entreprise.adresse_taxation : "(Pas d'adresse)"}</span>
                            </Col>
                            <Col>
                                <div className="fw-bold">Numéro</div><span className={`d-block ${(entreprise.adresse_numero_taxation.length == 0 || entreprise.adresse_numero_taxation == '0') && 'fw-light'}`}>{(entreprise.adresse_numero_taxation.length != 0 && entreprise.adresse_numero_taxation != '0') ? entreprise.adresse_numero_taxation : "(Pas de numéro)"}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="fw-bold">Index</div><span className={`d-block ${(entreprise.adresse_index_taxation.length == 0 || entreprise.adresse_index_taxation == '0') && 'fw-light'}`}>{(entreprise.adresse_index_taxation.length != 0 && entreprise.adresse_index_taxation != '0') ? entreprise.adresse_index_taxation : "(Pas d'index)"}</span>
                            </Col>
                            <Col>
                            <div className="fw-bold">Boite</div><span className={`d-block ${(entreprise.adresse_boite_taxation.length == 0 || entreprise.adresse_boite_taxation == '0') && 'fw-light'}`}>{(entreprise.adresse_boite_taxation.length != 0 && entreprise.adresse_boite_taxation != '0') ? entreprise.adresse_boite_taxation : "(Pas de boite)"}</span>
                            </Col>
                            <Col>
                                <div className="fw-bold">Code postal</div><span className={`d-block ${(entreprise.adresse_code_postal_taxation.length == 0 || entreprise.adresse_code_postal_taxation == '0') && 'fw-light'}`}>{(entreprise.adresse_code_postal_taxation.length != 0 && entreprise.adresse_code_postal_taxation != '0') ? entreprise.adresse_code_postal_taxation : "(Pas de code postal)"}</span>
                            </Col>
                            <Col>
                                <div className="fw-bold">Localité</div><span className={`d-block ${(entreprise.adresse_localite_taxation.length == 0 || entreprise.adresse_localite_taxation == '0') && 'fw-light'}`}>{(entreprise.adresse_localite_taxation.length != 0 && entreprise.adresse_localite_taxation != '0') ? entreprise.adresse_localite_taxation : "(Pas de localité)"}</span>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Table striped bordered hover size="sm" className="mt-3">
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
                        {entreprise.publicites.length === 0 && <tr><td colSpan={6}>Aucune publicité</td></tr>}
                        {entreprise.publicites.map((pub: IPublicite) => {
                            return <tr key={pub.matricule_ciger}>
                                <td>{pub.exercice_courant}</td>
                                <td>{pub.rue.code_postal.cp}</td>
                                <td>{pub.rue.code_rue}</td>
                                <td>{pub.rue.nom_rue}</td>
                                <td>{pub.adresse_numero}</td>
                                <td><Button size="sm" variant="secondary" onClick={() => setViewPubModal({ show: true, publicite: pub })}>Consulter</Button></td>
                            </tr>
                        })}
                        <tr><td colSpan={6} className="text-end">Taxe totale (hors majoration) : <span className="fw-bold">{entreprise.publicites.reduce((acc: any, curr: any) => acc + parseFloat(curr.taxe_totale), 0).toFixed(2)} €</span></td></tr>
                    </tbody>
                </Table>
            </> : <Loader />}
        </Container>
    </>
}
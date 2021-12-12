import { useEffect, useState } from 'react'
import {
    Modal,
    Button,
    Form,
    Row,
    Col,
    Card
} from 'react-bootstrap'
import { apiFetch } from '../../../Services/apiFetch'
import { IApercu_entreprise } from '../../../Types/IApercu_entreprise'
import { Entreprise } from '../../../Types/IEntreprise'
import { IMotif_majoration } from '../../../Types/IMotif_majoration'
import { Loader } from '../../UI/Loader'


interface INotReceivedModal {
    element: { entrepriseInfos: IApercu_entreprise, show: boolean },
    motifs: IMotif_majoration[]
    handleClose: () => void
}

export const NotReceivedModal = ({ element, motifs, handleClose }: INotReceivedModal) => {

    const [entreprise, setEntreprise] = useState<Entreprise>({} as Entreprise)
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            if (element.entrepriseInfos.matricule_ciger !== entreprise.matricule_ciger) {
                setLoader(true)
                const fetch = await apiFetch(`/entreprises/id/${element.entrepriseInfos.matricule_ciger}`)
                setEntreprise(fetch)
                setTimeout(() => setLoader(false), 300)
            }
        })()
    }, [element])

    return <>
        <Modal show={element.show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Encoder un non reçu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loader ? <Loader /> :
                    <>
                        <Card>
                            <Card.Header as="h6">Informations sur l'entreprise</Card.Header>
                            <Card.Body>
                               <Row>
                                   <Col>
                                   <div>Matricule : {entreprise.matricule_ciger}</div>
                                   <div>Nom : {entreprise.nom}</div>
                                   <div>Tél. : {entreprise.numero_telephone}</div>
                                   <div>Personne de contact : {entreprise.personne_contact}</div>
                                   <div>Adresse e-mail : {entreprise.mail_contact}</div>
                                   </Col>
                                   <Col>
                                        <div>{entreprise.adresse_rue}, {entreprise.adresse_numero}</div>
                                        <div>{entreprise.code_postal.cp}</div>
                                        <div>{entreprise.code_postal.localite}</div>
                                        <div>{entreprise.code_postal.pays.nom_pays}</div>
                                   </Col>
                               </Row>
                            </Card.Body>
                        </Card>
                        <Row className="mt-2">
                            <Col>
                                <Form.Group controlId="pourcentage_majoration">
                                    <Form.Label column="sm">Pourcentage majoration</Form.Label>
                                    <Form.Select size="sm">
                                        <option value="10">10 %</option>
                                        <option value="50">50 %</option>
                                        <option value="100">100 %</option>
                                        <option value="200">200 %</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="motif_majoration" className="mt-1">
                                    <Form.Label column="sm">Motif de la majoration</Form.Label>
                                    <Form.Select size="sm">
                                        {motifs.map((motif: IMotif_majoration) => <option value={motif.id_motif}>{motif.libelle}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="remarque">
                            <Form.Label column="sm">Remarque éventuelle</Form.Label>
                            <Form.Control as="textarea" size="sm" placeholder="Remarque éventuelle pour la taxation d'office" />
                        </Form.Group>
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Valider
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}
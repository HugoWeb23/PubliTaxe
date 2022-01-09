import { useEffect, useState, useRef } from 'react'
import {
    Modal,
    Button,
    Form,
    Row,
    Col,
    Card,
    Table
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { ApiErrors, apiFetch } from '../../../Services/apiFetch'
import { IApercu_entreprise } from '../../../Types/IApercu_entreprise'
import { Entreprise } from '../../../Types/IEntreprise'
import { IMotif_majoration } from '../../../Types/IMotif_majoration'
import { INotReceived } from '../../../Types/INotReceived'
import { Loader } from '../../UI/Loader'
import { yupResolver } from '@hookform/resolvers/yup';
import { EncodeNotReceivedSchema } from '../../../Validation/NotReceived/EncodeNotReceivedSchema'
import { INotReceivedHistory } from '../../../Types/INotReceivedHistory'
import { SumIncrease } from '../../../Services/SumIncrease'
import { IExercice } from '../../../Types/IExercice'
import { toast } from 'react-toastify'


interface INotReceivedModal {
    element: { entrepriseInfos: IApercu_entreprise, show: boolean },
    motifs: IMotif_majoration[],
    currentFiscalYear: IExercice,
    handleClose: () => void,
    onSubmit: (data: INotReceived) => void
}

export const NotReceivedModal = ({ element, motifs, currentFiscalYear, handleClose, onSubmit }: INotReceivedModal) => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(EncodeNotReceivedSchema) })
    const [entreprise, setEntreprise] = useState<Entreprise>({} as Entreprise)
    const [history, setHistory] = useState<INotReceivedHistory[]>([])
    const [sumIncrease, setSumIncrease] = useState<number>()
    const [loader, setLoader] = useState<boolean>(false)
   const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            if (element.entrepriseInfos.matricule_ciger !== undefined) {
                try {
                    setError(false)
                    const history = await apiFetch(`/notreceived/gethistory/${element.entrepriseInfos.matricule_ciger}`)
                    setHistory(history)
                    const sum = await SumIncrease(history, currentFiscalYear)
                    setSumIncrease(sum)
                    setValue('pourcentage_majoration', sum)
                    if (element.entrepriseInfos.matricule_ciger !== entreprise.matricule_ciger) {
                        setLoader(true)
                        const fetch = await apiFetch(`/entreprises/id/${element.entrepriseInfos.matricule_ciger}`)
                        setEntreprise(fetch)
                        setValue('matricule_ciger', fetch.matricule_ciger)
                        setTimeout(() => setLoader(false), 300)
                    }
                } catch (e: any) {
                    if (e instanceof ApiErrors) {
                        toast.error(e.singleError.error)
                        setError(true)
                    }
                }

            }
        })()
    }, [element.entrepriseInfos])

    const OnFormSubmit = (data: any) => {
        onSubmit(data)
    }

    return <>
        <Modal show={element.show} onHide={handleClose} size="xl" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>Encoder un non reçu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loader || Object.keys(entreprise).length == 0 || error ? <Loader /> :
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
                                    <Form.Select size="sm" isInvalid={errors.pourcentage_majoration} {...register('pourcentage_majoration')}>
                                        <option value="10" style={{ background: sumIncrease === 10 ? "#198754" : "" }}>10 %</option>
                                        <option value="50" style={{ background: sumIncrease === 50 ? "#198754" : "" }}>50 %</option>
                                        <option value="100" style={{ background: sumIncrease === 100 ? "#198754" : "" }}>100 %</option>
                                        <option value="200" style={{ background: sumIncrease === 200 ? "#198754" : "" }}>200 %</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Ce pourcentage de majoration est proposé automatiquement (surligné en vert dans la liste déroulante) en fonction
                                        des infractions précédentes.
                                    </Form.Text>
                                    {errors.pourcentage_majoration && <Form.Control.Feedback type="invalid">{errors.pourcentage_majoration.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="motif_majoration">
                                    <Form.Label column="sm">Motif de la majoration</Form.Label>
                                    <Form.Select size="sm" isInvalid={errors.motif_majorationId} {...register('motif_majorationId')}>
                                        {motifs.map((motif: IMotif_majoration) => <option value={motif.id_motif}>{motif.libelle}</option>)}
                                    </Form.Select>
                                    {errors.motif_majorationId && <Form.Control.Feedback type="invalid">{errors.motif_majorationId.message}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="remarque" className="mt-1">
                            <Form.Label column="sm">Remarque éventuelle</Form.Label>
                            <Form.Control as="textarea" size="sm" placeholder="Remarque éventuelle pour la taxation d'office" {...register('remarque')} />
                        </Form.Group>
                        <p className="fw-normal mt-3 mb-3">Historique des non reçus sur les 5 dernières années</p>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Exercice</th>
                                    <th>Motif</th>
                                    <th>% Major.</th>
                                    <th>Remarque</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(loader === false && history.length === 0) && <td colSpan={5}>Aucun résultat</td>}
                                {history.map((history: INotReceivedHistory, index: number) => {
                                    return <tr key={index}>
                                        <td>{history.exercice}</td>
                                        <td>{motifs.find((motif: IMotif_majoration) => motif.id_motif == history.motif_majorationId)?.libelle}</td>
                                        <td>{history.pourcentage_majoration} %</td>
                                        <td>{history.remarque}</td>
                                        <td>{history.date}</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annuler
                </Button>
                <Button variant="danger" onClick={handleSubmit(OnFormSubmit)} disabled={loader}>
                    Valider
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}
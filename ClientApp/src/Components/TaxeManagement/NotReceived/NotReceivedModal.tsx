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

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>({ resolver: yupResolver(EncodeNotReceivedSchema), defaultValues: {pv: true} })
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
                    const history = await apiFetch(`/notreceived/gethistory/${element.entrepriseInfos.id_entreprise}`)
                    setHistory(history)
                    const sum = await SumIncrease(history, currentFiscalYear)
                    setSumIncrease(sum)
                    setValue('pourcentage_majoration', sum)
                    if (element.entrepriseInfos.id_entreprise !== entreprise.id_entreprise) {
                        setLoader(true)
                        const fetch = await apiFetch(`/entreprises/id/${element.entrepriseInfos.id_entreprise}`)
                        setEntreprise(fetch)
                        setValue('id_entreprise', fetch.id_entreprise)
                        setTimeout(() => setLoader(false), 100)
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

    const onModalClose = () => {
        setEntreprise({} as Entreprise)
        handleClose()
    }

    return <>
        <Modal show={element.show} onHide={() => onModalClose()} size="xl" animation={false}>
            <Modal.Header closeButton>
                <Modal.Title as="h5">Encoder un non reçu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loader || Object.keys(entreprise).length == 0 || error ? <Loader /> :
                    <>
                        <Card>
                            <Card.Header as="h6">Informations sur l'entreprise</Card.Header>
                            <Card.Body style={{padding: "0.5rem 0.5rem"}}>
                                <Row>
                                    <Col>
                                        <div>ID : {entreprise.id_entreprise}</div>
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
                                        <option value="10">10 %</option>
                                        <option value="50">50 %</option>
                                        <option value="100">100 %</option>
                                        <option value="200">200 %</option>
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        Pourcentage recommandé : <span className="fw-bold">{sumIncrease} %</span>.
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
                            <Col>
                                <Form.Group controlId="pv">
                                    <Form.Label column="sm">Procès-verbal</Form.Label>
                                    <Form.Check type="checkbox" disabled {...register('pv')} />
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
                <Button variant="secondary" size="sm" onClick={() => onModalClose()}>
                    Annuler
                </Button>
                <Button variant="danger" size="sm" onClick={handleSubmit(OnFormSubmit)} disabled={loader}>
                    Valider
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}
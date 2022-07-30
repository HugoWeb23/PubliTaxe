import { useState, useEffect } from 'react'
import {
    Container,
    Card,
    Form,
    Button,
    Alert,
    Table
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IExercice } from '../../../Types/IExercice'
import { ApiErrors, apiFetch } from '../../../Services/apiFetch'
import { Link, useHistory } from "react-router-dom"
import { PlusIcon } from '../../UI/PlusIcon'
import { ConfirmModal } from '../../UI/ConfirmModal'
import { toast } from 'react-toastify'
import { ChangeFiscalYearFormSchema } from '../../../Validation/ChangeFiscalYear/ChangeFiscalYearFormSchema'
import { useChangeFiscalYear } from '../../Hooks/ChangeFiscalYearHook'
import { IApercu_entreprise } from '../../../Types/IApercu_entreprise'
import { ElementsPerPage } from '../../../Services/ElementsPerPage'
import { Paginate } from '../../../Services/Paginate'
import { Loader as SmallLoader } from 'react-bootstrap-typeahead'
import { CustomLoader } from '../../UI/CustomLoader'

interface IChangeFiscalYear {
    currentFiscalYear: IExercice,
    handleChange: (daya: any) => void
}

export const ChangeFiscalYear = ({ currentFiscalYear, handleChange }: IChangeFiscalYear) => {
    const [allYears, setAllYears] = useState<IExercice[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [confirmModal, setConfirmModal] = useState<boolean>(false)
    const [filterOptions, setFilterOptions] = useState<any>({ elementsParPage: 15, pageCourante: 1 })
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const [optionsLoader, setOptionsLoader] = useState<boolean>(false)
    const { entreprises, totalPages, elementsParPage, pageCourante, getAll, deleteOne, clearAll } = useChangeFiscalYear()
    const { register, formState: { errors } } = useForm({ resolver: yupResolver(ChangeFiscalYearFormSchema) })
    const nextYear: IExercice | undefined = allYears.find((year: IExercice) => currentFiscalYear.annee_exercice + 1 == year.annee_exercice)
    const history = useHistory()

    useEffect(() => {
        (async () => {
            try {
                setOptionsLoader(true)
                await getAll(filterOptions)
                const years: IExercice[] = await apiFetch('/fiscalyears/all/')
                const currentYear = new Date().getFullYear()
                setAllYears(years.filter((year: IExercice) => year.annee_exercice >= currentYear))
                setOptionsLoader(false)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [filterOptions])

    const ChangeYear = async () => {
        try {
            if (nextYear === undefined) {
                toast.error(`L'exercice ${currentFiscalYear.annee_exercice + 1} n'existe pas`)
                return;
            }
            const newFiscalYear: IExercice = await apiFetch(`/fiscalyears/changecurrentfiscalyear/${nextYear.id}`)
            handleChange(newFiscalYear)
            toast.success(`Passage à l'exercice ${newFiscalYear.annee_exercice} effectué avec succès`)
            await clearAll()
            history.push('/business_management')
        } catch (e) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
        setConfirmModal(false)
    }

    const CancelDeletionRequest = async (id_entreprise: number) => {
        try {
            await apiFetch(`/entreprises/canceldelete/${id_entreprise}`, {
                method: 'PUT'
            })
            await deleteOne(id_entreprise)
            toast.success('La demande de suppression a été annulée')
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    if (loader || Object.keys(currentFiscalYear ? currentFiscalYear : []).length === 0) {
        return <CustomLoader />
    }
    return <>
        <ConfirmModal
            show={confirmModal}
            onConfirm={ChangeYear}
            onClose={() => setConfirmModal(false)}
            size="lg"
            bodyText="Vous êtes sur le point de changer d'exercice courant et de supprimer les entreprises en attente de suppression, voulez-vous continuer ?"
            confirmButtonText="Oui"
            confirmButtonVariant="success"
            leaveButtonText="Non"
            leaveButtonVariant="danger"
        />
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Changement d'exercice</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                <h2 className="mb-0">Changement d'exercice</h2>
                <Link to="/tools/managefiscalyears" className="link"><PlusIcon /> Créer un exercice</Link>
            </div>
            <p>Le changement d'exercice remet à zéro les champs "reçu", "procès-verbal" et "pourcentage majoration". Les entreprises en attente de suppression seront également supprimées.</p>
            <hr className="my-3" />
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            <Card className="mb-3" body>
                <div className="fw-bold mb-2">Ces entreprises vont être supprimées lors du changement d'exercice</div>
                {(entreprises.length === 0 && loader === false) && <div className="bd-callout bd-callout-mini bd-callout-danger">
                    <span style={{ fontSize: "1.1rem" }}>Aucune entreprise n'est en attente de suppression</span>
                </div>}
                {entreprises.length > 0 && <Table striped bordered hover size="sm">
                    <thead>
                        <th>ID</th>
                        <th>Matricule</th>
                        <th>Nom</th>
                        <th>Panneaux</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {entreprises.length > 0 && entreprises.map((ent: IApercu_entreprise) => {
                            return <>
                                <tr>
                                    <td>{ent.id_entreprise}</td>
                                    <td>{ent.matricule_ciger}</td>
                                    <td>{ent.nom}</td>
                                    <td>{ent.nombre_panneaux}</td>
                                    <td><Button size="sm" variant="secondary" onClick={() => CancelDeletionRequest(ent.id_entreprise)}>Annuler la suppression</Button></td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </Table>}
                {entreprises.length > 0 && <div className="d-flex justify-content-end align-items-center">
                    {optionsLoader && <div className="me-2"><SmallLoader /></div>}
                    <div className="me-2">
                        <ElementsPerPage
                            elementsPerPage={elementsParPage}
                            onChange={(elements) => setFilterOptions((filters: any) => ({ ...filters, elementsParPage: elements }))}
                        />
                    </div>
                    <Paginate
                        totalPages={totalPages}
                        pageCourante={pageCourante}
                        pageChange={(page) => setFilterOptions((filters: any) => ({ ...filters, pageCourante: page }))}
                    />
                </div>}
            </Card>
            <Card body>
                <Form>
                    <span className="d-block fs-5 mb-1">Détails de l'exercice suivant</span>
                    {nextYear !== undefined && <>
                        <div>Année d'exercice : <span className="fw-bold">{nextYear.annee_exercice}</span></div>
                        <div>Remise des déclarations avant le : {new Date(nextYear.date_echeance).toLocaleDateString('fr-FR')}</div>
                        <div>Paiement de la taxe avant le : {new Date(nextYear.date_reglement_taxe).toLocaleDateString('fr-FR')}</div>
                    </>}
                    {nextYear === undefined && <span className="d-block text-danger">L'exercice {currentFiscalYear.annee_exercice + 1} n'existe pas, veuillez le créer en <Link to="/tools/managefiscalyears">cliquant ici</Link></span>}
                    <Form.Group controlId="confirm_delete" className="mt-2">
                        <Form.Check
                            type="checkbox"
                            isInvalid={errors.confirm_delete}
                            label="Je confirme avoir pris connaissance des entreprises qui seront supprimées"
                            feedback={errors.confirm_delete && errors.confirm_delete.message}
                            feedbackType="invalid"
                            {...register('confirm_delete')}
                        />
                        {errors.confirm_delete && <Form.Control.Feedback type="invalid">{errors.confirm_delete.message}</Form.Control.Feedback>}
                    </Form.Group>
                    <div className="mt-3">
                        <Button variant="danger" size="sm" disabled={nextYear === undefined} onClick={() => setConfirmModal(true)}>
                            Changer d'exercice
                        </Button>
                    </div>

                </Form>
            </Card>
        </Container>
    </>
}
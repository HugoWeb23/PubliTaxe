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
import { Loader } from '../../UI/Loader'
import { Link } from "react-router-dom"
import { PlusIcon } from '../../UI/PlusIcon'
import { ConfirmModal } from '../../UI/ConfirmModal'
import { toast } from 'react-toastify'
import { ChangeFiscalYearFormSchema } from '../../../Validation/ChangeFiscalYear/ChangeFiscalYearFormSchema'
import { useChangeFiscalYear } from '../../Hooks/ChangeFiscalYearHook'
import { IApercu_entreprise } from '../../../Types/IApercu_entreprise'
import { ElementsPerPage } from '../../../Services/ElementsPerPage'
import { Paginate } from '../../../Services/Paginate'
import { Loader as SmallLoader } from 'react-bootstrap-typeahead'

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
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: yupResolver(ChangeFiscalYearFormSchema) })

    const defaultFiscalyearChecked = (allFiscalYears: IExercice[]): number => {
        if (allFiscalYears.length > 0) {
            const findNextYear: IExercice | undefined = allFiscalYears.find((fiscalYear: IExercice) => {
                const currentYear = new Date().getFullYear()
                // Sommes-nous au mois de janvier ?
                const currentMonthIsBeforeFebruary = new Date().getMonth() < 1
                // On retourne l'exercice de l'année actuelle si nous sommes au mois de janvier
                // On retourne l'exercice de l'année suivante si le mois actuel est supérieur à janvier
                return fiscalYear.annee_exercice == (currentMonthIsBeforeFebruary ? currentYear : currentYear + 1)
            })
            if (findNextYear !== undefined) {
                return findNextYear.id
            } else {
                // On retourne l'exercice le plus récent (le dernier dans le tableau) si aucun exercice n'est trouvé
                return allFiscalYears[allFiscalYears.length - 1].id
            }
        } else {
            return 0
        }
    }

    useEffect(() => {
        (async () => {
            try {
                setOptionsLoader(true)
                await getAll(filterOptions)
                const years: IExercice[] = await apiFetch('/fiscalyears/all/')
                setAllYears(years)
                setValue('id', defaultFiscalyearChecked(years))
                setOptionsLoader(false)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [filterOptions])

    const ChangeYear = async (data: any) => {
        try {
            const currentFiscalYear: IExercice = await apiFetch(`/fiscalyears/changecurrentfiscalyear/${data.id}`)
            handleChange(currentFiscalYear)

            toast.success(`Passage à l'exercice ${currentFiscalYear.annee_exercice} effectué avec succès`)
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
            await clearAll()
            toast.success('La demande de suppression a été annulée')
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    if (loader || Object.keys(currentFiscalYear ? currentFiscalYear : []).length === 0) {
        return <Loader />
    }
    return <>
        <ConfirmModal
            show={confirmModal}
            onConfirm={handleSubmit(ChangeYear)}
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
                    <span style={{fontSize: "1.1rem"}}>Aucune entreprise n'est en attente de suppression</span>
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
                    <Form.Group controlId="exercice">
                        <Form.Label column="sm">Exercice</Form.Label>
                        <Form.Select size="sm" isInvalid={errors.id} {...register('id')}>
                            {allYears.map((fiscalYear: IExercice) => {
                                return <option value={fiscalYear.id} disabled={fiscalYear.id === currentFiscalYear.id}>{fiscalYear.annee_exercice}</option>
                            })}
                        </Form.Select>
                        {errors.id && <Form.Control.Feedback type="invalid">{errors.id.message}</Form.Control.Feedback>}
                    </Form.Group>
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
                        <Button variant="danger" size="sm" onClick={() => setConfirmModal(true)}>
                            Changer d'exercice
                        </Button>
                    </div>

                </Form>
            </Card>
        </Container>
    </>
}
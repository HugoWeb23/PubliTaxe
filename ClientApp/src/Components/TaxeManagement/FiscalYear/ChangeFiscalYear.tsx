import { useState, useEffect } from 'react'
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button
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

interface IChangeFiscalYear {
    currentFiscalYear: IExercice,
    handleChange: (daya: any) => void
}

export const ChangeFiscalYear = ({ currentFiscalYear, handleChange }: IChangeFiscalYear) => {
    const [allYears, setAllYears] = useState<IExercice[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [confirmModal, setConfirmModal] = useState<boolean>(false)
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

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
            const years: IExercice[] = await apiFetch('/fiscalyears/all/')
            setAllYears(years)
            setValue('id', defaultFiscalyearChecked(years))
            setLoader(false)
        })()
    }, [])

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

    if (loader || Object.keys(currentFiscalYear ? currentFiscalYear : []).length === 0) {
        return <Loader />
    }
    return <>
        <ConfirmModal
            show={confirmModal}
            onConfirm={handleSubmit(ChangeYear)}
            onClose={() => setConfirmModal(false)}
            size="lg"
            bodyText="Vous êtes sur le point de changer d'exercice courant, voulez-vous continuer ?"
            confirmButtonText="Oui"
            confirmButtonVariant="success"
            leaveButtonText="Non"
            leaveButtonVariant="danger"
        />
        <Container fluid="sm">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mt-2 mb-3">Changement d'exercice</h2>
                <Link to="/tools/managefiscalyears" className="link"><PlusIcon /> Créer un exercice</Link>
            </div>
            <Card body>
                <Form>
                    <Form.Group controlId="exercice">
                        <Form.Label column="sm">Exercice</Form.Label>
                        <Form.Select size="sm" {...register('id')}>
                            {allYears.map((fiscalYear: IExercice) => {
                                return <option value={fiscalYear.id} disabled={fiscalYear.id === currentFiscalYear.id}>{fiscalYear.annee_exercice}</option>
                            })}
                        </Form.Select>
                        <div className="d-grid gap-2 mt-3">
                            <Button variant="danger" size="sm" onClick={() => setConfirmModal(true)}>
                                Changer d'exercice
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </Card>
        </Container>
    </>
}
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
import { apiFetch } from '../../../Services/apiFetch'
import { Loader } from '../../UI/Loader'
import { Link } from "react-router-dom"
import { PlusIcon } from '../../UI/PlusIcon'
import { ConfirmModal } from '../../UI/ConfirmModal'

interface IChangeFiscalYear {
    currentFiscalYear: IExercice,
    handleChange: (daya: any) => void
}

export const ChangeFiscalYear = ({ currentFiscalYear, handleChange }: IChangeFiscalYear) => {
    const [allYears, setAllYears] = useState<IExercice[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [confirmModal, setConfirmModal] = useState<boolean>(false)
    const { register, handleSubmit, formState: { errors } } = useForm()

    useEffect(() => {
        (async () => {
            const years: IExercice[] = await apiFetch('/fiscalyears/all/')
            setAllYears(years)
            setLoader(false)
        })()
    }, [])

    const ChangeYear = (data: any) => {
        alert(JSON.stringify(data))
        setConfirmModal(false)
    }

    if (loader || Object.keys(currentFiscalYear).length === 0) {
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
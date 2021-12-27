import { useEffect, useState } from "react"
import { useFiscalYears } from "../../Hooks/FiscalYearsHook"
import {
    Container,
    Table,
    Button,
    Alert
} from 'react-bootstrap'
import { IExercice } from "../../../Types/IExercice"
import { PlusIcon } from "../../UI/PlusIcon"
import { Pencil } from "../../UI/Pencil"
import { FiscalYearModal } from "./FiscalYearModal"
import { ApiErrors } from "../../../Services/apiFetch"
import { toast } from 'react-toastify';
import { Link } from "react-router-dom"

interface IManageFiscalyears {
    handleEdit: (fiscalYear: any) => void
}

export const ManageFiscalYears = ({ handleEdit }: IManageFiscalyears) => {
    const { fiscalYears, getAll, newFiscalYear, editFiscalYear } = useFiscalYears()
    const [selectedFiscalYear, setSelectedFiscalYear] = useState({ fiscalYear: {} as IExercice, show: false, type: 'create' })
    const [loader, setLoader] = useState<boolean>(true)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })

    useEffect(() => {
        (async () => {
            try {
                await getAll()
            } catch(e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setLoader(false)
        })()
    }, [])

    const handleSubmit = async ({ type, data }: any) => {
        try {
            if (type == 'create') {
                await newFiscalYear(data)
                toast.success("L'exercice a été créé")
            } else if (type == 'edit') {
                await editFiscalYear(data)
                handleEdit(data)
                toast.success("L'exercice a été modifié")
            }
        } catch (e) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    return <>
        <FiscalYearModal fiscalYear={selectedFiscalYear} onSubmit={handleSubmit} handleClose={() => setSelectedFiscalYear(element => ({ ...element, show: false, type: 'create' }))} />
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des exercices</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                <h2 className="mb-0">Gestion des exercices </h2>
                <div className="link" onClick={() => setSelectedFiscalYear(element => ({ ...element, show: true }))}><PlusIcon /> Nouvel exercice</div>
            </div>
            <hr className="my-3" />
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Exercice</th>
                        <th>Date d'échéance</th>
                        <th>Date de règlement</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {(loader === false && fiscalYears.length === 0) && <tr><td colSpan={4}>Aucun résultat</td></tr>}
                    {loader == false && fiscalYears.map((year: IExercice, index: number) => {
                        return <tr>
                            <td>{year.annee_exercice}</td>
                            <td>{new Date(year.date_echeance).toLocaleDateString('fr-FR')}</td>
                            <td>{new Date(year.date_reglement_taxe).toLocaleDateString('fr-FR')}</td>
                            <td><Button size="sm" onClick={() => setSelectedFiscalYear(element => ({ fiscalYear: year, show: true, type: 'edit' }))}><Pencil /></Button></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Container>
    </>
}
import { useEffect, useState } from "react"
import { useFiscalYears } from "../../Hooks/FiscalYearsHook"
import {
    Container,
    Table,
    Button
} from 'react-bootstrap'
import { IExercice } from "../../../Types/IExercice"
import { PlusIcon } from "../../UI/PlusIcon"
import { Pencil } from "../../UI/Pencil"
import { FiscalYearModal } from "./FiscalYearModal"
import { apiFetch } from "../../../Services/apiFetch"
import { toast } from 'react-toastify';

interface IManageFiscalyears {
    handleEdit: (fiscalYear: any) => void
}

export const ManageFiscalYears = ({handleEdit}: IManageFiscalyears) => {
    const { fiscalYears, getAll, newFiscalYear, editFiscalYear } = useFiscalYears()
    const [selectedFiscalYear, setSelectedFiscalYear] = useState({fiscalYear: {} as IExercice, show: false, type: 'create'})
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            await getAll()
            setLoader(false)
        })()
    }, [])

    const handleSubmit = async({type, data}: any) => {
        try {
            if(type == 'create') {
                await newFiscalYear(data)
                toast.success("L'exercice a été créé")
            } else if(type == 'edit') {
                await editFiscalYear(data)
                handleEdit(data)
                toast.success("L'exercice a été modifié")
            }
        } catch(e) {
            toast.error('Une erreur est survenue')
        }
    }

    return <>
        <FiscalYearModal fiscalYear={selectedFiscalYear} onSubmit={handleSubmit} handleClose={() => setSelectedFiscalYear(element => ({...element, show: false, type: 'create'}))}/>
        <Container fluid="sm">
            <div className="d-flex justify-content-between align-items-center">
            <h2 className="mt-2 mb-3">Gestion des exercices </h2>
            <div className="link" onClick={() => setSelectedFiscalYear(element => ({...element, show: true}))}><PlusIcon/> Nouvel exercice</div>
            </div>
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
                    {loader == false && fiscalYears.map((year: IExercice, index: number) => {
                        return <tr>
                            <td>{year.annee_exercice}</td>
                            <td>{new Date(year.date_echeance).toLocaleDateString('fr-FR')}</td>
                            <td>{new Date(year.date_reglement_taxe).toLocaleDateString('fr-FR')}</td>
                            <td><Button size="sm" onClick={() => setSelectedFiscalYear(element => ({fiscalYear: year, show: true, type: 'edit'}))}><Pencil/></Button></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </Container>
    </>
}
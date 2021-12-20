import { useEffect, useState } from "react"
import {
    Container,
    Table,
    Button
} from 'react-bootstrap'
import { Pencil } from "../UI/Pencil"
import { apiFetch } from "../../Services/apiFetch"
import { toast } from 'react-toastify';
import { IUser } from "../../Types/IUser";

interface IManageFiscalyears {
    handleEdit: (fiscalYear: any) => void
}

export const ManageUsers = ({handleEdit}: IManageFiscalyears) => {
    const [selectedFiscalYear, setSelectedFiscalYear] = useState({user: {} as IUser, show: false})
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
         
            setLoader(false)
        })()
    }, [])

    const handleSubmit = async({type, data}: any) => {
        try {
            
        } catch(e) {
            toast.error('Une erreur est survenue')
        }
    }

    return <>
        <Container fluid="sm">
            <div className="d-flex justify-content-between align-items-center">
            <h2 className="mt-2 mb-3">Gestion des utilisateurs</h2>
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
                    {/*
                    {loader == false && users.map((user: IUser, index: number) => <UserRow user={user}/>)}
                    */}
                </tbody>
            </Table>
        </Container>
    </>
}

interface IUserRow {
    user: IUser
}

const UserRow = ({user}: IUserRow) => {
    return <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
</tr>
}
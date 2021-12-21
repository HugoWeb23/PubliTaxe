import { useEffect, useState } from "react"
import {
    Container,
    Table,
    Button,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Pencil } from "../UI/Pencil"
import { apiFetch } from "../../Services/apiFetch"
import { toast } from 'react-toastify'
import { IUser } from "../../Types/IUser"
import { useAccounts } from "../Hooks/AccountsHook"
import { Trash } from "../UI/Trash"

interface IManageFiscalyears {
    handleEdit: (fiscalYear: any) => void
}

export const ManageUsers = ({ handleEdit }: IManageFiscalyears) => {
    const { accounts, getAllAccounts, editAccount } = useAccounts()
    const [selectedFiscalYear, setSelectedFiscalYear] = useState({ user: {} as IUser, show: false })
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            await getAllAccounts()
            setLoader(false)
        })()
    }, [])

    const handleSubmit = async ({ type, data }: any) => {
        try {

        } catch (e) {
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
                        <th>ID</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Adresse e-mail</th>
                        <th>Actif</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loader == false && accounts.map((user: IUser, index: number) => <UserRow user={user} />)}
                </tbody>
            </Table>
        </Container>
    </>
}

interface IUserRow {
    user: IUser
}

const UserRow = ({ user }: IUserRow) => {
    return <tr>
        <td>{user.id}</td>
        <td>{user.prenom}</td>
        <td>{user.nom}</td>
        <td>{user.mail}</td>
        <td>{user.actif ? "Oui" : "Non"}</td>
        <td><div className="d-flex">
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-1`}>
                        Éditer
                    </Tooltip>
                }
            >
                <Link className="me-1 btn btn-secondary btn-sm" to={{pathname: `/manageaccess/edit/${user.id}`, state: user}}><Pencil /></Link>
            </OverlayTrigger>
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-2`}>
                        Supprimer
                    </Tooltip>
                }
            >
                <Button size="sm" variant="danger"><Trash /></Button>
            </OverlayTrigger>
        </div></td>
    </tr>
}
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
import { ApiErrors, apiFetch } from "../../Services/apiFetch"
import { toast } from 'react-toastify'
import { IUser } from "../../Types/IUser"
import { useInactiveAccounts } from "../Hooks/InactiveAccountsHook"
import { Trash } from "../UI/Trash"
import { ConfirmModal } from "../UI/ConfirmModal"
import { Loader } from "../UI/Loader"

interface IManageFiscalyears {
    handleEdit: (fiscalYear: any) => void
}

export const ManageInactiveAccounts = ({ handleEdit }: IManageFiscalyears) => {
    const { accounts, getAllAccounts, deleteAccount, activateAccount } = useInactiveAccounts()
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, user: IUser }>({ show: false, user: {} as IUser })
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            await getAllAccounts()
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    const handleDeleteAccount = async (user: IUser) => {
        try {
            await deleteAccount(user)
            setDeleteModal(d => ({...d, show: false}))
            toast.success("Utilisateur supprimé")
        } catch (e) {
            toast.error('Une erreur est survenue')
        }
    }

    const handleActivateAccount = async(user: IUser) => {
        try {
            await activateAccount(user)
            toast.success("Le compte a été activé")
        } catch(e: any) {
            if(e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    return <>
        <ConfirmModal
            show={deleteModal.show}
            element={deleteModal.user}
            bodyText="Voulez-vous vraiment supprimer cet utilisateur ?"
            onClose={() => setDeleteModal(e => ({ ...e, show: false }))}
            onConfirm={handleDeleteAccount}
        />
        <Container fluid="sm">
            <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Utilisateurs en attente d'activation</li>
                </ol>
            </nav>
            <h2 className="mt-2">Utilisateurs en attente d'activation</h2>
            <hr className="my-3" />
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
                    {(loader === false && accounts.length === 0) && <tr><td colSpan={6}>Aucun résultat</td></tr>}
                    {loader === false ? accounts.map((user: IUser, index: number) => <UserRow
                        user={user}
                        onDelete={(user: IUser) => setDeleteModal({ show: true, user: user })}
                        onActivate={(user: IUser) => handleActivateAccount(user)}
                    />) : <Loader/>}
                </tbody>
            </Table>
        </Container>
    </>
}

interface IUserRow {
    user: IUser,
    onDelete: (user: IUser) => void,
    onActivate: (user: IUser) => void
}

const UserRow = ({ user, onDelete, onActivate }: IUserRow) => {
    return <tr>
        <td>{user.id}</td>
        <td>{user.prenom}</td>
        <td>{user.nom}</td>
        <td>{user.mail} {user.changement_pass === 1 && <span className="fs-6 text-danger fw-bold">(Changement de mot de passe en attente)</span>}</td>
        <td>{user.actif ? "Oui" : "Non"}</td>
        <td><div className="d-flex">
            <Button variant="success" size="sm" className="me-2" onClick={() => onActivate({...user, actif: 1})}>Activer</Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(user)}>Supprimer</Button>
        </div></td>
    </tr>
}
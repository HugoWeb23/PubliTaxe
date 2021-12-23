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
import { ConfirmModal } from "../UI/ConfirmModal"

interface IManageFiscalyears {
    handleEdit: (fiscalYear: any) => void
}

export const ManageUsers = ({ handleEdit }: IManageFiscalyears) => {
    const { accounts, getAllAccounts, deleteAccount } = useAccounts()
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, user: IUser }>({ show: false, user: {} as IUser })
    const [loader, setLoader] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            await getAllAccounts()
            setLoader(false)
        })()
    }, [])

    const handleDeleteAccount = async (user: IUser) => {
        try {
            await deleteAccount(user)
            toast.success("Utilisateur supprimé")
        } catch (e) {
            toast.error('Une erreur est survenue')
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
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="mt-3">Gestion des utilisateurs</h2>

            </div>
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
                    {loader == false && accounts.map((user: IUser, index: number) => <UserRow user={user} onDelete={(user: IUser) => setDeleteModal({ show: true, user: user })} />)}
                </tbody>
            </Table>
        </Container>
    </>
}

interface IUserRow {
    user: IUser,
    onDelete: (user: IUser) => void
}

const UserRow = ({ user, onDelete }: IUserRow) => {
    return <tr>
        <td>{user.id}</td>
        <td>{user.prenom}</td>
        <td>{user.nom}</td>
        <td>{user.mail} {user.changement_pass === 1 && <span className="fs-6 text-danger fw-bold">(Changement de mot de passe en attente)</span>}</td>
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
                <Link className="me-1 btn btn-secondary btn-sm" to={{ pathname: `/manageaccess/edit/${user.id}`, state: user }}><Pencil /></Link>
            </OverlayTrigger>
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-2`}>
                        Supprimer
                    </Tooltip>
                }
            >
                <Button size="sm" variant="danger" onClick={() => onDelete(user)}><Trash /></Button>
            </OverlayTrigger>
        </div></td>
    </tr>
}
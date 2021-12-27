import { useEffect, useState } from "react"
import {
    Container,
    Table,
    Button,
    OverlayTrigger,
    Tooltip,
    Alert
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Pencil } from "../UI/Pencil"
import { ApiErrors } from "../../Services/apiFetch"
import { toast } from 'react-toastify'
import { IUser } from "../../Types/IUser"
import { useAccounts } from "../Hooks/AccountsHook"
import { Trash } from "../UI/Trash"
import { ConfirmModal } from "../UI/ConfirmModal"
import { Loader } from "../UI/Loader"

export const ManageUsers = () => {
    const { accounts, getAllAccounts, deleteAccount } = useAccounts()
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, user: IUser }>({ show: false, user: {} as IUser })
    const [loader, setLoader] = useState<boolean>(true)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })

    useEffect(() => {
        (async () => {
            try {
                await getAllAccounts()
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [])

    const handleDeleteAccount = async (user: IUser) => {
        try {
            await deleteAccount(user)
            setDeleteModal(d => ({ ...d, show: false }))
            toast.success("Utilisateur supprimé")
        } catch (e) {
            if (e instanceof ApiErrors) {
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
                    <li className="breadcrumb-item active" aria-current="page">Gestion des utilisateurs</li>
                </ol>
            </nav>
            <h2 className="mt-2">Gestion des utilisateurs</h2>
            <hr className="my-3" />
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
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
                    {loader == false ? accounts.map((user: IUser, index: number) => <UserRow user={user} onDelete={(user: IUser) => setDeleteModal({ show: true, user: user })} />) : <Loader />}
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
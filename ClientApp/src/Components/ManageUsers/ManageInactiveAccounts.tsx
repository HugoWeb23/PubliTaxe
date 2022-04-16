import { useEffect, useState } from "react"
import {
    Container,
    Table,
    Button,
    Alert,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ApiErrors } from "../../Services/apiFetch"
import { toast } from 'react-toastify'
import { IUser } from "../../Types/IUser"
import { useInactiveAccounts } from "../Hooks/InactiveAccountsHook"
import { ConfirmModal } from "../UI/ConfirmModal"
import { Loader } from "../UI/Loader"
import { ExclamationIcon } from "../UI/ExclamationIcon"

export const ManageInactiveAccounts = () => {
    const { accounts, getAllAccounts, deleteAccount, activateAccount } = useInactiveAccounts()
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
            toast.success("Le compte a été supprimé")
        } catch (e: any) {
            if (e instanceof ApiErrors) {
                toast.error(e.singleError.error)
            }
        }
    }

    const handleActivateAccount = async (user: IUser) => {
        try {
            await activateAccount(user)
            toast.success("Le compte a été activé")
        } catch (e: any) {
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
                    <li className="breadcrumb-item active" aria-current="page">Utilisateurs en attente d'activation</li>
                </ol>
            </nav>
            <h2 className="mt-2">Utilisateurs en attente d'activation</h2>
            <hr className="my-3" />
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            <Table striped bordered hover size="sm">
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
                    />) : <Loader />}
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
        <td>{user.mail} {user.changement_pass === 1 && <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip id={`tooltip-2`}>
                    Changement de mot de passe en attente
                </Tooltip>
            }
        >
            <span className="ms-1"><ExclamationIcon width="20" height="20" fill="red" /></span>
        </OverlayTrigger>}</td>
        <td>{user.actif ? "Oui" : "Non"}</td>
        <td><div className="d-flex">
            <Button variant="success" size="sm" className="me-2" onClick={() => onActivate({ ...user, actif: 1 })}>Activer</Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(user)}>Supprimer</Button>
        </div></td>
    </tr>
}
import { useEffect, useState } from "react"
import {
    Container,
    Table,
    Button,
    OverlayTrigger,
    Tooltip,
    Alert,
    Form
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
import { ExclamationIcon } from "../UI/ExclamationIcon"
import { SearchIcon } from "../UI/SearchIcon"
import { useForm } from "react-hook-form"

export const ManageUsers = () => {
    const { accounts, getAllAccounts, deleteAccount } = useAccounts()
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, user: IUser }>({ show: false, user: {} as IUser })
    const [loader, setLoader] = useState<boolean>(true)
    const [errorModal, setErrorModal] = useState<{ show: boolean, message: string }>({ show: false, message: "" })
    const { register, setValue, handleSubmit } = useForm();
    const [searchOptions, setSearchOptions] = useState<{ text: string, type: string }>({ text: "", type: "nom" })

    useEffect(() => {
        (async () => {
            try {
                setLoader(true)
                await getAllAccounts(searchOptions)
            } catch (e: any) {
                if (e instanceof ApiErrors) {
                    setErrorModal({ show: true, message: e.singleError.error })
                }
            }
            setTimeout(() => setLoader(false), 300)
        })()
    }, [searchOptions.text])

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

    const handleSearch = (data: any) => {
        setSearchOptions({ text: data.text, type: data.type })
        setValue('text', '')
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
            <Form onSubmit={handleSubmit(handleSearch)} className="mb-3">
                <div className="d-flex align-items-center">
                    <Form.Control type="text" placeholder="Rechercher..." size="sm" className="me-1" style={{ display: 'inline-block', width: '250px' }} {...register('text')} />
                    <Form.Select className="me-2" size="sm" style={{ display: 'inline-block', width: '125px' }} {...register('type')}>
                        <option value={2}>Prénom</option>
                        <option value={1}>Nom</option>
                        <option value={3}>E-mail</option>
                    </Form.Select>
                    <Button variant="secondary" size="sm" type="submit"><SearchIcon /></Button>
                </div>
            </Form>
            {searchOptions.text.length > 0 && <div className="mt-3">Recherche par
                {searchOptions.type == '1' && " nom"}
                {searchOptions.type == '2' && " prénom"}
                {searchOptions.type == '3' && " adresse e-mail"} : {searchOptions.text}</div>}
            {searchOptions.text.length > 0 && <div className="link" onClick={() => setSearchOptions(options => ({ ...options, text: "" }))}>Supprimer le filtre</div>}
            {errorModal.show && <Alert variant="danger">{errorModal.message}</Alert>}
            <Table striped bordered hover size="sm" className="mt-3">
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
                    {(loader === true) && <tr><td colSpan={6}>Chargement...</td></tr>}
                    {(loader === false && accounts.length === 0) && <tr><td colSpan={6}>Aucun résultat</td></tr>}
                    {(loader == false && accounts.length !== 0) && accounts.map((user: IUser, index: number) => <UserRow user={user} onDelete={(user: IUser) => setDeleteModal({ show: true, user: user })} />)}
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
        <td>{user.mail}</td>
        <td>{user.actif ? "Oui" : "Non"} {user.changement_pass === 1 && <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip id={`tooltip-2`}>
                    Changement de mot de passe en attente
                </Tooltip>
            }
        >
            <span className="ms-1"><ExclamationIcon width="20" height="20" fill="red" /></span>
        </OverlayTrigger>
        }</td>
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
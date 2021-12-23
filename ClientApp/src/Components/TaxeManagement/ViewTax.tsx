import { useEffect, useState } from "react"
import { apiFetch } from "../../Services/apiFetch"
import { Entreprise } from "../../Types/IEntreprise"
import {
    Form,
    Button,
    Row,
    Col,
    Card,
    Container,
    Table,
    Modal,
    Alert
} from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import { LeftArrow } from "../UI/LeftArroy"

export const ViewTax = ({ match }: any) => {
    const entrepriseID = match.params.id
    const [entreprise, setEntreprise] = useState<Entreprise | null>(null)

    useEffect(() => {
        (async () => {
            const entreprise = await apiFetch(`/entreprises/id/${entrepriseID}`)
            setEntreprise(entreprise)
        })()
    }, [])
    return <>
        <div className="d-flex justify-content-between align-items-center">
                <Link to="/" className="link"><LeftArrow /> Retour à la liste des entreprises</Link>
                <h4 className="mt-3">Consulter les informations d'une entreprise</h4>
            </div>
            <hr className="my-3" />
        </>
}
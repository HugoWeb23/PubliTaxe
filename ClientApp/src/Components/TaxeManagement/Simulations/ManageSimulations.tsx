import { Container } from "react-bootstrap"
import { Link } from "react-router-dom"
import { PlusIcon } from "../../UI/PlusIcon"

export const ManageSimulations = () => {
    return <>
    <Container fluid={true}>
    <nav aria-label="breadcrumb" className="mt-3">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Gestion des simulations</li>
                </ol>
            </nav>
            <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
                <h2 className="mb-0">Gestion des simulations</h2>
                <Link to="/pricingsimulation/create/" className="link"><PlusIcon /> Nouvelle simulation</Link>
            </div>
            <hr className="my-3" />
    </Container>
    
    </>
}
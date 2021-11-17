import { useState } from "react";
import { Alert } from "react-bootstrap";
import { IErreur } from "../../Types/IErreur";

export const ErrorAlert = ({erreur = "Une erreur est survenue", details}: IErreur) => {
    const [showDetails, setShowDetails] = useState<boolean>(false);
    return <Alert variant="danger">
        {erreur}
        {showDetails && <div className="mt-4">{details}</div>}
        {details != undefined && <div className="mt-3"><Alert.Link onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Masquer' : 'Afficher'} les détails</Alert.Link></div>}
        </Alert>
}
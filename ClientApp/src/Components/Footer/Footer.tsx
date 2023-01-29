import { apiFetch } from "../../Services/apiFetch";

export const Footer = () => {
    const handleReset = async () => {
        await apiFetch('/entreprises/resetapp')
        window.location.reload()
    }
    return <>
        <div className="footer new-bg-light"><span className="text-muted">Publitaxe 2022</span><a href="#" onClick={handleReset} className="text-muted">Reset app</a></div>
    </>
}
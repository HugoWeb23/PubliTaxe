import MouscronLogo from '../../Images/MouscronLogo.png'

export const AppLoader = () => {
    return <>
    <div className="loader-container">
        <img src={MouscronLogo}/>
        <div className="login-title">PubliTaxe</div>
        <div className="loader"></div>
    </div>
    </>
}
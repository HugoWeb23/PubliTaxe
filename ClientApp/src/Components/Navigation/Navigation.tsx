import {
  Navbar,
  Nav,
  NavDropdown
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';

export const Navigation = () => {
  return <Navbar expand bg="dark" variant="dark" className="px-2">
    <LinkContainer to="/"><Navbar.Brand>PubliTaxe</Navbar.Brand></LinkContainer>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="me-auto">
      <NavDropdown title="Gestion" id="collasible-nav-dropdown">
          <LinkContainer to="/"><NavDropdown.Item>Gestion des entreprises</NavDropdown.Item></LinkContainer>
          <LinkContainer to="/notreceived"><NavDropdown.Item>Encodage des non reçus</NavDropdown.Item></LinkContainer>
        </NavDropdown>
        <NavDropdown title="Outils" id="collasible-nav-dropdown">
          <LinkContainer to="/tools/printalldeclarations"><NavDropdown.Item>Imprimer toutes les déclarations</NavDropdown.Item></LinkContainer>
          <LinkContainer to="/tools/printallminutes"><NavDropdown.Item>Imprimer tous les procès verbaux</NavDropdown.Item></LinkContainer>
          <LinkContainer to="/tools/manageprices"><NavDropdown.Item>Gestion des tarifs</NavDropdown.Item></LinkContainer>
          <LinkContainer to="/tools/managefiscalyears"><NavDropdown.Item>Gestion des exercices</NavDropdown.Item></LinkContainer>
          <LinkContainer to="/tools/changefiscalyear"><NavDropdown.Item>Gestion des informations générales</NavDropdown.Item></LinkContainer>
          <NavDropdown.Divider />
          <LinkContainer to="/tools/changefiscalyear"><NavDropdown.Item>Changement d'exercice</NavDropdown.Item></LinkContainer>
        </NavDropdown>
        <NavDropdown title="Gestion des accès" id="collasible-nav-dropdown">
          <LinkContainer to="/manageaccess/all"><NavDropdown.Item>Gestion des utilisateurs</NavDropdown.Item></LinkContainer>
          <LinkContainer to="/manageaccess/pendingaccounts"><NavDropdown.Item>Utilisateurs en attente d'activation</NavDropdown.Item></LinkContainer>
        </NavDropdown>
      </Nav>
      <Nav>
        <NavDropdown title={"Hugo Hourriez"} id="collasible-nav-dropdown" align="end">
        <LinkContainer to="/account/manageaccount"><NavDropdown.Item>Gestion du compte</NavDropdown.Item></LinkContainer>
          <NavDropdown.Divider />
          <NavDropdown.Item>Déconnexion</NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
}
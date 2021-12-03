import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { IPublicite } from '../../../Types/IPublicite';

interface ITaxPrinter {
    entreprise: Entreprise
}

export const TaxPrinter = ({ entreprise }: ITaxPrinter) => {
    const styles = StyleSheet.create({
        Page: {
            padding: '5mm'
        },
        ViewMainTitle: {
            margin: '1mm'
        },
        MainTitle: {
            color: '#000',
            fontSize: '15px',
            textAlign: 'center',
            padding: '1mm'
        },
        SubTitleView: {
            border: '2px solid #000',
            marginBottom: '2mm'
        },
        SubTitleText: {
            fontSize: '13px',
            textAlign: 'center',
            padding: '1mm'
        },
        NormalText: {
            fontSize: '12px'
        },
        GeneralInformations: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '3mm'
        },
        EntrepriseData: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: '3mm'
        },
        EntrepriseInfos: {
            width: '50%'
        },
        Address: {
            width: '50%',
            border: '1px solid #000',
        },
        AddressTitle: {
            borderBottom: '1px solid #000',
            textAlign: 'center',
            fontSize: '14px'
        },
        AddressTextBlock: {
            padding: '1mm'
        },
        TaxAddress: {
            marginBottom: '3mm'
        },
        Publicite: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
        },
        PubliciteSituation: {
            flexBasis: '100%'
        },
        PubSeparator: {
            height: '1mm',
            width: '100%',
            borderBottom: '0.5px solid #black',
            marginTop: '2mm',
            marginBottom: '2mm'
        },
        Paginate: {
            position: 'absolute',
            bottom: '3mm',
            right: '5mm',
            fontSize: '11px'
        }
    });

    return <Page size="A4" style={styles.Page}>
            <View style={styles.ViewMainTitle}>
                <Text style={styles.MainTitle}>Fiche de taxation</Text>
            </View>
            <View style={styles.SubTitleView}>
                <Text style={styles.SubTitleText}>Données de l'entreprise</Text>
            </View>
            <View style={styles.GeneralInformations}>
                <Text style={styles.NormalText}>Matricule : {entreprise.matricule_ciger}</Text>
                <Text style={styles.NormalText}>PV : {entreprise.proces_verbal == true ? 'Oui' : 'Non'}</Text>
                <Text style={styles.NormalText}>Reçu : {entreprise.recu == true ? 'Oui' : 'Non'}</Text>
                <Text style={styles.NormalText}>Province : {entreprise.province == true ? 'Oui' : 'Non'}</Text>
                <Text style={styles.NormalText}>Langue : {entreprise.role_linguistique == 1 ? 'Français' : 'Néerlandais'}</Text>
            </View>
            <View style={styles.EntrepriseData}>
                <View style={styles.EntrepriseInfos}>
                    <Text style={styles.NormalText}>Nom : {entreprise.nom}</Text>
                    <Text style={styles.NormalText}>Téléphone : {entreprise.numero_telephone}</Text>
                    <Text style={styles.NormalText}>Fax : {entreprise.numero_fax}</Text>
                    <Text style={styles.NormalText}>Personne de contact : {entreprise.personne_contact}</Text>
                    <Text style={styles.NormalText}>Mail : {entreprise.mail_contact}</Text>
                    <Text style={styles.NormalText}>TVA : {entreprise.numero_tva}</Text>
                    <Text style={styles.NormalText}>Majoration : {entreprise.pourcentage_majoration} %</Text>
                    <Text style={styles.NormalText}>Motif majoration : {entreprise.motif_majoration}</Text>
                    <Text style={styles.NormalText}>Commentaire : {entreprise.commentaire_taxation}</Text>
                </View>
                <View style={styles.Address}>
                    <View style={styles.AddressTitle}>
                        <Text>Adresse</Text>
                    </View>
                    <View style={styles.AddressTextBlock}>
                        <Text style={styles.NormalText}>Code rue : {entreprise.code_rue}</Text>
                        <Text style={styles.NormalText}>Rue : {entreprise.adresse_rue}</Text>
                        <Text style={styles.NormalText}>Numéro : {entreprise.adresse_numero}</Text>
                        <Text style={styles.NormalText}>Index : {entreprise.adresse_index}</Text>
                        <Text style={styles.NormalText}>Boite : {entreprise.adresse_boite}</Text>
                        <Text style={styles.NormalText}>Code postal : {entreprise.code_postal.cp}</Text>
                        <Text style={styles.NormalText}>Localité : {entreprise.code_postal.localite}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.SubTitleView}>
                <Text style={styles.SubTitleText}>Adresse de taxation</Text>
            </View>
            <View style={styles.TaxAddress}>
                <Text style={styles.NormalText}>Code rue : {entreprise.code_rue_taxation}</Text>
                <Text style={styles.NormalText}>Rue : {entreprise.adresse_taxation}</Text>
                <Text style={styles.NormalText}>Numéro : {entreprise.adresse_numero_taxation}</Text>
                <Text style={styles.NormalText}>Index : {entreprise.adresse_index_taxation}</Text>
                <Text style={styles.NormalText}>Boite : {entreprise.adresse_boite_taxation}</Text>
                <Text style={styles.NormalText}>Code postal : {entreprise.adresse_code_postal_taxation}</Text>
                <Text style={styles.NormalText}>Localité : {entreprise.adresse_localite_taxation}</Text>
            </View>
            <View style={styles.SubTitleView}>
                <Text style={styles.SubTitleText}>Publicités</Text>
            </View>
            {entreprise.publicites.map((publicite: IPublicite, index: number) => {
                return <>
                    <View style={styles.Publicite} wrap={false}>
                        <View>
                            <Text style={styles.NormalText}>Code rue : {publicite.rue.code_rue}</Text>
                            <Text style={styles.NormalText}>Code postal : {publicite.rue.code_postal.cp}</Text>
                            <Text style={styles.NormalText}>Adresse : {publicite.rue.nom_rue}</Text>
                            <Text style={styles.NormalText}>Numéro : {publicite.adresse_numero}</Text>
                        </View>
                        <View>
                            <Text style={styles.NormalText}>Type panneau : {publicite.type_publicite}</Text>
                            <Text style={styles.NormalText}>Type panneau : {publicite.quantite}</Text>
                            <Text style={styles.NormalText}>Faces : {publicite.face}</Text>
                            <Text style={styles.NormalText}>Surface unitaire : {publicite.surface}</Text>
                        </View>
                        <View>
                            <Text style={styles.NormalText}>Mesure : {publicite.mesure}</Text>
                            <Text style={styles.NormalText}>Exonération : {publicite.exoneration == true ? 'Oui' : 'Non'}</Text>
                            <Text style={styles.NormalText}>Surface totale : {publicite.surface_totale}</Text>
                            <Text style={styles.NormalText}>Taxe totale : {publicite.taxe_totale} €</Text>
                        </View>
                        <View style={styles.PubliciteSituation}>
                            <Text style={styles.NormalText}>Situation : {publicite.situation}</Text>
                        </View>
                    </View>
                    {(index + 1 >= entreprise.publicites.length) == false && <View style={styles.PubSeparator}></View>}
                </>
            })}
            <Text style={styles.Paginate} render={({ pageNumber, totalPages }) => (
                `${pageNumber} / ${totalPages}`
            )} fixed />
        </Page>
}
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Entreprise } from '../../../Types/IEntreprise';
import { IPrintData } from '../../../Types/IPrintData';
import mouscron from '../../../Images/mouscron.jpg'
import wapi from '../../../Images/wapi.jpg'
import transversal from '../../../Images/transversal.jpg'
import blancke_signature from '../../../Images/blancke_signature.jpg'
import aubert_signature from '../../../Images/aubert_signature.jpg'
import cachet_ville from '../../../Images/cachet_ville.jpg'

interface ILetterPrinter {
    entreprise: Entreprise,
    printData: IPrintData,
    tarifs: any
}

export const LetterPrinter = ({ entreprise, printData, tarifs }: ILetterPrinter) => {
    Font.register({
        family: 'Arial', fonts: [
            {
                src: '/Fonts/Arial.ttf'
            },
            {
                src: '/Fonts/ArialBold.ttf',
                fontWeight: 'bold'
            }
        ]
    });
    Font.register({
        family: 'Tahoma', fonts: [
            {
                src: '/Fonts/Tahoma.ttf'
            },
            {
                src: '/Fonts/TahomaBold.ttf',
                fontWeight: 'bold'
            }
        ]
    });

    const styles = StyleSheet.create({
        Page: {
            padding: '8mm'
        },
        Header: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row'
        },
        HeaderImages: {
            width: '90px',
            height: '90px'
        },
        HeaderText: {
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: '14px',
        },
        HeaderSubText: {
            fontSize: '13px'
        },
        SubHeader: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: '3mm'
        },
        NormalText: {
            fontSize: '10px',
            fontFamily: 'Arial'
        },
        BoldText: {
            fontFamily: 'Arial',
            fontWeight: 'bold'
        },
        CityName: {
            marginTop: '3mm',
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        EntrepriseInfo: {
            marginLeft: '45mm'
        },
        TransversalLogo: {
            marginTop: '3mm',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end'
        },
        TransversalLogoImg: {
            height: '130px',
            width: '70px'
        },
        SignatureSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginTop: '15mm',
            paddingRight: '25mm',
            paddingLeft: '25mm'

        },
        BlanckeSignature: {
            width: '120px',
            height: '70px'
        },
        AubertSignature: {
            width: '120px',
            height: '70px'
        },
        CachetVille: {
            width: '90px',
            height: '90px'
        },
        RegulationNormalText: {
            fontFamily: 'Tahoma',
            fontSize: '10px'
        },
        RegulationBoldText: {
            fontFamily: 'Tahoma',
            fontWeight: 'bold',
            fontSize: '10px'
        }
    })
    return <Page style={styles.Page}>
        <View style={styles.Header}>
            <View><Image src={mouscron} style={styles.HeaderImages} /></View>
            <View>
                <Text style={[styles.HeaderText, { textDecoration: 'underline' }]}>Administration communale de Mouscron</Text>
            </View>
            <View><Image src={wapi} style={styles.HeaderImages} /></View>
        </View>
        <View style={styles.CityName}>
            <View>
                <Text style={[styles.BoldText, { fontSize: '11px', marginBottom: '1mm' }]}>Administration Communale</Text>
                <Text style={styles.NormalText}>Service de la Recette</Text>
                <Text style={styles.NormalText}>Rue de Courtrai, 63</Text>
                <Text style={styles.NormalText}>B-7700 Mouscron</Text>
                <Text style={styles.NormalText}>Tel.: +32(0)56/ 860.280</Text>
            </View>
            <View style={styles.EntrepriseInfo}>
                <Text style={styles.NormalText}>Matricule : {entreprise.matricule_ciger}</Text>
                <Text style={styles.NormalText}>{entreprise.nom}</Text>
                <Text style={styles.NormalText}>{entreprise.adresse_rue}, {entreprise.adresse_numero}</Text>
                <Text style={styles.NormalText}>{entreprise.code_postal.cp} {entreprise.code_postal.localite}</Text>
            </View>
        </View>
        <View style={styles.TransversalLogo}>
            <View>
                <Image src={transversal} style={styles.TransversalLogoImg} />
            </View>
            <View style={{ marginRight: '40mm' }}>
                <Text style={styles.NormalText}>Mouscron, le {printData.print_date}</Text>
            </View>
        </View>
        <View style={{ marginTop: '10mm' }}>
            <Text style={styles.NormalText}>Madame, Monsieur,</Text>
        </View>
        <View style={{ marginTop: '10mm' }}>
            <Text style={[styles.NormalText, styles.BoldText, { textDecoration: 'underline' }]}>Concerne : Taxe communale sur les panneaux publicitaires et les enseignes</Text>
        </View>
        <View style={{ marginTop: '5mm' }}>
            <Text style={styles.NormalText}>Vous trouverez en annexe le formulaire de déclaration relatif aux panneaux et/ou enseignes publicitaires pour l'exercice 2022, <Text style={[styles.BoldText, { textDecoration: 'underline' }]}>avec situation au 1er janvier de l'année</Text>.</Text>
            <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Voudriez-vous vérifier si ces données sont exactes et, éventuellement, les compléter en cas d'oubli ?</Text>
            <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Nous vous prions de bien vouloir nous retourner cette déclaration signée de préférence par mail à {printData.mail} ou au Service des Taxes de la ville de Mouscron, rue de Courtrai, 63 à 7700 Mouscron pour le <Text style={[styles.BoldText, { textDecoration: 'underline' }]}>{printData.deadline}</Text> au plus tard et ce, même s'il n'y a aucun changement à la situation.</Text>
            <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Pour tout renseignement complémentaire, veuillez contacter</Text>
            <View style={{ marginLeft: '50mm', marginTop: '5mm' }}>
                <Text style={styles.NormalText}>{printData.contact_person} au {printData.phone}</Text>
                <Text style={[styles.NormalText, { marginLeft: '20mm', marginTop: '3mm' }]}>(du lundi au jeudi)</Text>
            </View>
            <Text style={[styles.NormalText, { marginLeft: '15mm', marginTop: '5mm' }]}>Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos sentiments distingués.</Text>
            <View style={styles.SignatureSection}>
                <View>
                    <Text style={styles.NormalText}>La Directrice Générale</Text>
                    <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Nathalie BLANCKE</Text>
                    <Image src={blancke_signature} style={[styles.BlanckeSignature, { marginTop: '5mm' }]} />
                </View>
                <View>
                    <Image src={cachet_ville} style={[styles.CachetVille]} />
                </View>
                <View>
                    <Text style={styles.NormalText}>La Bourgmestre</Text>
                    <Text style={[styles.NormalText, { marginTop: '5mm' }]}>Brigitte AUBERT</Text>
                    <Image src={aubert_signature} style={[styles.AubertSignature, { marginTop: '5mm' }]} />
                </View>
            </View>
        </View>
        {/* Règlement */}
        <View style={styles.RegulationNormalText} break>
            <Text style={[styles.RegulationBoldText, { textDecoration: 'underline' }]}>TAXE COMMUNALE SUR LES ENSEIGNES LES PANNEAUX PUBLICITAIRES ET PUBLICITES ASSIMILEES</Text>
            <Text style={{ marginTop: '5mm' }}>Il est établi  une taxe communale sur les enseignes, les panneaux publicitaires et publicités assimilées directement ou
                indirectement lumineuses ou non lumineuses de quelque nature qu'elles soient.</Text>
            <Text style={{ marginTop: '5mm' }}>
                Sont visées toutes enseignes existantes au 1er janvier de l'exercice d'imposition sur lesquelles figurent des indications visibles
                de la voie publique et qui ont pour but de faire connaÓtre la dénomination du commerce ou de l'industrie ou du service, les
                produits ou services offerts ou susceptible de l'Ítre et l'activité ou la profession exercée, ainsi que les supports visibles d'une
                voie de communication ou d'un endroit fréquenté en permanence ou occasionnellement par le public et destinés à l'apposition
                d'affiches à caractËre publicitaire.
                Sont également visées les affiches publicitaires en métal léger ou en PVC ne nécessitant aucun support.
            </Text>
            <Text style={{ marginTop: '5mm' }}>
                Une publicité est assimilée à une enseigne lorsque, placée à proximité immédiate d'un établissement, elle promeut cet
                établissement ou les activités qui s'y déroulent et les produits et services qui y sont fournis.
            </Text>
            <Text style={{ marginTop: '5mm' }}>
                L'impÙt est d ̊ solidairement par toute personne physique ou morale qui exploite un établissement comprenant des enseignes et/ou qui bénéficie directement ou indirectement de l'enseigne et par le propriétaire de l'immeuble auquel est attachée
                l'enseigne au 1er janvier de l'exercice d'imposition.
            </Text>
            <Text style={{ marginTop: '5mm' }}>
                Sont exonÈrÈs : l'enseigne la plus chËre indiquant la raison sociale ou la dÈnomination de l'Ètablissement et ‡ raison d'une
                seule enseigne par Ètablissement - les autocollants de moins d'un mËtre carrÈ - les enseignes l'annÈe qui suit leur installation/
                mise en conformitÈ aprËs introduction d'un dossier au service de l'Urbanisme.
            </Text>
            <View style={{ marginTop: '5mm' }}>
                <View>
                    <Text>L'impôt est fixé à</Text>
                </View>
                <View>
                    <Text>0,15 EUR. par dÈcimËtre carrÈ pour les enseignes non lumineuses.</Text>
                    <Text>0,30 EUR. par dÈcimËtre carrÈ pour les enseignes lumineuses ou ÈclairÈes.</Text>
                    <Text>0,82 EUR. par dÈcimËtre carrÈ de surface du panneau publicitaire.</Text>
                    <Text>1,64 EUR. lorsque le panneau est ÈquipÈ d'un systËme de dÈfilement Èlectronique ou mÈcanique
                        ou lorsque le panneau est lumineux ou ÈclairÈ.</Text>
                </View>
            </View>
            <Text style={{ marginTop: '5mm' }}>La superficie retenue est celle du support sur lequel se trouve l'enseigne ou le panneau et ce quelle que soit la surface
                par l'information qui y est diffusÈe.</Text>
            <Text style={{ marginTop: '5mm' }}>L'administration communale adresse au contribuable une formule de dÈclaration que celui-ci est tenu de renvoyer, d ̊ment
                remplie et signÈe, avant l'ÈchÈance mentionnÈe sur la dite formule.
                Le contribuable qui n'a pas reÁu de formule de dÈclaration est tenu de dÈclarer ‡ l'administration communale, au plus tard le
                le 31 juillet de l'exercice d'imposition, les ÈlÈments nÈcessaires ‡ l'imposition.</Text>
            <Text style={{ marginTop: '5mm' }}>En cas d'enrÙlement d'office, la majoration sera la suivante :</Text>
            <Text style={{ marginTop: '3mm' }}>Montant de la taxe + 10% pour ce qui concerne la premiËre infraction,</Text>
            <Text>Montant de la taxe + 50% pour ce qui concerne la seconde infraction,</Text>
            <Text>Montant de la taxe + 100% pour ce qui concerne la troisiËme infraction,</Text>
            <Text>Montant de la taxe + 200% pour ce qui concerne la quatriËme infraction et les suivantes.</Text>
            <Text style={{ marginTop: '5mm' }}>Il y a 2Ëme violation ou violation subsÈquente si, au moment o ̆ une nouvelle violation est commise, le contribuable s'est vu
                prÈcÈdemment adressÈ une ou plusieurs notification(s) de taxation d'office en application de l'article L3321-6 alinÈa 2 du code
                de la DÈmocratie Locale et de la DÈcentralisation.</Text>
            <Text style={{ marginTop: '5mm' }}>Pour la dÈtermination du pourcentage d'accroissement ‡ appliquer, les violations antÈrieures ne sont pas prises en
                considÈration si aucune violation n'est constatÈe pour les 4 derniers exercices d'imposition qui prÈcËdent celui pour lequel la
                nouvelle violation est constatÈe.</Text>
        </View>
    </Page>
}
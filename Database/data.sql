USE [master]
GO
/****** Object:  Database [PubliTaxe2]    Script Date: 17-07-22 21:42:37 ******/
CREATE DATABASE [PubliTaxe2]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'PubliTaxe2', FILENAME = N'C:\Users\Utilisateur\PubliTaxe2.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'PubliTaxe2_log', FILENAME = N'C:\Users\Utilisateur\PubliTaxe2_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [PubliTaxe2] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [PubliTaxe2].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [PubliTaxe2] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [PubliTaxe2] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [PubliTaxe2] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [PubliTaxe2] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [PubliTaxe2] SET ARITHABORT OFF 
GO
ALTER DATABASE [PubliTaxe2] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [PubliTaxe2] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [PubliTaxe2] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [PubliTaxe2] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [PubliTaxe2] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [PubliTaxe2] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [PubliTaxe2] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [PubliTaxe2] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [PubliTaxe2] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [PubliTaxe2] SET  DISABLE_BROKER 
GO
ALTER DATABASE [PubliTaxe2] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [PubliTaxe2] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [PubliTaxe2] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [PubliTaxe2] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [PubliTaxe2] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [PubliTaxe2] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [PubliTaxe2] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [PubliTaxe2] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [PubliTaxe2] SET  MULTI_USER 
GO
ALTER DATABASE [PubliTaxe2] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [PubliTaxe2] SET DB_CHAINING OFF 
GO
ALTER DATABASE [PubliTaxe2] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [PubliTaxe2] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [PubliTaxe2] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [PubliTaxe2] SET QUERY_STORE = OFF
GO
USE [PubliTaxe2]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [PubliTaxe2]
GO
/****** Object:  Table [dbo].[codes_postaux]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[codes_postaux](
	[code_postalId] [int] IDENTITY(1,1) NOT NULL,
	[id_pays] [int] NOT NULL,
	[code_postal] [varchar](50) NOT NULL,
	[numero_localite] [int] NOT NULL,
	[localite] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_codes_postaux$] PRIMARY KEY CLUSTERED 
(
	[code_postalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[enseignes_publicitaires]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[enseignes_publicitaires](
	[numero_panneau] [bigint] IDENTITY(1,1) NOT NULL,
	[id_entreprise] [bigint] NULL,
	[id_rue] [int] NOT NULL,
	[exercice_courant] [bigint] NOT NULL,
	[type_publicite] [smallint] NOT NULL,
	[adresse_numero] [varchar](10) NOT NULL,
	[situation] [varchar](255) NOT NULL,
	[quantite] [smallint] NOT NULL,
	[face] [smallint] NOT NULL,
	[mesure] [varchar](50) NOT NULL,
	[surface] [decimal](9, 2) NOT NULL,
	[code_recu] [smallint] NOT NULL,
	[exoneration] [bit] NOT NULL,
	[pv] [smallint] NOT NULL,
 CONSTRAINT [PK_enseignes_publicitaires] PRIMARY KEY CLUSTERED 
(
	[numero_panneau] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[enseignes_publicitaires_simulations]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[enseignes_publicitaires_simulations](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[id_simulation] [bigint] NOT NULL,
	[exoneration] [bit] NOT NULL,
	[id_rue] [int] NOT NULL,
	[type_publicite] [smallint] NOT NULL,
	[adresse_numero] [varchar](10) NOT NULL,
	[situation] [varchar](255) NOT NULL,
	[quantite] [smallint] NOT NULL,
	[face] [smallint] NOT NULL,
	[mesure] [varchar](50) NOT NULL,
	[surface] [decimal](9, 2) NOT NULL,
 CONSTRAINT [PK_enseignes_publicitaires_simulations] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[entreprises]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[entreprises](
	[id_entreprise] [bigint] IDENTITY(1,1) NOT NULL,
	[matricule_ciger] [bigint] NOT NULL,
	[code_postalId] [int] NOT NULL,
	[nom] [varchar](100) NOT NULL,
	[code_rue] [varchar](10) NULL,
	[adresse_rue] [varchar](150) NOT NULL,
	[adresse_numero] [varchar](10) NOT NULL,
	[adresse_boite] [varchar](10) NOT NULL,
	[adresse_index] [varchar](10) NOT NULL,
	[numero_telephone] [varchar](30) NOT NULL,
	[numero_fax] [varchar](30) NOT NULL,
	[numero_tva] [varchar](30) NOT NULL,
	[proces_verbal] [bit] NOT NULL,
	[recu] [bit] NOT NULL,
	[province] [bit] NOT NULL,
	[suppression] [bit] NOT NULL,
	[statut_paiement] [smallint] NOT NULL,
	[personne_contact] [varchar](50) NOT NULL,
	[telephone_contact] [varchar](30) NOT NULL,
	[mail_contact] [varchar](50) NOT NULL,
	[pourcentage_majoration] [int] NOT NULL,
	[motif_majorationId] [int] NULL,
	[code_rue_taxation] [varchar](10) NOT NULL,
	[adresse_taxation] [varchar](150) NOT NULL,
	[adresse_numero_taxation] [varchar](10) NOT NULL,
	[adresse_boite_taxation] [varchar](10) NOT NULL,
	[adresse_index_taxation] [varchar](10) NOT NULL,
	[adresse_code_postal_taxation] [varchar](50) NOT NULL,
	[adresse_localite_taxation] [varchar](20) NOT NULL,
	[commentaire_taxation] [varchar](200) NULL,
	[role_linguistique] [int] NOT NULL,
	[desactive] [bit] NOT NULL,
 CONSTRAINT [PK_entreprises] PRIMARY KEY CLUSTERED 
(
	[id_entreprise] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[exercices]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[exercices](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[annee_exercice] [smallint] NOT NULL,
	[date_echeance] [varchar](50) NOT NULL,
	[date_reglement_taxe] [varchar](50) NOT NULL,
 CONSTRAINT [PK_exercices] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[informations]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[informations](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[personne_contact] [varchar](50) NOT NULL,
	[telephone_contact] [varchar](30) NOT NULL,
	[mail_contact] [varchar](100) NOT NULL,
	[direction_generale] [varchar](50) NOT NULL,
	[bourgmestre] [varchar](50) NOT NULL,
	[exercice_courant] [bigint] NOT NULL,
 CONSTRAINT [PK_informations_1] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[motifs_majoration]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[motifs_majoration](
	[id_motif] [int] IDENTITY(1,1) NOT NULL,
	[libelle] [varchar](1000) NOT NULL,
 CONSTRAINT [PK_motifs_majoration] PRIMARY KEY CLUSTERED 
(
	[id_motif] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[non_recus]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[non_recus](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[id_entreprise] [bigint] NULL,
	[motif_majorationId] [int] NOT NULL,
	[exerciceId] [bigint] NOT NULL,
	[remarque] [text] NOT NULL,
	[pourcentage_majoration] [int] NOT NULL,
	[date] [varchar](20) NOT NULL,
 CONSTRAINT [PK_non_recus] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[paiements_recus]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[paiements_recus](
	[id_paiement] [bigint] IDENTITY(1,1) NOT NULL,
	[id_entreprise] [bigint] NULL,
	[exerciceId] [bigint] NOT NULL,
	[montant] [decimal](9, 2) NOT NULL,
	[type_paiement] [smallint] NOT NULL,
	[mode_paiement] [smallint] NOT NULL,
	[type_carte] [smallint] NOT NULL,
	[remarque] [varchar](500) NOT NULL,
	[date] [varchar](50) NOT NULL,
 CONSTRAINT [PK_paiements_recus] PRIMARY KEY CLUSTERED 
(
	[id_paiement] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[pays]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[pays](
	[paysId] [int] IDENTITY(1,1) NOT NULL,
	[code_pays] [varchar](80) NOT NULL,
	[nom_pays] [varchar](80) NOT NULL,
 CONSTRAINT [PK_pays] PRIMARY KEY CLUSTERED 
(
	[paysId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[photos_publicites]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[photos_publicites](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[numero_panneauId] [bigint] NULL,
	[photo] [varchar](500) NOT NULL,
 CONSTRAINT [PK_photos_publicites] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[rues]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[rues](
	[rueId] [int] IDENTITY(1,1) NOT NULL,
	[code_postalId] [int] NOT NULL,
	[langue] [varchar](50) NOT NULL,
	[nom_rue] [varchar](1000) NOT NULL,
	[code_rue] [varchar](3) NOT NULL,
 CONSTRAINT [PK_code_rue] PRIMARY KEY CLUSTERED 
(
	[rueId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[simulations]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[simulations](
	[id_simulation] [bigint] IDENTITY(1,1) NOT NULL,
	[commentaire_taxation] [varchar](200) NULL,
	[code_postalId] [int] NOT NULL,
	[nom] [varchar](100) NOT NULL,
	[code_rue] [varchar](10) NULL,
	[adresse_rue] [varchar](150) NOT NULL,
	[adresse_numero] [varchar](10) NOT NULL,
	[adresse_boite] [varchar](10) NOT NULL,
	[adresse_index] [varchar](10) NOT NULL,
	[numero_telephone] [varchar](30) NOT NULL,
	[numero_tva] [varchar](30) NOT NULL,
	[mail_contact] [varchar](50) NOT NULL,
	[role_linguistique] [int] NOT NULL,
	[date_creation] [varchar](20) NOT NULL,
	[exercices] [varchar](50) NOT NULL,
 CONSTRAINT [PK_simulations] PRIMARY KEY CLUSTERED 
(
	[id_simulation] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tarifs]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tarifs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[exerciceId] [bigint] NOT NULL,
	[prix_unitaire_enseigne_non_lumineuse] [decimal](5, 3) NOT NULL,
	[prix_unitaire_enseigne_lumineuse] [decimal](5, 3) NOT NULL,
	[prix_unitaire_enseigne_clignotante] [decimal](5, 3) NOT NULL,
	[prix_unitaire_panneau_non_lumineux] [decimal](5, 3) NOT NULL,
	[prix_unitaire_panneau_lumineux] [decimal](5, 3) NOT NULL,
	[prix_unitaire_panneau_a_defilement] [decimal](5, 3) NOT NULL,
 CONSTRAINT [PK_tarifs] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[utilisateurs]    Script Date: 17-07-22 21:42:37 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[utilisateurs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[nom] [varchar](100) NOT NULL,
	[prenom] [varchar](100) NOT NULL,
	[mail] [varchar](150) NOT NULL,
	[pass] [varchar](500) NOT NULL,
	[actif] [smallint] NOT NULL,
	[role] [smallint] NOT NULL,
	[changement_pass] [smallint] NOT NULL,
 CONSTRAINT [PK_utilisateurs] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_codes_postaux]    Script Date: 17-07-22 21:42:37 ******/
CREATE NONCLUSTERED INDEX [IX_codes_postaux] ON [dbo].[codes_postaux]
(
	[code_postalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[codes_postaux]  WITH CHECK ADD  CONSTRAINT [FK_codes_postaux_pays] FOREIGN KEY([id_pays])
REFERENCES [dbo].[pays] ([paysId])
GO
ALTER TABLE [dbo].[codes_postaux] CHECK CONSTRAINT [FK_codes_postaux_pays]
GO
ALTER TABLE [dbo].[enseignes_publicitaires]  WITH CHECK ADD  CONSTRAINT [FK_enseignes_publicitaires_entreprises1] FOREIGN KEY([id_entreprise])
REFERENCES [dbo].[entreprises] ([id_entreprise])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[enseignes_publicitaires] CHECK CONSTRAINT [FK_enseignes_publicitaires_entreprises1]
GO
ALTER TABLE [dbo].[enseignes_publicitaires]  WITH CHECK ADD  CONSTRAINT [FK_enseignes_publicitaires_exercices] FOREIGN KEY([exercice_courant])
REFERENCES [dbo].[exercices] ([id])
GO
ALTER TABLE [dbo].[enseignes_publicitaires] CHECK CONSTRAINT [FK_enseignes_publicitaires_exercices]
GO
ALTER TABLE [dbo].[enseignes_publicitaires]  WITH CHECK ADD  CONSTRAINT [FK_enseignes_publicitaires_rues] FOREIGN KEY([id_rue])
REFERENCES [dbo].[rues] ([rueId])
GO
ALTER TABLE [dbo].[enseignes_publicitaires] CHECK CONSTRAINT [FK_enseignes_publicitaires_rues]
GO
ALTER TABLE [dbo].[enseignes_publicitaires_simulations]  WITH CHECK ADD  CONSTRAINT [FK_enseignes_publicitaires_simulations_rues] FOREIGN KEY([id_simulation])
REFERENCES [dbo].[simulations] ([id_simulation])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[enseignes_publicitaires_simulations] CHECK CONSTRAINT [FK_enseignes_publicitaires_simulations_rues]
GO
ALTER TABLE [dbo].[entreprises]  WITH CHECK ADD  CONSTRAINT [FK_entreprises_codes_postaux] FOREIGN KEY([code_postalId])
REFERENCES [dbo].[codes_postaux] ([code_postalId])
GO
ALTER TABLE [dbo].[entreprises] CHECK CONSTRAINT [FK_entreprises_codes_postaux]
GO
ALTER TABLE [dbo].[entreprises]  WITH CHECK ADD  CONSTRAINT [FK_entreprises_motifs_majoration] FOREIGN KEY([motif_majorationId])
REFERENCES [dbo].[motifs_majoration] ([id_motif])
GO
ALTER TABLE [dbo].[entreprises] CHECK CONSTRAINT [FK_entreprises_motifs_majoration]
GO
ALTER TABLE [dbo].[informations]  WITH CHECK ADD  CONSTRAINT [FK_informations_exercices] FOREIGN KEY([exercice_courant])
REFERENCES [dbo].[exercices] ([id])
GO
ALTER TABLE [dbo].[informations] CHECK CONSTRAINT [FK_informations_exercices]
GO
ALTER TABLE [dbo].[non_recus]  WITH CHECK ADD  CONSTRAINT [FK_non_recus_entreprises1] FOREIGN KEY([id_entreprise])
REFERENCES [dbo].[entreprises] ([id_entreprise])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[non_recus] CHECK CONSTRAINT [FK_non_recus_entreprises1]
GO
ALTER TABLE [dbo].[non_recus]  WITH CHECK ADD  CONSTRAINT [FK_non_recus_exercices] FOREIGN KEY([exerciceId])
REFERENCES [dbo].[exercices] ([id])
GO
ALTER TABLE [dbo].[non_recus] CHECK CONSTRAINT [FK_non_recus_exercices]
GO
ALTER TABLE [dbo].[non_recus]  WITH CHECK ADD  CONSTRAINT [FK_non_recus_motifs_majoration] FOREIGN KEY([motif_majorationId])
REFERENCES [dbo].[motifs_majoration] ([id_motif])
GO
ALTER TABLE [dbo].[non_recus] CHECK CONSTRAINT [FK_non_recus_motifs_majoration]
GO
ALTER TABLE [dbo].[paiements_recus]  WITH CHECK ADD  CONSTRAINT [FK_paiements_recus_entreprises1] FOREIGN KEY([id_entreprise])
REFERENCES [dbo].[entreprises] ([id_entreprise])
ON UPDATE CASCADE
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[paiements_recus] CHECK CONSTRAINT [FK_paiements_recus_entreprises1]
GO
ALTER TABLE [dbo].[paiements_recus]  WITH CHECK ADD  CONSTRAINT [FK_paiements_recus_exercices] FOREIGN KEY([exerciceId])
REFERENCES [dbo].[exercices] ([id])
GO
ALTER TABLE [dbo].[paiements_recus] CHECK CONSTRAINT [FK_paiements_recus_exercices]
GO
ALTER TABLE [dbo].[photos_publicites]  WITH CHECK ADD  CONSTRAINT [FK_photos_publicites_enseignes_publicitaires] FOREIGN KEY([numero_panneauId])
REFERENCES [dbo].[enseignes_publicitaires] ([numero_panneau])
ON UPDATE SET NULL
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[photos_publicites] CHECK CONSTRAINT [FK_photos_publicites_enseignes_publicitaires]
GO
ALTER TABLE [dbo].[rues]  WITH CHECK ADD  CONSTRAINT [FK_rues_codes_postaux] FOREIGN KEY([code_postalId])
REFERENCES [dbo].[codes_postaux] ([code_postalId])
GO
ALTER TABLE [dbo].[rues] CHECK CONSTRAINT [FK_rues_codes_postaux]
GO
ALTER TABLE [dbo].[simulations]  WITH CHECK ADD  CONSTRAINT [FK_simulations_codes_postaux] FOREIGN KEY([code_postalId])
REFERENCES [dbo].[codes_postaux] ([code_postalId])
GO
ALTER TABLE [dbo].[simulations] CHECK CONSTRAINT [FK_simulations_codes_postaux]
GO
ALTER TABLE [dbo].[tarifs]  WITH CHECK ADD  CONSTRAINT [FK_tarifs_exercices] FOREIGN KEY([exerciceId])
REFERENCES [dbo].[exercices] ([id])
GO
ALTER TABLE [dbo].[tarifs] CHECK CONSTRAINT [FK_tarifs_exercices]
GO
USE [master]
GO
ALTER DATABASE [PubliTaxe2] SET  READ_WRITE 
GO

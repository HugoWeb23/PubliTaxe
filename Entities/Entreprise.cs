using FluentValidation;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Taxes.Entities
{
    public class Entreprise
    {
        [Key]
        public long Id_entreprise { get; set; }
        public long Matricule_ciger { get; set; }
        public int Code_postalId { get; set; }
        public string Nom { get; set; }
        public string Code_rue { get; set; }
        public string Adresse_rue { get; set; }
        public string Adresse_numero { get; set; }
        public string Adresse_boite { get; set; }
        public string Adresse_index { get; set; }
        public string Numero_telephone { get; set; }
        public string Numero_fax { get; set; }
        public string Numero_tva { get; set; }
        public bool Proces_verbal { get; set; }
        public bool Recu { get; set; }
        public bool Province { get; set; }
        public bool Suppression { get; set; }
        public short Statut_paiement { get; set; }
        public string Personne_contact { get; set; }
        public string Telephone_contact { get; set; }
        public string Mail_contact { get; set; }
        public int Pourcentage_majoration { get; set; }
        public int? Motif_majorationId { get; set; }
        public string Code_rue_taxation { get; set; }
        public string Adresse_taxation { get; set; }
        public string Adresse_numero_taxation { get; set; }
        public string Adresse_boite_taxation { get; set; }
        public string Adresse_index_taxation { get; set; }
        public string Adresse_code_postal_taxation { get; set; }
        public string Adresse_localite_taxation { get; set; }
        public string Commentaire_taxation { get; set; }
        public int Role_linguistique { get; set; }
        public bool Desactive { get; set; }
        public Code_postal Code_postal { get; set; }
        [ForeignKey("Motif_majorationId")]
        public MotifMajoration MotifMajoration { get; set; }
        public ICollection<Publicite> Publicites { get; set; }

    }

    public class EntrepriseValidator : AbstractValidator<Entreprise>
    {
        public EntrepriseValidator()
        {
            RuleFor(entreprise => entreprise.Nom).NotEmpty().WithMessage("Veuillez saisir un nom");
            RuleFor(entreprise => entreprise.Adresse_rue).NotEmpty().WithMessage("Veuillez saisir une adresse");
            RuleFor(entreprise => entreprise.Adresse_numero).NotEmpty().WithMessage("Veuillez saisir un numéro");
            RuleFor(entreprise => entreprise.Adresse_boite).NotNull().WithMessage("Veuillez saisir une boite");
            RuleFor(entreprise => entreprise.Adresse_index).NotNull().WithMessage("Veuillez saisir une index");
            RuleFor(entreprise => entreprise.Numero_telephone).NotEmpty().WithMessage("Veuillez saisir un numéro de téléphone");
            RuleFor(entreprise => entreprise.Numero_fax).NotNull().WithMessage("Veuillez saisir un numéro de fax");
            RuleFor(entreprise => entreprise.Recu).NotNull().WithMessage("La propriété 'reçu' est manquante");
            RuleFor(entreprise => entreprise.Province).NotNull().WithMessage("La propriété 'province' est manquante");
            RuleFor(entreprise => entreprise.Personne_contact).NotEmpty().WithMessage("Veuillez définir une personne de contact");
            RuleFor(entreprise => entreprise.Telephone_contact).NotEmpty().WithMessage("Veuillez saisir le numéro téléphone de la personne de contact");
            RuleFor(entreprise => entreprise.Mail_contact).NotEmpty().WithMessage("Veuillez saisir une adresse e-mail pour la personne de contact");
            RuleFor(entreprise => entreprise.Code_rue_taxation).NotEmpty().WithMessage("Veuillez saisir un code de rue pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_taxation).NotEmpty().WithMessage("Veuillez saisir une adresse de taxation");
            RuleFor(entreprise => entreprise.Adresse_numero_taxation).NotEmpty().WithMessage("Veuillez saisir un numéro de rue pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_index_taxation).NotNull().WithMessage("Veuillez saisir une index");
            RuleFor(entreprise => entreprise.Adresse_boite_taxation).NotNull().WithMessage("Veuillez saisir une boite");
            RuleFor(entreprise => entreprise.Adresse_code_postal_taxation).NotEmpty().WithMessage("Veuillez saisir un code postal pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_localite_taxation).NotEmpty().WithMessage("Veuillez saisir une localité pour la taxation");
            RuleFor(entreprise => entreprise.Role_linguistique).NotEmpty().WithMessage("Veuillez choisir une langue");
            RuleForEach(x => x.Publicites).SetValidator(new PubliciteValidator());
        }
    }
}

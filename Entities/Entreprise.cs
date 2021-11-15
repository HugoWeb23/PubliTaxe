﻿using FluentValidation;
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
        public long Matricule_ciger { get; set; }
        public int Code_postal_id { get; set; }
        public string Nom { get; set; }
        public int Id_rue { get; set; }
        public string Adresse_rue { get; set; }
        public string Adresse_numero { get; set; }
        public int Adresse_boite { get; set; }
        public string Adresse_index { get; set; }
        public string Numero_telephone { get; set; }
        public string Numero_fax { get; set; }
        public string Numero_tva { get; set; }
        public int Recu { get; set; }
        public int Province { get; set; }
        public string Personne_contact { get; set; }
        public string Telephone_contact { get; set; }
        public string Mail_contact { get; set; }
        public int Pourcentage_majoration { get; set; }
        public int Motif_majoration { get; set; }
        public int Code_rue_taxation { get; set; }
        public string Adresse_taxation { get; set; }
        public int Adresse_numero_taxation { get; set; }
        public int Adresse_boite_taxation { get; set; }
        public string Adresse_index_taxation { get; set; }
        public int Adresse_code_postal_taxation { get; set; }
        public string Adresse_localite_taxation { get; set; }
        public string Commentaire_taxation { get; set; }
        public int Role_linguistique { get; set; }

        public Code_postal Code_postal { get; set; }
        public ICollection<Publicite> Publicites { get; set; }

    }

    public class EntrepriseValidator : AbstractValidator<Entreprise>
    {
        public EntrepriseValidator()
        {
            RuleFor(entreprise => entreprise.Matricule_ciger).NotEmpty().WithMessage("Veuillez saisir un matricule Ciger");
            RuleFor(entreprise => entreprise.Code_postal_id).NotEmpty().WithMessage("Veuillez saisir un code postal");
            RuleFor(entreprise => entreprise.Nom).NotEmpty().WithMessage("Veuillez saisir un nom");
            RuleFor(entreprise => entreprise.Id_rue).NotEmpty().WithMessage("Veuillez saisir une rue");
            RuleFor(entreprise => entreprise.Adresse_rue).NotEmpty().WithMessage("Veuillez saisir une adresse");
            RuleFor(entreprise => entreprise.Adresse_numero).NotEmpty().WithMessage("Veuillez saisir un numéro");
            RuleFor(entreprise => entreprise.Adresse_boite).NotEmpty().WithMessage("Veuillez saisir une boite");
            RuleFor(entreprise => entreprise.Adresse_index).NotEmpty().WithMessage("Veuillez saisir un index");
            RuleFor(entreprise => entreprise.Numero_telephone).NotEmpty().WithMessage("Veuillez saisir un numéro de téléphone");
            RuleFor(entreprise => entreprise.Numero_fax).NotEmpty().WithMessage("Veuillez saisir un numéro de fax");
            RuleFor(entreprise => entreprise.Recu).NotEmpty().WithMessage("La propriété 'reçu' est manquante");
            RuleFor(entreprise => entreprise.Province).NotEmpty().WithMessage("La propriété 'province' est manquante");
            RuleFor(entreprise => entreprise.Personne_contact).NotEmpty().WithMessage("Veuillez définir une personne de contact");
            RuleFor(entreprise => entreprise.Telephone_contact).NotEmpty().WithMessage("Veuillez saisir le numéro téléphone de la personne de contact");
            RuleFor(entreprise => entreprise.Mail_contact).NotEmpty().WithMessage("Veuillez saisir une adresse e-mail pour la personne de contact");
            RuleFor(entreprise => entreprise.Pourcentage_majoration).NotEmpty().WithMessage("Veuillez définir un pourcentage de majoration");
            RuleFor(entreprise => entreprise.Motif_majoration).NotEmpty().WithMessage("Veuillez saisir un motif de majoration");
            RuleFor(entreprise => entreprise.Code_rue_taxation).NotEmpty().WithMessage("Veuillez saisir un code de rue pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_taxation).NotEmpty().WithMessage("Veuillez saisir une adresse de taxation");
            RuleFor(entreprise => entreprise.Adresse_numero_taxation).NotEmpty().WithMessage("Veuillez saisir un numéro de rue pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_boite_taxation).NotEmpty().WithMessage("Veuillez saisir un numéro de boite pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_index_taxation).NotEmpty().WithMessage("Veuillez saisir un index pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_code_postal_taxation).NotEmpty().WithMessage("Veuillez saisir un code postal pour la taxation");
            RuleFor(entreprise => entreprise.Adresse_localite_taxation).NotEmpty().WithMessage("Veuillez saisir une localité pour la taxation");
            RuleFor(entreprise => entreprise.Role_linguistique).NotEmpty().WithMessage("Veuillez choisir une langue");
        }
    }
}
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
    public class Simulation
    {
        [Key]
        public long Id_simulation { get; set; }
        public int Code_postalId { get; set; }
        public string Nom { get; set; }
        public string Code_rue { get; set; }
        public string Adresse_rue { get; set; }
        public string Adresse_numero { get; set; }
        public string Adresse_boite { get; set; }
        public string Adresse_index { get; set; }
        public string Numero_telephone { get; set; }
        public string Numero_tva { get; set; }
        public string Mail_contact { get; set; }
        public string Commentaire_taxation { get; set; }
        public int Role_linguistique { get; set; }
        public string Date_creation { get; set; }
        public string Exercices { get; set; }
        public Code_postal Code_postal { get; set; }
        public ICollection<PubliciteSimulation> Publicites { get; set; }

    }

    public class SimulationValidator : AbstractValidator<Simulation>
    {
        public SimulationValidator()
        {
            RuleFor(entreprise => entreprise.Nom).NotEmpty().WithMessage("Veuillez saisir un nom d'entreprise");
            RuleFor(entreprise => entreprise.Adresse_rue).NotEmpty().WithMessage("Veuillez saisir une adresse");
            RuleFor(entreprise => entreprise.Adresse_numero).NotEmpty().WithMessage("Veuillez saisir un numéro");
            RuleFor(entreprise => entreprise.Adresse_boite).NotNull().WithMessage("Veuillez saisir une boite");
            RuleFor(entreprise => entreprise.Adresse_index).NotNull().WithMessage("Veuillez saisir une index");
            RuleFor(entreprise => entreprise.Numero_telephone).NotEmpty().WithMessage("Veuillez saisir un numéro de téléphone");
            RuleFor(entreprise => entreprise.Mail_contact).NotEmpty().WithMessage("Veuillez saisir une adresse e-mail pour la personne de contact");
            RuleFor(entreprise => entreprise.Role_linguistique).NotEmpty().WithMessage("Veuillez choisir une langue");
            RuleForEach(x => x.Publicites).SetValidator(new PubliciteSimulationValidator());
        }
    }
}
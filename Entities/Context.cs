using Microsoft.EntityFrameworkCore;

namespace Taxes.Entities
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<Bourgmestre> bourgmestre { get; set; }
        public DbSet<Code_postal> code_postal { get; set;}
        public DbSet<Publicite> enseignes_publicitaires { get; set; }
        public DbSet<Entreprise> entreprises { get; set; }
        public DbSet<Exercice> exercices { get; set; }
        public DbSet<Information> informations { get; set; }
        public DbSet<MotifTaxation> motifs_taxation { get; set; }
        public DbSet<Rue> rues { get; set; }
        public DbSet<Tarif> tarifs { get; set; }

    }
}

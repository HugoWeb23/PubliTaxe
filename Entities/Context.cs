using Microsoft.EntityFrameworkCore;

namespace Taxes.Entities
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {
        }

        public DbSet<Test> test { get; set; }

    }
}

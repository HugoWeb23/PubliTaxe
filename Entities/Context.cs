using Microsoft.EntityFrameworkCore;

namespace Taxes.Entities
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions<MyContext> options) : base(options)
        {
        }

    }
}

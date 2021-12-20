using MediatR;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;

namespace Taxes.Services
{
    public interface IUserService
    {
        Task<Utilisateur> GetById(long Id);
    }
    public class UserService : IUserService
    {
        public IMediator _mediator;
        public UserService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<Utilisateur> GetById(long id)
        {
            Utilisateur user = await _mediator.Send(new GetUserByIdQuery(id));
            return user;
        }
    }
}

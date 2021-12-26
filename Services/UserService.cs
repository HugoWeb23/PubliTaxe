using MediatR;
using System.Threading.Tasks;
using Taxes.Entities;
using Taxes.Queries;
using Taxes.ViewModels;

namespace Taxes.Services
{
    public interface IUserService
    {
        Task<UserWithoutPassViewModel> GetById(long Id);
    }
    public class UserService : IUserService
    {
        public IMediator _mediator;
        public UserService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<UserWithoutPassViewModel> GetById(long id)
        {
            UserWithoutPassViewModel user = await _mediator.Send(new GetUserByIdQuery(id));
            return user;
        }
    }
}

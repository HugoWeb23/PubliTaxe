using System.Collections.Generic;
using MediatR;
using Taxes.Commands;
using System.Threading.Tasks;
using System.Threading;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Taxes.Entities;

namespace Taxes.Handlers
{
    public class DeleteImageHandler : IRequestHandler<DeleteImageCommand, bool>
    {
        public Context _context;

        public DeleteImageHandler(Context context)
        {
            _context = context;
        }
        public Task<bool> Handle(DeleteImageCommand request, CancellationToken cancellationToken)
        {
            PublicitesPhotos photo = _context.photos_publicites.FirstOrDefault(pub => pub.Photo == request.Image);
            if(photo != null)
            {
                _context.photos_publicites.Remove(photo);
                _context.SaveChanges();
                return Task.FromResult(true);
            } else
            {
                return Task.FromResult(false);
            }
        }
    }
}
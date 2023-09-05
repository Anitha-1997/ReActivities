using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDTO>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<List<UserActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.ActivityAttendees
                .Where(x => x.AppUser.UserName == request.Username)
                .OrderBy(d => d.Activity.Date)
                .ProjectTo<UserActivityDTO>(_mapper.ConfigurationProvider).AsQueryable();

                query = request.Predicate switch
                {
                    "past" => query.Where(x => x.Date <= DateTime.Now),
                    "hosting" => query.Where(x => x.HostUsername == request.Username),
                    _ => query.Where(x => x.Date >= DateTime.Now),
                };
                return Result<List<UserActivityDTO>>.Success(await query.ToListAsync());
            }
        }
    }
}
using Domain;
using MediatR;

namespace Application.Activities
{
    public class Create
    {
        public class Command: IRequest{
            public Activity Activity { get; set; }
        }

        public class Handler:IRequestHandler<>
    }
}
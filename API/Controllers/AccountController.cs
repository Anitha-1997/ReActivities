using API.DTOs;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        public AccountController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;

        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.FindByEmailAsync(loginDTO.Email);
            if (user == null)
                return Unauthorized();
            var result = await _userManager.CheckPasswordAsync(user, loginDTO.Password);
            if (result)
            {
                return new UserDTO
                {
                    DisplayName = user.DisplayName,
                    Token = "This is going to be the token",
                    UserName = user.UserName,
                    Image = null
                };
            }
            return Unauthorized();
        }
    }
}
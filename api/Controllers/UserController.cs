using Football_Management.API.Controllers.Base;
using Football_Management.API.Models.DTOs;
using Football_Management.API.Models.Entities;
using Football_Management.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Football_Management.API.Controllers;

[Route("api/v1/users")]
public class UserController
    : BaseController<User, UserDto, CreateUpdateUserDto, CreateUpdateUserDto>
{
    private readonly IUserService _userService;
    public UserController(
        IUserService userService,
        ILogger<UserController> logger
    ) : base(userService, logger)
    {
        _userService = userService;
    }
}
using AutoMapper;
using Football_Management.API.Models.DTOs;
using Football_Management.API.Models.Entities;

namespace Football_Management.API.Services;

public class FootballManagemenAutoMapper : Profile
{
    public FootballManagemenAutoMapper()
    {
        MapUser();
        MapRole();
        MapAuth();
        MapTournament();
    }
    private void MapUser()
    {
        CreateMap<User, UserDto>();
        CreateMap<CreateUpdateUserDto, User>()
          .ForMember(dest => dest.Password, opt => opt.Ignore());
    }
    private void MapRole()
    {
        CreateMap<Role, RoleDto>();
        CreateMap<CreateUpdateRoleDto, Role>();
    }
    private void MapAuth()
    {
        CreateMap<AuthRegisterRequest, User>()
            .ForMember(dest => dest.Password, opt => opt.Ignore())
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone));
    }
    private void MapTournament()
    {
        CreateMap<Tournament, TournamentDto>();
        CreateMap<CreateUpdateTournamentDto, Tournament>();
    }
}
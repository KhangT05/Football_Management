// import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete } from "tsoa";
// @Route("roles")
// @Tags("Roles")
// export class RoleController extends Controller {
//   constructor(private service: RoleService) {
//     super();
//   }
export {};
//   @Get("/")
//   async findAll(): Promise<SafeRole[]> {
//     return this.service.findAll();
//   }
//   @Get("{id}")
//   async findById(@Path() id: number): Promise<SafeRole> {
//     return this.service.findByIdOrFail(id);
//   }
//   @Post("/")
//   @SuccessResponse(201, "Created")
//   async create(@Body() body: CreateRoleDto): Promise<SafeRole> {
//     this.setStatus(201);
//     return this.service.create(body);
//   }
//   @Patch("{id}")
//   async update(
//     @Path() id: number,
//     @Body() body: UpdateRoleDto
//   ): Promise<SafeRole> {
//     return this.service.update(id, body);
//   }
//   @Delete("{id}")
//   @SuccessResponse(204, "Deleted")
//   async softDelete(@Path() id: number): Promise<void> {
//     this.setStatus(204);
//     return this.service.softDelete(id);
//   }
// }
//# sourceMappingURL=role.controller.js.map
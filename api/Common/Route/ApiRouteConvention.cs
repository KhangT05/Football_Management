using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
namespace DoAnTotNghiep.API.Common.Route;

public class ApiRouteConvention : IApplicationModelConvention
{
    private readonly AttributeRouteModel _prefix;
    public ApiRouteConvention(string prefix)
    {
        _prefix = new AttributeRouteModel(new RouteAttribute(prefix));
    }
    public void Apply(ApplicationModel application)
    {
        /// Kiểm tra tất cả các controller trong ứng dụng
        foreach (var controller in application.Controllers)
        {
            // Chỉ áp dụng cho controller có [ApiController]
            if (!controller.Attributes.OfType<ApiControllerAttribute>().Any())
            {
                continue;
                // Nếu controller đã có RouteAttribute, bỏ qua
            }
            // Nếu đã custom route thì bỏ qua
            if (controller.Attributes.Any(a => a is RouteAttribute))
                continue;

            foreach (var selector in controller.Selectors)
            {
                if (selector.AttributeRouteModel != null)
                {
                    // Ghép prefix vào route có sẵn
                    // [Route("players")] → api/v1/players
                    selector.AttributeRouteModel =
                     AttributeRouteModel.CombineAttributeRouteModel(_prefix, selector.AttributeRouteModel);

                }
                else
                {
                    // Nếu chưa có route, thêm prefix làm route
                    selector.AttributeRouteModel = _prefix;
                }
            }
        }
    }
}
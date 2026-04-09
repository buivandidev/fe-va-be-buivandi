using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace PhuongXa.API.Tests;

public class AdminRouteTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AdminRouteTests(WebApplicationFactory<Program> factory)
    {
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
        Environment.SetEnvironmentVariable("Jwt__Key", "PhuongXa_DevOnly_Jwt$ecretKey!@2026_Q3xZm9wKdLf7nRpT_Min64Chars!!");

        _factory = factory;
    }

    [Fact]
    public async Task Get_AdminArticles_QuanTri_KhongCoToken_TraVeUnauthorized()
    {
        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
        
        var response = await client.GetAsync("/api/admin/articles/admin");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}

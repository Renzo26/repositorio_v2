FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/PortfolioApi/PortfolioApi.csproj", "src/PortfolioApi/"]
RUN dotnet restore "src/PortfolioApi/PortfolioApi.csproj"
COPY . .
WORKDIR "/src/src/PortfolioApi"
RUN dotnet build "PortfolioApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PortfolioApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PortfolioApi.dll"]

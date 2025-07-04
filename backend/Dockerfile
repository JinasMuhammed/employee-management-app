# 1) Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj and restore
COPY *.sln .
COPY EmployeeManagement.API/*.csproj ./EmployeeManagement.API/
RUN dotnet restore

# copy everything and publish
COPY EmployeeManagement.API/. ./EmployeeManagement.API/
WORKDIR /src/EmployeeManagement.API
RUN dotnet publish -c Release -o /app/publish

# 2) Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "EmployeeManagement.API.dll"]
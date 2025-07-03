# Employee Management Application

**Angular version:** 19.2.15
**Backend (.NET) version:** .NET Core 8.0

This repository contains a full-stack Employee Management application:

* **Backend**: ASP.NET Core Web API (C#) with Entity Framework Core and Microsoft SQL Server.
* **Frontend**: Angular application (TypeScript) using Angular CLI and Angular Material.

---

## Table of Contents

* [Prerequisites](#prerequisites)
* [Repository Structure](#repository-structure)
* [Backend Setup](#backend-setup)
* [Frontend Setup](#frontend-setup)
* [Configuration](#configuration)
* [Running the Application](#running-the-application)
* [Database Migrations](#database-migrations)
* [Common Tasks](#common-tasks)
* [License](#license)

---

## Prerequisites

* [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
* Node.js v20.19.3 and npm ([https://nodejs.org/](https://nodejs.org/))
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* Microsoft SQL Server (2014+) or SQL Server Express

---

## Repository Structure

```
/ (repo root)
├── backend/                # ASP.NET Core Web API project
│   ├── EmployeeManagement.API.sln
│   ├── EmployeeManagement.API/
│   │   ├── Controllers/
│   │   ├── Data/
│   │   ├── Models/
│   │   ├── Migrations/
│   │   └── appsettings.json
│   └── .gitignore
├── frontend/               # Angular CLI project
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── .editorconfig
│   ├── src/
│   ├── .gitignore
└── .gitignore
```

---

## Backend Setup

1. Open the solution in Visual Studio 2022 or VS Code.
2. Update the connection string in `EmployeeManagement.API/appsettings.json`:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=EmployeeMgmt;Trusted_Connection=True;"
   }
   ```
3. In a terminal, apply EF Core migrations:

   ```bash
   cd backend/EmployeeManagement.API
   dotnet ef database update
   ```
4. Run the API:

   ```bash
   dotnet run
   ```

   The API will listen on `https://localhost:7016` by default.

---

## Frontend Setup

1. Navigate to the `frontend/` folder:

   ```bash
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Update the API base URL in `src/environments/environment.ts`:

   ```ts
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:7016/api'
   };
   ```
4. Serve the Angular app:

   ```bash
   ng serve
   ```

   By default this runs at `http://localhost:4200`.
   **Tip:** If your 4200 port is unavailable or you encounter issues, run instead:

   ```bash
   ng serve --port 5000
   ```

   The app will then be available at `http://localhost:5000`.

   ```
   The app will be available at `http://localhost:4200`.
   ```

---

## Configuration

* **Backend**: `appsettings.json` for connection strings and JWT settings. Use `appsettings.Development.json` for local secrets.
* **Frontend**: `src/environments/environment.ts` for API URL and feature flags.
* **CORS**: In your `Program.cs`, enable CORS to allow your frontend origin. For example:

  ```csharp
  // in builder
  builder.Services.AddCors(options =>
  {
    options.AddPolicy("LocalDev", policy =>
      policy.WithOrigins(
        "http://localhost:50000",  // port used by Swagger UI
        "http://localhost:4200"    // default Angular CLI port
      )
      .AllowAnyMethod()
      .AllowAnyHeader()
    );
  });

  var app = builder.Build();

  // before MapControllers()
  app.UseCors("LocalDev");
  ```

  > **Tip:** If your Angular app runs on a different port (e.g. `http://localhost:5000` or any other), just add that URL to the `WithOrigins(...)` list to avoid CORS errors.csharp
  > // in builder
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev",
        policy => policy
            .WithOrigins("http://localhost:5000", "http://localhost:4200")   
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});

  var app = builder.Build();

  // before MapControllers()
  app.UseCors("AllowLocalhost50000");

  ```


  ```
* **Backend**: `appsettings.json` for connection strings and JWT settings. Use `appsettings.Development.json` for local secrets.
* **Frontend**: `src/environments/environment.ts` for API URL and feature flags.

---

## Running the Application

1. Start the backend Web API.
2. Start the frontend Angular app.
3. Navigate in your browser to `http://localhost:4200` and log in with:

   * **Admin**: `admin@example.com` / `Admin123!`

---

## Database Migrations

To create a new EF Core migration:

```bash
cd backend/EmployeeManagement.API
dotnet ef migrations add MigrationName
dotnet ef database update
```

---

## Common Tasks

* **Add Employee**: Admin users can CRUD employees via the UI or Swagger.
* **View Profile**: Employees can log in to see their own details on the dashboard.
* **CORS**: If encountering CORS errors, ensure `app.UseCors(...)` is configured in `Program.cs`.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

# DriveApi

An ASP.NET Core Web API for managing users, folders, and files with secure JWT authentication and PostgreSQL.

## Features
- User registration and login (JWT authentication)
- Create, update, delete, and list folders (with subfolder support)
- Upload, download, update, delete, and list files
- All folder and file actions are scoped to the authenticated user
- Cascade delete for subfolders and files

## Getting Started

### Prerequisites
- .NET 8 SDK
- PostgreSQL

### Configuration
1. Update your `appsettings.json` and `appsettings.Development.json` with your PostgreSQL connection string and a secure JWT key:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=drive_api_dev;Username=postgres;Password=yourpassword"
   },
   "Jwt": {
     "Key": "super_secret_key_1234567890_ABCDEFGHJKLMNPQRS",
     "Issuer": "DriveApiIssuer"
   }
   ```
2. Run migrations:
   ```powershell
   dotnet ef database update --project DriveApi.csproj
   ```
3. Start the API:
   ```powershell
   dotnet run --project DriveApi.csproj
   ```

## API Usage

### 1. Register a New User
```
POST /api/auth/register
Content-Type: application/json
{
  "userName": "testuser",
  "email": "test@example.com",
  "password": "YourPassword123!"
}
```

### 2. Login and Get JWT Token
```
POST /api/auth/login
Content-Type: application/json
{
  "userName": "testuser",
  "password": "YourPassword123!"
}
```
- Use the returned `token` as a Bearer token for all secured endpoints.

### 3. Folder Endpoints (All require JWT)
- **Create Folder:**
  ```
  POST /api/folders
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "name": "MyFolder"
  }
  ```
- **Create Subfolder:**
  ```
  POST /api/folders
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "name": "SubFolder",
    "parentFolderId": 1
  }
  ```
- **List My Folders:**
  ```
  GET /api/folders/me
  Authorization: Bearer <token>
  ```
- **Get Folder by Id:**
  ```
  GET /api/folders/{id}
  Authorization: Bearer <token>
  ```
- **Update Folder:**
  ```
  PUT /api/folders/{id}
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "id": 1,
    "name": "UpdatedName"
  }
  ```
- **Delete Folder:**
  ```
  DELETE /api/folders/{id}
  Authorization: Bearer <token>
  ```

### 4. File Endpoints (All require JWT)
- **Upload File:**
  ```
  POST /api/files/upload
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "name": "file.txt",
    "content": [1,2,3,4], // byte array
    "folderId": 1
  }
  ```
- **List My Files:**
  ```
  GET /api/files/me
  Authorization: Bearer <token>
  ```
- **Get File by Id:**
  ```
  GET /api/files/{id}
  Authorization: Bearer <token>
  ```
- **Download File:**
  ```
  GET /api/files/download/{id}
  Authorization: Bearer <token>
  ```
- **Update File:**
  ```
  PUT /api/files/{id}
  Content-Type: application/json
  Authorization: Bearer <token>
  {
    "id": 1,
    "name": "newname.txt",
    "content": [1,2,3],
    "folderId": 1
  }
  ```
- **Delete File:**
  ```
  DELETE /api/files/{id}
  Authorization: Bearer <token>
  ```

## Notes
- All endpoints (except register/login) require a valid JWT Bearer token.
- Folders and files are always scoped to the authenticated user.
- Deleting a folder will also delete all its subfolders and files (cascade delete).

---

For more details, see the source code or use Swagger UI at `/swagger` when running the API in development mode.

---

Generated on 2025-05-20.

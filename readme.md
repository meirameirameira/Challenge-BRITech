# BRITech Challenge — User Management System

Sistema simples de **gestão de usuários** com autenticação **JWT** e **CRUD**, documentado com **Swagger** e consumido por um frontend em **Angular**.

## Stack

- **Backend**: ASP.NET Core (.NET 8), EF Core, SQL Server, JWT (Bearer), Swagger
- **Frontend**: Angular 18 (standalone), Router, HttpClient + Interceptor
- **Banco**: SQL Server (local/Container)
- **APIs**: REST

---

## Estrutura do Repositório

```
.
├─ api/
│  └─ UserMgmt.Api/
│     ├─ Controllers/          # AuthController, UsersController
│     ├─ Data/                 # AppDbContext, Migrations
│     ├─ Dtos/                 # LoginRequest, SignupRequest, ...
│     ├─ Models/               # User, PasswordResetToken
│     ├─ Security/             # JwtOptions, JwtToken
│     ├─ Services/             # AuthService, UsersService
│     ├─ Properties/           # launchSettings.json
│     ├─ appsettings.json
│     └─ Program.cs
└─ web/                        # Frontend Angular
   ├─ src/
   │  ├─ app/
   │  │  ├─ app.component.ts
   │  │  ├─ app.routes.ts
   │  │  └─ core/              # auth.service.ts, users.service.ts, ...
   │  │     └─ ...
   │  ├─ environments/
   │  │  ├─ environment.ts
   │  │  └─ environment.prod.ts
   │  ├─ styles.css
   │  └─ index.html
   ├─ angular.json
   └─ package.json
```

---

## Pré-requisitos

- **.NET SDK 8+**
- **Angular CLI** `npm i -g @angular/cli`
- **SQL Server** (local)
- **dotnet-ef** (migrations):

---

## Configuração do Backend

### 1) `appsettings.json`

No diretório `api/UserMgmt.Api`, ajuste **conexão** e **JWT**:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=UserMgmt;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Issuer": "UserMgmt",
    "Audience": "UserMgmtAudience",
    "Key": "troque-por-uma-chave-segura-de-32+caracteres"
  },
  "Logging": { "LogLevel": { "Default": "Information" } },
  "AllowedHosts": "*"
}
```

### 2) Criar/Atualizar o Banco

```bash
cd api/UserMgmt.Api
dotnet ef database update
```

### 3) CORS

Garanta no `Program.cs`:

```csharp
var myCors = "_myCors";
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(myCors, p => p
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod());
});

var app = builder.Build();
app.UseCors(myCors);
```

### 4) Rodar a API

```bash
cd api/UserMgmt.Api
dotnet run
```

> Anote a porta HTTP exibida (ex.: `http://localhost:5139`).  
> **Swagger**: `http://localhost:5139/swagger`.

---

## Configuração do Frontend

### 1) API Base URL

Edite `web/src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5139' // porta da sua API
};
```

### 2) Rodar o Angular

```bash
cd web
npm install
ng serve -o
```

Acesse `http://localhost:4200`.

---

## Fluxo de Autenticação e CRUD

1. **Signup**  
   - `POST /auth/signup`  
   - Front: tela **/signup**.

2. **Login**  
   - `POST /auth/login` → retorna `{ accessToken, user }`.  
   - Front salva `auth_token` no `localStorage`.  
   - **Interceptor** injeta `Authorization: Bearer <token>`.

3. **Listar usuários**  
   - `GET /users/ListUsers` (Bearer obrigatório).  
   - Tela: **/users**, exibe `createdAt`.

4. **Criar usuário**  
   - `POST /users/AddUser`.

5. **Editar usuário**  
   - `PUT /users/EditUsers/{id}`.

6. **Remover usuário**  
   - `DELETE /users/RemoveUser/{id}`.

7. **Esqueci a senha / Redefinir**  
   - `POST /auth/forgot`  (retorna `devToken`).  
   - `POST /auth/Resetpwd` `{ token, newPassword }`.

> **Swagger**: faça login, clique em **Authorize** (cadeado) e cole o Bearer para testar `/users/*`.

---

## Como Validar Rápido

1) **/signup** → cria um usuário.  
2) **/login** → recebe token, redireciona para **/users**.  
3) **/users**:
   - **Add User** → cria.
   - **Edit** → altera e salva.
   - **Remove** → exclui.
4) **/forgot** → informe e-mail (retorna `devToken`).  
5) **/reset** → token + nova senha → depois **login** com a nova senha.

---

## Endpoints

**Auth (público)**
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/forgot`
- `POST /auth/Resetpwd`

**Users (JWT)**
- `GET    /users/ListUsers`
- `POST   /users/AddUser`
- `PUT    /users/EditUsers/{id}`
- `DELETE /users/RemoveUser/{id}`

---

## Notas de Implementação

- **JWT**: `JwtOptions` (Issuer, Audience, Key) em `appsettings.json`. Expiração ~1h.  
- **Senhas**: armazenadas com **hash seguro** (BCrypt).  
- **CreatedAt**: salvo em **UTC** no backend; o Angular formata para o fuso local.  
- **CORS**: `UseCors` antes de `UseAuthentication/UseAuthorization`.  
- **Angular**:
  - **Interceptor** adiciona `Authorization: Bearer`.
  - **AuthGuard** protege `/users/*`.
  - **styles.css** centraliza formulários e estiliza navbar/tabelas/botões.

---

## Comandos Úteis

**Backend**
```bash
# rodar
cd api/UserMgmt.Api
dotnet run

# aplicar migrations
dotnet ef database update

```

**Frontend**
```bash
cd web
npm install
ng serve -o

# build de produção
ng build
```

---

## 📜 Licença

Uso educacional para o desafio BRITech.

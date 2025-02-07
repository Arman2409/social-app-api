# Social-app-api 
  
## 📖 Social application API

#### Running the project locally

1. Install Node.js and npm on your computer.
2. Clone this repository with command
```bash
 git clone https://github.com/Arman2409/social-app-api.git
```
3. Install dependencies with command
```bash
  npm install
```
 or 
```bash
  pnpm install
```
4. Add environment variables
- DATABASE_URL: Your PostgreSQL Database url
- JWT_SECRET: Your Jwt secret

5. After you have functional PostgreSQL database's URL in your .env file you can run this commands to set up the database
```bash
  npx prisma generate
  npx prisma migrate dev
```

6. Now you are done to run the project
```bash
  npm run start:dev
```

#### Structure 

/prisma      # Database configuration and schemas  
/src         # TypeScript codebase  
&nbsp;/dto       # DTOs for validation  
&nbsp;/configs   # Different configuration  
&nbsp;/modules   # Core modules  
&nbsp;&nbsp;/auth    # Handles functionalities like login and register  
&nbsp;&nbsp;/users   # Handles functionalities like user search  
&nbsp;&nbsp;/friends # Handles functionalities like sending friend &nbsp;&nbsp; requests, accepting them,  etc.  
&nbsp;/tools     # Utility services, guards, and other helpers  

#### Tech stack

> Programming languages: JavaScript, TypeScript 
> Framework: Nest.js  
> Database and ORM:  PostgreSQL, Prisma  
> Validation and security:  Class Validator, JWT, Bcrypt  
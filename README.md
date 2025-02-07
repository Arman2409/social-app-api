<h1 style="color: #4CAF50; text-align: center; border-bottom: 3px solid #4CAF50; padding-bottom: 10px;">Social-app-api</h1>
  
<h2 style="color: #FF5722; text-align: center; padding-bottom: 5px;">📖 Social application API</h3>

<h3 style="color: #03A9F4; text-align: center;  border-bottom: 1px solid #4CAF50;">Controllers</h3> 

<h4>🧭 Controller: / </h4>

#### 📌 Endpoints:

- **Path**: 
- **Method**: Get



<h4>🧭 Controller: /auth </h4>

#### 📌 Endpoints:

- **Path**: 'register'
- **Method**: Post
- **Entries**:
  
    - **Name**: 
      - **Type**: registerDto
      - **Source**: body 
    

,- **Path**: 'login'
- **Method**: Post
- **Entries**:
  
    - **Name**: 
      - **Type**: loginDto
      - **Source**: body 
    



<h4>🧭 Controller: /friends </h4>

#### 📌 Endpoints:

- **Path**: ""
- **Method**: Get

,- **Path**: "requests"
- **Method**: Get

,- **Path**: "add"
- **Method**: Get
- **Entries**:
  
    - **Name**: "userId"
      - **Type**: userId
      - **Source**: query 
    

,- **Path**: "accept"
- **Method**: Get
- **Entries**:
  
    - **Name**: "userId"
      - **Type**: userId
      - **Source**: query 
    



<h4>🧭 Controller: /users </h4>

#### 📌 Endpoints:

- **Path**: "search"
- **Method**: Get
- **Entries**:
  
    - **Name**: "firstName"
      - **Type**: firstName
      - **Source**: query 
    

    - **Name**: "lastName"
      - **Type**: lastName
      - **Source**: query 
    

    - **Name**: "email"
      - **Type**: email
      - **Source**: query 
    

    - **Name**: "age"
      - **Type**: age
      - **Source**: query 
    



<h3 style="color: #03A9F4; text-align: center;  border-bottom: 1px solid #4CAF50;">🌐 Environment variables</h3>

- DATABASE_URL: Your Database url
- JWT_SECRET: Your Jwt secret
  
<h3 style="color: #03A9F4; text-align: center;  border-bottom: 1px solid #4CAF50;">Installation</h3>

```bash
 npm run install
```,
<h3 style="color: #03A9F4; text-align: center;  border-bottom: 1px solid #4CAF50;">Running</h3>

```bash
 # development
 npm run start
 # watch mode
 npm run start:dev
```
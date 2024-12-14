# User Authentication Server

Welcome to the User Authentication Server project! This server is built with Node.js and Express, providing robust endpoints for user registration, login, and authentication.

## Features

- **User Registration:** Secure registration with email and password.
- **User Login:** Authenticate users with email and password.
- **Token-based Authentication:** Secure endpoints using JWT.
- **Password Hashing:** Protect passwords with bcrypt.

## Requirements

- **Node.js:** Ensure you have Node.js installed.
- **npm:** Node package manager for managing dependencies.

## Installation

To get started with the project, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/aryansaud-80/Authenthication.git
```

2. **Navigate to the project directory:**

```bash
cd server
```

3. **Install the dependencies:**

```bash
npm install
```

## Configuration

Set up your environment variables by creating a `.env` file in the root directory with the following content:

```
CORS_ORIGIN = http://localhost:5000
PORT = 5000

MONGODB_URI = your mongodb URI

REFRESH_TOKEN_SECRET= your secret key
REFRESH_TOKEN_EXPIRES_IN= 7d
ACCESS_TOKEN_SECRET= your secret key
ACCESS_TOKEN_EXPIRES_IN= 15m

EMAIL= your email address
PASSWORD= app password
```

## Usage

Start the server with:

```bash
npm run server
```

The server will be running on `http://localhost:3000`.

## API Endpoints

### Register a New User

- **URL:** `/api/v1/auth/signup`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "username": "username",
    "email": "user@example.com",
    "password": "password123"
    "fullname": "full name"
  }
  ```

### Login a User

- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Get User Profile

- **URL:** `/api/v1/user/get-user-data`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    
  }
  ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

We welcome contributions! Feel free to open an issue or submit a pull request.

## Contact

For any inquiries, please contact[aryansaud080@gmail.com](mailto:aryansaud080@gmail.com).

Thank you for using the User Authentication Server!

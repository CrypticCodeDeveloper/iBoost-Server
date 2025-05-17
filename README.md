
# iBoost Server

iBoost Server is a backend application designed to manage service orders, platforms, user wallets, and user accounts. It provides APIs for creating, updating, and retrieving service orders, managing platforms, handling wallet transactions, and managing user data.

## Features

- **Service Orders**: Create, update, and retrieve service orders with statuses like pending, approved, and rejected.
- **Platform Management**: Add, edit, and delete platforms with associated services and pricing.
- **Wallet Management**: Handle user wallet balances and transactions.
- **Order Totals**: Retrieve the total amounts for approved and pending orders.
- **User Management**: Retrieve user details, wallets, and transaction history.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: Database for storing service orders, platforms, wallets, and user data.
- **Mongoose**: ODM for MongoDB.
- **dotenv**: For managing environment variables.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CrypticCodeDeveloper/iBoost-Server.git
   cd iboost_server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   PORT=5000
   MONGODB_CONNECTION_STRING=your_mongodb_connection_string
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   JWT_SECRET=your_secret_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Service Orders

- **Create a New Service Order**
  - `POST /api/orders`
  - Request Body: `{ platform, service, quantity, socialLink, totalAmount }`

- **Update Service Order Status**
  - `PATCH /api/orders/:id`
  - Request Body: `{ status }`

- **Get All Service Orders**
  - `GET /api/orders`

- **Get Pending Orders**
  - `GET /api/orders/pending`

- **Get Order Totals**
  - `GET /api/orders/totals`
  - Response: `{ approvedTotal, pendingTotal }`

### Platforms

- **Get All Platforms**
  - `GET /api/platforms`

- **Create a Platform**
  - `POST /api/platforms`
  - Request Body: `{ name, services, price }`

- **Edit a Platform**
  - `PATCH /api/platforms/:id`
  - Request Body: `{ name, services, price }`

- **Delete a Platform**
  - `DELETE /api/platforms/:id`

### Wallets

- **Get Wallet Details**
  - `GET /api/wallets/:userId`

- **Top Up Wallet**
  - `POST /api/wallets/topup`
  - Request Body: `{ amount }`

### Users

- **Get All Users**
  - `GET /api/users`
  - Response: Returns a list of all users sorted by creation date.

- **Get User by ID**
  - `GET /api/users/:id`
  - Response: Returns details of a specific user by their ID.

- **Get User Wallet**
  - `GET /api/users/wallet/:id`
  - Response: Returns the wallet details of a specific user.

- **Get User Transactions**
  - `GET /api/users/transaction/:id`
  - Response: Returns the transaction history of a specific user.

## Project Structure

```
iboost_server/
├── controllers/
│   ├── orderedServicesController.js
│   ├── platformController.js
│   ├── walletController.js
│   ├── usersController.js
├── models/
│   ├── orderedServices.js
│   ├── platformModel.js
│   ├── walletModel.js
│   ├── userModel.js
├── routes/
│   ├── orders.js
│   ├── platforms.js
│   ├── wallets.js
│   ├── users.js
├── app.js
├── server.js
├── .env
├── package.json
└── README.md
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For questions or support, please contact crypticcodetechnologies@gmail.com.


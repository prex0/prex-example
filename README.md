# Prex Example App

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

```
git clone https://github.com/prex0/prex-example.git
cd prex-example
npm i
```

Register with Prex and create an application on the dashboard.
Copy the environment variables provided by Prex into a .env.local file in the root directory of your project.

### Start Application

```
npm start
```

## Development

Start the application:

```
npm start
```

Build

```
npm run build
```

### Advanced

You can modify parameters to change the ERC20 token and the expiration time for link validity.
Adjusting these values allows you to customize the token and manage how long links remain valid.
see [constants.ts](src/constants.ts)

```typescript
// Chain ID
export const CHAIN_ID = 421614

// ERC20 Token Address
export const ERC20_ADDRESS = import.meta.env.VITE_COIN

// Token name
export const TOKEN_NAME = 'DemoCoin'

// Symbol name
export const UNIT_NAME = 'demoCoin'

// Expiration time for link validity (24 hours)
export const TIME_UNTIL_EXPIRATION = 60 * 60 * 24

// Advanced

export const MAX_FEE_PER_GAS = '0.23'
export const MAX_PRIORITY_FEE_PER_GAS = '0.11'
```

## Deployment

To deploy the application, follow these steps:

Build the Application:

Ensure that your environment is properly set up and build the application using:

```bash
npm run build
```

### Deploy to Your Hosting Service:

Deploy the contents of the build directory to your chosen hosting service. This could be a platform like Vercel, Netlify, or any other web hosting service.

### Prex Configuration

Before going live, make sure to configure Prex with the following:

- Allowed Origins: Register your application’s URL as an allowed origin in the Prex dashboard to ensure proper communication between your app and Prex.
- ERC20 Token Address: Add the ERC20 token address to Prex to enable integration with your application. This step is crucial for the application to interact with the specified ERC20 token.

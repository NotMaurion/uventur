# Uventur - P2P Outdoor Gear Marketplace

Uventur is a peer-to-peer marketplace platform that connects people who own outdoor and adventure equipment with people who want to rent it temporarily in specific locations.

## Features

- User registration and login (email + social login)
- Create and manage listings with photos, descriptions, availability calendar, and location
- Search and filter listings by location, type of gear, dates, and price
- Booking and payment system
- User profiles with reviews and ratings
- Messaging system between users
- Admin dashboard to manage users, listings, and transactions

## Tech Stack

- **Frontend**: React, Material-UI, Formik, Yup
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Maps**: Google Maps API
- **Payments**: Stripe
- **Hosting**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Google Maps API key
- Stripe account (for payments)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/uventur.git
   cd uventur
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```
   npm start
   ```

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Set up Firebase Storage
5. Deploy Firestore and Storage rules:
   ```
   ./deploy-rules.sh
   ```

## Deployment

1. Build the production version:
   ```
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```
   firebase deploy
   ```

## Project Structure

```
uventur/
├── public/                 # Static files
├── src/                    # Source files
│   ├── components/         # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components
│   │   ├── listing/        # Listing components
│   │   ├── profile/        # Profile components
│   │   ├── search/         # Search components
│   │   ├── booking/        # Booking components
│   │   └── messaging/      # Messaging components
│   ├── context/            # React context
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── assets/             # Images, fonts, etc.
│   ├── App.js              # Main App component
│   ├── index.js            # Entry point
│   └── firebase.js         # Firebase configuration
├── .env                    # Environment variables
├── firebase.json           # Firebase configuration
├── firestore.rules         # Firestore security rules
├── storage.rules           # Storage security rules
└── package.json            # Dependencies and scripts
```

## Security Rules

The application uses Firebase Security Rules to protect data:

- **Firestore Rules**: Control access to the database
- **Storage Rules**: Control access to uploaded files

To deploy the rules:
```
./deploy-rules.sh
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase for backend services
- Material-UI for UI components
- React community for libraries and tools

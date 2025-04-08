#!/bin/bash

# Deploy Firestore rules
echo "Deploying Firestore rules..."
firebase deploy --only firestore:rules

# Deploy Storage rules
echo "Deploying Storage rules..."
firebase deploy --only storage

echo "Rules deployment complete!" 
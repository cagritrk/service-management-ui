#!/bin/bash

# Check Node.js version
REQUIRED_NODE="v18.19.1"
CURRENT_NODE=$(node -v)

if [[ "$CURRENT_NODE" < "$REQUIRED_NODE" ]]; then
  echo "Error: Node.js version $REQUIRED_NODE or higher is required (found $CURRENT_NODE)"
  exit 1
fi

# Check npm is available
if ! command -v npm &> /dev/null; then
  echo "Error: npm is not installed"
  exit 1
fi

echo "Installing dependencies..."
npm install

echo "Starting development server..."
npm start
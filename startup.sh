#!/bin/bash

# Navigate to the project directory (optional, if script is not in root)
# cd /path/to/your/project

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies. Exiting."
  exit 1
fi

# Create database directory if it doesn't exist (server.js will create the file)
mkdir -p database

# Set the port for the application
export PORT=9000

echo "Starting the application on port $PORT..."

# Run the application
# The server.js will be configured to serve static files from 'public'
# and listen on the port specified by the PORT environment variable.
npm start

# Check if the server started successfully
if [ $? -ne 0 ]; then
  echo "Failed to start the server. Please check src/server.js and logs."
  exit 1
fi

echo "hueneu website should now be accessible on http://localhost:$PORT"

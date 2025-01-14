#!/bin/bash
# Run create_database.py
echo "Running create_database.py..."
python create_database.py

# Start the Flask app
echo "Starting Flask app..."
python app.py

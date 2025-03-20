#!/bin/bash

# Activate virtual environment if it exists
if [ -d "cfc_env" ]; then
    source cfc_env/bin/activate
fi

# Run the database initialization script
python ../api/scripts/init_db.py 
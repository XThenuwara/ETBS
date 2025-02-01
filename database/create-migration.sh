#!/bin/bash

# Check if migration name is provided
if [ -z "$1" ]
then
    echo "Please provide a migration name"
    echo "Usage: ./create-migration.sh create-user-table"
    exit 1
fi

mkdir -p /migrations

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CLASSNAME=$(echo "$1" | sed -r 's/(^|-)([a-z])/\_\2/g')
FILENAME="./migrations/${TIMESTAMP}-$1.ts"

# Use the converted class name in sed
sed "s/MigrationName/${CLASSNAME}_${TIMESTAMP}/g" ./migration.template.ts > "$FILENAME"

echo "Created migration file: $FILENAME"
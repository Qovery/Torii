#!/usr/bin/env bash


# This script is a dumb example of a script that can be run by the backend.
# It is not meant to be run by the user, but rather by the backend.
set -e

echo "This is a superrrrr powerful script!!!! It does nothing but print this message."

echo "The arguments passed to this script are: $@"

echo "Sleeping for 1 second..."

sleep 1

echo "The environment variables set for this script are:"
env

echo "The current working directory is: $(pwd)"

exit 1

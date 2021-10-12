#!/bin/bash
# Generate all release notes changelog for a repo
# Author: Rodrigo Fuentes

# Repo URL to base links off of
REPOSITORY_URL=https://github.com/GlobalFishingWatch/frontend

TAG_PREFIX="@globalfishingwatchapp/vessel-history@"

# Get a list of all tags in reverse order
# Assumes the tags are in version format like v1.2.3
GIT_TAGS=$(git tag -l --sort=-version:refname | grep $TAG_PREFIX)

# CHANGELOG=""

TEMPLATE=\
'---
{{.tagName}}

# {{.name}}

{{.body}}
'
# Loop over each TAG and look for its release notes
for TAG in $GIT_TAGS; do
	# Get the release view formatted
	RELEASE_NOTES=$(gh release view ${TAG} --json tagName,name,body --template "$TEMPLATE")
  echo -e \
  "$RELEASE_NOTES

  "
done

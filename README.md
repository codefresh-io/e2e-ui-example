# UI Automated Tests

A Codefresh onboarding tutorial.

This project has the following tests:

1. Login to Codefresh using github/bitbucket accounts
2. Logout from Codefresh

These tests was written on the framework protractor.js

## Setting up the basic build

1. Add a new project and select the `e2e-ui-example` repository.
2. Select to use own Dockerfile then click the `BUILD` button.

Now the image has been created, let's create the new composition for added service.

## Compositions

The content of the composition described in the file docker-compose.yml

Browse to the tab `Compositions` and

1. Add a new composition.
2. Enter a name such as `e2e-ui-composition`.
3. Paste the following text into the code editor
(you should replace all the variables which has symbol $) and save composition:

```yml
version: '2'
services:
  test:
    image: $DOCKER_HUB_USERNAME/$IMAGE_NAME:master
    depends_on:
      - selenium
    volumes:
      - /dev/shm:/dev/shm
    environment:
      GITHUB_ACCOUNT: $GITHUB_ACCOUNT
      GITHUB_PASSWORD: $GITHUB_PASSWORD
      URL: 'https://codefresh.io'
      BITBUCKET_ACCOUNT: $BITBUCKET_ACCOUNT
      BITBUCKET_PASSWORD: $BITBUCKET_PASSWORD
  selenium:
    image: selenium/standalone-chrome:2.46.0
    ports:
      - 4444:4444
```

## Unit testing
Now we've got a composition all set up, let's return to the build settings and add an

1. In the 'Unit Test Script' section enter:
```
/protractor/run-tests.sh
```
2. Then under the editor 'Unit Test Script', activate 'Run tests with composition' and select the created composition `e2e-ui-composition`
3. Click `Save` and build the project.

In the log of process "Running unit tests", we can see which actions the test makes.

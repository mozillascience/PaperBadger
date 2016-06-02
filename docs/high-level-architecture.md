# High level Architecture


Paper Badger is both an API and a UI, and it also integrates and uses data from different sources.
The following image contains the main building blocks of the system:

![Badges--Proposed-Workflow_1_.pdf](Badges--Proposed-Workflow_1_.pdf?raw=true)

It is recommended to keep an eye on the [Roadmap #17](https://github.com/mozillascience/PaperBadger/issues/17) to see changes that may affect this document in the near future.

## Main building blocks

The main building blocks of the system are as follows.

Integration with :
  - ORCID
  - A badges Server (currently badgekit-api; being migrated to badgr-server, see [#159](https://github.com/mozillascience/PaperBadger/issues/159))

## Flows
Flows for the system are as stated in issue [#1](https://github.com/mozillascience/PaperBadger/issues/1)

## Journal submission
This is a feature that is currently done through a form, but needs to be automated.
Progress can be followed in [#160](https://github.com/mozillascience/PaperBadger/issues/160)

# The Stack

Paper Badger is written in nodejs, using expressjs, MongoDB, Redis, and reactjs for the front end.

The data for Badges comes from API calls to badgekit-api, through badgekit-api-client.

## ORCID integration
[Setup details](orcid-setup.md) to integrate with ORCID.

## Badges integration
A badges server has to be available so that Paper Badger can push and pull data from. The file [default.env](../default.env)
contains the endpoint for the currently available _badgekit-api_ server.



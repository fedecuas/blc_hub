# Getting Started Directive

This project follows a 3-layer architecture as defined in [AGENTS.md](../AGENTS.md).

## System Portals

The BLC Management System consists of six specialized portals:
- **Project & Task Portal**: Advanced workflow and status tracking.
- **Operations Dashboard**: Real-time service health and system metrics.
- **Client Portal**: Dedicated interface for project visibility and feedback.
- **Collaborator Hub**: Personalized task lists and capacity management.
- **Customer CRM**: Lead management and visual deal pipeline.
- **ERP System**: Integrated resource planning and financial tracking.

## Adding a New Tool

1. **Plan**: Define the directive in `directives/`.
2. **Execute**: Write the deterministic logic in `execution/`.
3. **Orchestrate**: Use an agent to bridge the two.

## Principles

- **Deterministic Execution**: Complex logic belongs in scripts.
- **Self-Annealing**: Update directives with learnings from failures.
- **Cloud First**: Final deliverables should be in the cloud (Sheets, Slides, etc.).

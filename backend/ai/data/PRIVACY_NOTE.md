# AI Data Privacy Note

This folder stores derived datasets for AI experiments.

Rules:
- Do not store passwords, tokens, card data, or full addresses.
- Only export minimal fields needed for model training.
- Prefer pseudonymous identifiers (`userId`, `sessionId`) over personal identity fields.
- Keep raw exports internal to development environments.
- Remove or rotate old exports regularly.

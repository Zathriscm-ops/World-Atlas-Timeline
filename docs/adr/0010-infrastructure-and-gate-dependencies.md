# ADR 0010: Minimal AWS architecture and executable future dependencies
Status: Accepted architecture decision, M007, 2026-09-14. No cloud changes authorized or performed by this ADR.

Use S3 plus CloudFront for web/immutable public assets; API Gateway plus one Lambda application for reads; private RDS PostgreSQL/PostGIS for persistence. Terraform owns durable resources and environment configuration. Separate local, development, staging and production with separate secrets/state and strict access. Initial paid environments are sized in M081, not automatically all kept running.

Avoid NAT Gateway, RDS Proxy and provisioned concurrency by default; each needs a measured requirement and cost estimate. Lambda's network access to secrets and database must be designed explicitly (for example appropriate VPC endpoints); do not solve it with a public database. Use encryption, TLS, scoped runtime roles, capped concurrency, finite log retention, parameterized SQL and managed secrets from creation. Backups/deletion protection are required when valuable data first exists. M088/M089 and operations modules add full permission, rotation and restore evidence; they do not postpone basic controls.

Terraform remote state is sensitive: restricted encrypted storage, versioning and locking, separate environment keys, protected plan artifacts and no secrets in Git. [Terraform remote-state guidance](https://developer.hashicorp.com/terraform/language/state/remote).

## Explicit future sequencing exception

The original text remains preserved. The following dependency order supersedes numeric execution only for this group, after M084 PASS and M081 environment/cost decisions:
1. M087: private RDS/PostGIS. Verify an application database adapter connects through an approved private test runner or audited private tunnel, spatial tests pass and the internet cannot reach it.
2. M086: Lambda runtime using that database. Compare local and Lambda contracts via direct invocation/private staging access.
3. M085: API Gateway integration. Run the existing full staging HTTP/API/database contract suite.
4. Resume M088 in normal order after all three PASS.

M087 is allowed to begin after M084, M086 after M087, and M085 after M086. This is the sole approved numeric-order exception; it changes prerequisites, **not gates**. It resolves DEP-08. No stub may satisfy M085 or M086. A future source/runtime defect blocks its dependent gate normally.

DEP-07: M082 creates a minimal tracked budget bootstrap using a checked-in resource specification and repeatable commands, with IDs and confirmed test notification. M083 imports those exact resources into Terraform and requires a no-unexpected-change plan. This permits budget protection before general infrastructure and avoids unmanaged permanent resources.

DEP-09: baseline IAM/secrets/network/backup controls above apply at first resource creation. M081 must choose connection/secret access paths and price them before deployment. DEP-02/03 are bounded fixture milestones with later integration as ADR 0008 specifies. These decisions do not authorize deployment or advance future ledger states.

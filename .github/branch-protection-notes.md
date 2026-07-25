# TokenSlash Branch Protection & Merge Rules
*Documented by Member D (Experience & Delivery Lead) for the 15-Hour War Room.*

---

## 1. Branch Hierarchy

```
main        <-- PRODUCTION / DEMO READY. Only receives merges from develop at official Checkpoints (H6:00, H10:00, H13:00).
develop     <-- INTEGRATION BRANCH. Everyone's feature branches merge here first. Must always build and pass tests.
feature/*   <-- INDIVIDUAL WORK. Branch per module (e.g., feature/token-estimator, feature/dashboard).
```

## 2. Gatekeeping & Merge Policy

1. **No Direct Pushes**: Never push directly to `main` or `develop`. All changes must go through a Pull Request against `develop`.
2. **Merge Gatekeeper**: Member D is the assigned gatekeeper for merging PRs into `develop` and promoting `develop` to `main`. This prevents chaotic concurrent merge conflicts and ensures integration integrity.
3. **Cross-Review Requirement**: PRs must be reviewed by at least one team member from a different role:
   - Member A reviews Member C's PRs
   - Member C reviews Member B's PRs
   - Member B reviews Member D's PRs
   - Member D reviews Member A's PRs
4. **Contract Invariance**: `packages/server/src/shared/types.ts` is the shared contract. After H0:30, **only additive changes** (new optional properties) are permitted without a team sync. No renames or deletions.

## 3. Pre-Merge Verification Checklist

Before approving or merging any PR into `develop`, run:
```bash
# 1. Run unit tests across the workspace
npm test

# 2. Verify end-to-end smoke test passes (backend)
npm run smoke -w @tokenslash/server

# 3. Verify web dashboard builds cleanly (once frontend lands)
npm run build -w @tokenslash/web
```

## 4. Resolving Merge Conflicts

Because file ownership is cleanly divided by module (Part 2 of Blueprint), logical conflicts should be rare.
If a conflict occurs in `package.json` or `app.module.ts`:
1. Do not overwrite a teammate's tool registration or dependency.
2. Accept both changes cleanly in your local feature branch first:
   ```bash
   git checkout feature/your-module
   git fetch origin
   git merge origin/develop
   # resolve conflicts manually, then test and push
   ```
3. Re-run `npm install` after resolving dependency conflicts.

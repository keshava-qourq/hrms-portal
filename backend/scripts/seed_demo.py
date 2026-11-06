"""Seed the demo accounts into the configured database (see app/demo_seed.py for the list).

Run it from the backend directory:  .venv/bin/python scripts/seed_demo.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app import audit  # noqa: E402,F401 -- registers the audit_logs table
from app.authz import ROLE_NAMES  # noqa: E402
from app.database import Base, engine  # noqa: E402
from app.demo_seed import ACCOUNTS, DEMO_PASSWORD, seed_demo_accounts  # noqa: E402

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_demo_accounts()
    print(f"Seeded {len(ACCOUNTS)} demo accounts (password: {DEMO_PASSWORD}):")
    for email, _, _, codes, _ in ACCOUNTS:
        print(f"  {email:<22} {', '.join(ROLE_NAMES[c] for c in codes)}")

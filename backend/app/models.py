"""SQLAlchemy models.

Only the tables sign-in needs: the portal account, the fixed role catalogue and
the link between them. Everything else in the approved data model arrives with
the ticket that owns it.
"""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, SmallInteger, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

__all__ = ["Base", "User", "Role", "UserRole"]


class Role(Base):
    """One of the five fixed role codes."""

    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(SmallInteger, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(64), nullable=False)


class UserRole(Base):
    """Which roles an account holds."""

    __tablename__ = "user_roles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    role_id: Mapped[int] = mapped_column(
        SmallInteger, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True
    )
    granted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    role: Mapped[Role] = relationship(lazy="joined")


class User(Base):
    """A portal account.

    `password_hash` holds a salted one-way bcrypt digest and nothing else: the
    plain password is never stored on this row, nor anywhere else (NFR-001).
    """

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    # The employees table is owned by another ticket; the column is kept here so the
    # link exists, and that ticket adds the foreign key in its own migration.
    employee_id: Mapped[uuid.UUID | None] = mapped_column(Uuid, nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    must_change_password: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    failed_login_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    locked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    roles: Mapped[list[UserRole]] = relationship(lazy="selectin", cascade="all, delete-orphan")

    @property
    def role_codes(self) -> list[str]:
        return sorted(link.role.code for link in self.roles)

    @property
    def display_name(self) -> str:
        """A name to greet the user with until the employee record supplies one."""
        return self.email.split("@", 1)[0]

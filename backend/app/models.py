"""SQLAlchemy models.

Only the tables sign-in needs: the portal account, the fixed role catalogue and
the link between them. Everything else in the approved data model arrives with
the ticket that owns it.
"""

import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    SmallInteger,
    String,
    Uuid,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

__all__ = ["Base", "User", "Role", "UserRole", "Department", "Employee"]


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


class Department(Base):
    """A single shared department list; no country or entity scoping (NFR-022)."""

    __tablename__ = "departments"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class Employee(Base):
    """An employee record, linked to a department and (optionally) a reporting manager."""

    __tablename__ = "employees"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    employee_number: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    work_email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    mobile_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    personal_contact: Mapped[str | None] = mapped_column(String(255), nullable=True)
    department_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("departments.id"), nullable=False, index=True
    )
    reporting_manager_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("employees.id"), nullable=True, index=True
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_erased: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    erased_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

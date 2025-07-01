"""Make cover_letter nullable in job_applications table

Revision ID: make_cover_letter_nullable
Revises: add_passport_fields_to_applications
Create Date: 2025-07-01 19:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'make_cover_letter_nullable'
down_revision = 'add_passport_fields_to_applications'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Make cover_letter column nullable
    op.alter_column('job_applications', 'cover_letter',
                    existing_type=sa.TEXT(),
                    nullable=True)


def downgrade() -> None:
    # Make cover_letter column not nullable (reverse operation)
    op.alter_column('job_applications', 'cover_letter',
                    existing_type=sa.TEXT(),
                    nullable=False)

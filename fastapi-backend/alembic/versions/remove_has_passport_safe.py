"""remove has_passport column safely

Revision ID: remove_has_passport_safe
Revises: add_passport_required_to_jobs
Create Date: 2024-02-18 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'remove_has_passport_safe'
down_revision = 'add_passport_required_to_jobs'
branch_labels = None
depends_on = None


def upgrade():
    # First, ensure passport_number exists
    try:
        op.add_column('job_applications', sa.Column('passport_number', sa.String(), nullable=True))
    except Exception:
        pass  # Column might already exist, that's fine

    # Then remove has_passport column
    try:
        op.drop_column('job_applications', 'has_passport')
    except Exception:
        pass  # Column might not exist, that's fine


def downgrade():
    # Add back has_passport column if needed
    try:
        op.add_column('job_applications', sa.Column('has_passport', sa.Boolean(), nullable=True))
    except Exception:
        pass  # Column might already exist, that's fine 
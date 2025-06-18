"""add passport_required to jobs

Revision ID: add_passport_required_to_jobs
Revises: add_passport_number
Create Date: 2024-03-21 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_passport_required_to_jobs'
down_revision = 'add_passport_number'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('jobs', sa.Column('passport_required', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    op.drop_column('jobs', 'passport_required') 
"""add passport fields to job applications

Revision ID: add_passport_fields_to_applications
Revises: add_passport_required_to_jobs
Create Date: 2024-03-21 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_passport_fields_to_applications'
down_revision = 'add_passport_required_to_jobs'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('job_applications', sa.Column('has_passport', sa.Boolean(), nullable=False, server_default='false'))


def downgrade():
    op.drop_column('job_applications', 'has_passport') 
"""add passport number

Revision ID: add_passport_number
Revises: 9b42707d6d12
Create Date: 2024-03-21 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_passport_number'
down_revision = '9b42707d6d12'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('job_applications', sa.Column('passport_number', sa.String(), nullable=True))


def downgrade():
    op.drop_column('job_applications', 'passport_number') 
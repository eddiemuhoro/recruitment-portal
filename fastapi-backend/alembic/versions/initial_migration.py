"""initial migration

Revision ID: initial_migration
Revises: 
Create Date: 2024-02-18 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'initial_migration'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create agencies table
    op.create_table(
        'agencies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('agency_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('license_number', sa.String(), nullable=False),
        sa.Column('license_expiry', sa.Date(), nullable=False),
        sa.Column('website_url', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_agencies_id'), 'agencies', ['id'], unique=False)

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('admin', 'employer', 'user', name='userrole'), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('agency_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['agency_id'], ['agencies.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Create jobs table
    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('company', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('type', sa.Enum('Full-time', 'Part-time', 'Contract', 'Remote', name='jobtype'), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('requirements', sa.ARRAY(sa.String()), nullable=False),
        sa.Column('salary', sa.String(), nullable=False),
        sa.Column('posted_date', sa.DateTime(), nullable=True),
        sa.Column('status', sa.Enum('active', 'closed', 'draft', name='jobstatus'), nullable=True),
        sa.Column('employer_id', sa.Integer(), nullable=True),
        sa.Column('passport_required', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['employer_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_jobs_id'), 'jobs', ['id'], unique=False)

    # Create job_applications table
    op.create_table(
        'job_applications',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('job_id', sa.Integer(), nullable=True),
        sa.Column('applicant_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('cv_url', sa.String(), nullable=False),
        sa.Column('cover_letter', sa.Text(), nullable=False),
        sa.Column('passport_number', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('pending', 'reviewed', 'accepted', 'rejected', name='applicationstatus'), nullable=True),
        sa.Column('applied_date', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_job_applications_id'), 'job_applications', ['id'], unique=False)

    # Create employer_inquiries table
    op.create_table(
        'employer_inquiries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('agency_id', sa.Integer(), nullable=False),
        sa.Column('employer_name', sa.String(), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('contact_email', sa.String(), nullable=False),
        sa.Column('phone_number', sa.String(), nullable=True),
        sa.Column('is_urgent', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['agency_id'], ['agencies.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_employer_inquiries_id'), 'employer_inquiries', ['id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_employer_inquiries_id'), table_name='employer_inquiries')
    op.drop_table('employer_inquiries')
    op.drop_index(op.f('ix_job_applications_id'), table_name='job_applications')
    op.drop_table('job_applications')
    op.drop_index(op.f('ix_jobs_id'), table_name='jobs')
    op.drop_table('jobs')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_index(op.f('ix_agencies_id'), table_name='agencies')
    op.drop_table('agencies') 
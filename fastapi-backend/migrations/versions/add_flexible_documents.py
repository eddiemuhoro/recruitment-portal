"""Add flexible document system for job applications

Revision ID: add_flexible_documents
Revises: make_cover_letter_nullable
Create Date: 2025-07-01 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_flexible_documents'
down_revision = 'make_cover_letter_nullable'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create document type enum
    document_type_enum = postgresql.ENUM(
        'cv', 'passport', 'birth_certificate', 'kcse_certificate', 
        'kcpe_certificate', 'certificate_of_good_conduct', 'academic_transcripts',
        'professional_certificate', 'work_permit', 'police_clearance', 
        'medical_certificate', 'other',
        name='documenttype'
    )
    document_type_enum.create(op.get_bind())
    
    # Add required_documents column to jobs table
    op.add_column('jobs', sa.Column('required_documents', postgresql.JSON(), nullable=True))
    
    # Remove cv_url from job_applications table (we'll use documents table instead)
    op.drop_column('job_applications', 'cv_url')
    
    # Create application_documents table
    op.create_table(
        'application_documents',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('application_id', sa.Integer(), nullable=False),
        sa.Column('document_type', document_type_enum, nullable=False),
        sa.Column('document_url', sa.String(), nullable=False),
        sa.Column('document_name', sa.String(), nullable=False),
        sa.Column('uploaded_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['application_id'], ['job_applications.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_application_documents_id'), 'application_documents', ['id'], unique=False)


def downgrade() -> None:
    # Drop application_documents table
    op.drop_index(op.f('ix_application_documents_id'), table_name='application_documents')
    op.drop_table('application_documents')
    
    # Add back cv_url column to job_applications
    op.add_column('job_applications', sa.Column('cv_url', sa.VARCHAR(), nullable=False))
    
    # Remove required_documents column from jobs
    op.drop_column('jobs', 'required_documents')
    
    # Drop document type enum
    document_type_enum = postgresql.ENUM(name='documenttype')
    document_type_enum.drop(op.get_bind())

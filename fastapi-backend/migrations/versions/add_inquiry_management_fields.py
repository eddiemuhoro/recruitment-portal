"""Add advanced inquiry management fields

Revision ID: add_inquiry_management_fields
Revises: 9b42707d6d12
Create Date: 2025-08-21

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'add_inquiry_management_fields'
down_revision = '9b42707d6d12'  # Last migration in the migrations/versions folder
branch_labels = None
depends_on = None

def upgrade():
    # Create the new enums
    inquiry_status_enum = postgresql.ENUM('new', 'in_progress', 'resolved', 'closed', name='inquirystatus')
    priority_enum = postgresql.ENUM('low', 'medium', 'high', 'urgent', name='priority')
    
    inquiry_status_enum.create(op.get_bind())
    priority_enum.create(op.get_bind())
    
    # Add new columns to employer_inquiries table
    op.add_column('employer_inquiries', sa.Column('status', inquiry_status_enum, nullable=False, server_default='new'))
    op.add_column('employer_inquiries', sa.Column('priority', priority_enum, nullable=False, server_default='medium'))
    op.add_column('employer_inquiries', sa.Column('admin_notes', sa.Text(), nullable=True))
    op.add_column('employer_inquiries', sa.Column('admin_response', sa.Text(), nullable=True))
    op.add_column('employer_inquiries', sa.Column('assigned_to', sa.String(), nullable=True))
    op.add_column('employer_inquiries', sa.Column('responded_at', sa.DateTime(), nullable=True))
    op.add_column('employer_inquiries', sa.Column('resolved_at', sa.DateTime(), nullable=True))
    op.add_column('employer_inquiries', sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')))

def downgrade():
    # Remove the columns
    op.drop_column('employer_inquiries', 'updated_at')
    op.drop_column('employer_inquiries', 'resolved_at')
    op.drop_column('employer_inquiries', 'responded_at')
    op.drop_column('employer_inquiries', 'assigned_to')
    op.drop_column('employer_inquiries', 'admin_response')
    op.drop_column('employer_inquiries', 'admin_notes')
    op.drop_column('employer_inquiries', 'priority')
    op.drop_column('employer_inquiries', 'status')
    
    # Drop the enums
    op.execute('DROP TYPE IF EXISTS inquirystatus')
    op.execute('DROP TYPE IF EXISTS priority')

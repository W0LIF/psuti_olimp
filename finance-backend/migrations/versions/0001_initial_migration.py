"""Initial migration

Revision ID: 0001_initial_migration
Revises: None
Create Date: 2026-04-23 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial_migration'
down_revision = None
branch_labels = None
def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('email', sa.String(), nullable=False, unique=True, index=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
    )

    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('icon', sa.String(), nullable=True, server_default='💰'),
        sa.Column('is_default', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
    )

    op.create_table(
        'budgets',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('month', sa.Integer(), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.Integer(), sa.ForeignKey('categories.id'), nullable=True),
        sa.Column('limit_amount', sa.Float(), nullable=False),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.CheckConstraint('month BETWEEN 1 AND 12', name='ck_budgets_month_range'),
        sa.CheckConstraint('year >= 2000', name='ck_budgets_year_range'),
    )

    op.create_table(
        'transactions',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.Column('type', sa.Enum('income', 'expense', name='transactiontype'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('comment', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('category_id', sa.Integer(), sa.ForeignKey('categories.id'), nullable=False),
    )

def downgrade():
    op.drop_table('transactions')
    op.drop_table('budgets')
    op.drop_table('categories')
    op.drop_table('users')

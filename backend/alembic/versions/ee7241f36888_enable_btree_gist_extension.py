"""enable btree gist extension

Revision ID: ee7241f36888
Revises: 
Create Date: 2026-11-24 13:32:57.546739

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ee7241f36888'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")


def downgrade():
    op.execute("DROP EXTENSION IF EXISTS btree_gist")

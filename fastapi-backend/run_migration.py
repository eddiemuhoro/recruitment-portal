#!/usr/bin/env python3
"""Run Alembic migration"""

import os
import sys
from alembic.config import Config
from alembic import command

def run_migration():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to alembic.ini
    alembic_cfg = Config(os.path.join(script_dir, "alembic.ini"))
    
    # Set the script location (migrations directory)
    alembic_cfg.set_main_option("script_location", os.path.join(script_dir, "migrations"))
    
    try:
        # Run the upgrade command
        command.upgrade(alembic_cfg, "head")
        print("✅ Migration completed successfully!")
        
        # Show current revision
        command.current(alembic_cfg)
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_migration()

from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def update_alembic_version():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # First, check if the table exists
        result = connection.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'alembic_version')"))
        table_exists = result.scalar()
        
        if not table_exists:
            # Create the table if it doesn't exist
            connection.execute(text("CREATE TABLE alembic_version (version_num VARCHAR(32) NOT NULL)"))
            connection.execute(text("INSERT INTO alembic_version (version_num) VALUES ('remove_has_passport_safe')"))
        else:
            # Update the version if the table exists
            connection.execute(text("UPDATE alembic_version SET version_num = 'remove_has_passport_safe'"))
        
        connection.commit()
        print("Successfully updated alembic version")

if __name__ == "__main__":
    update_alembic_version() 
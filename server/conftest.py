import pytest
from src.database import Base, engine, SessionLocal

@pytest.fixture(scope="session")
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    # In a real app we might drop tables here, but for now we'll keep them
    # Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(setup_db):
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

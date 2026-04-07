from src.database import SessionLocal
from src import models
from src.auth import hash_password
import pyotp

db = SessionLocal()
# Check if admin already exists
existing = db.query(models.User).filter(models.User.email == 'admin@stocksight.ai').first()
if existing:
    print(f'Admin already exists. OTP secret: {existing.otp_secret}')
else:
    admin = models.User(
        name='Admin',
        email='admin@stocksight.ai',
        hashed_password=hash_password('AdminPass123!'),
        role=models.UserRole.admin,
        otp_secret=pyotp.random_base32(),
    )
    db.add(admin)
    db.commit()
    print(f'Admin created. OTP secret: {admin.otp_secret}')
db.close()

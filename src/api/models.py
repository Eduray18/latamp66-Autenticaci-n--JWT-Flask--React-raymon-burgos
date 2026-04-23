from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)

    # Relación con la tabla de gastos
    expenses = relationship("Expense", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name
        }

class Expense(db.Model):
    __tablename__ = 'expense'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    date: Mapped[datetime.date] = mapped_column(Date, default=datetime.utcnow().date())
    
    item: Mapped[str] = mapped_column(String(100), nullable=False) # ej. "Café"
    amount: Mapped[float] = mapped_column(Float, nullable=False)   # ej. 35.50

    user = relationship("User", back_populates="expenses")

    def serialize(self):
        return {
            "id": self.id,
            "item": self.item,
            "amount": self.amount,
            "date": str(self.date)
        }
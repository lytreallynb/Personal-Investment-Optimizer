from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session

from ...schemas.user import UserCreate, UserLogin, User, Token
from ...models.user import User as UserModel
from ...core.security import get_password_hash, verify_password, create_access_token
from ...api.deps import DatabaseSession, CurrentUser

router = APIRouter()


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: DatabaseSession):
    """
    Register a new user.
    """
    # Check if user already exists
    existing_user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_in.password)
    db_user = UserModel(
        email=user_in.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: DatabaseSession):
    """
    Login and get access token.
    """
    # Get user from database
    user = db.query(UserModel).filter(UserModel.email == user_credentials.email).first()

    # Verify credentials
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=User)
def get_current_user_profile(current_user: CurrentUser):
    """
    Get current user profile.
    """
    return current_user

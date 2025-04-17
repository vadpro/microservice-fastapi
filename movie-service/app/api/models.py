from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class MovieIn(BaseModel):
    name: str
    plot: str
    genres: List[str]
    casts_id: List[int]


class MovieOut(MovieIn):
    id: int


class MovieUpdate(MovieIn):
    name: Optional[str] = None
    plot: Optional[str] = None
    genres: Optional[List[str]] = None
    casts_id: Optional[List[int]] = None


class CastInfo(BaseModel):
    id: int
    name: str
    nationality: Optional[str] = None


class MovieWithCast(MovieOut):
    casts: List[CastInfo]

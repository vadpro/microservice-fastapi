from pydantic import BaseModel, constr
from typing import List, Optional


class CastIn(BaseModel):
    name: constr(min_length=1, strip_whitespace=True)
    nationality: Optional[constr(min_length=1, strip_whitespace=True)] = None


class CastOut(CastIn):
    id: int


class CastUpdate(CastIn):
    name: Optional[constr(min_length=1, strip_whitespace=True)] = None

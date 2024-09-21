from typing import Any, Optional

from bson import ObjectId
from pydantic import BaseModel, Field


class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source, handler):
        return handler(str)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema: dict) -> dict:
        schema.update(
            {
                "type": "string",
                "example": "60e88c8a2f8e4b3aee4f3e33",
            }
        )
        return schema

    @classmethod
    def validate(cls, v: Any):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str):
            try:
                return ObjectId(v)
            except Exception as exc:
                raise ValueError(f"Invalid ObjectId: {v}") from exc
        raise TypeError(f"Expected ObjectId or str, got {type(v)}")

    @classmethod
    def __modify_schema__(cls, field_schema):
        pass

    def __str__(self):
        return str(self)


class TodoItem(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="id")
    title: str
    description: Optional[str] = None
    completed: bool = False

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

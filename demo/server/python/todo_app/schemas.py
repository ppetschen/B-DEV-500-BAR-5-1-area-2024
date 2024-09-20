from typing import Optional

from pydantic import BaseModel


class TodoItemSchema(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class UpdateTodoItemSchema(BaseModel):
    title: Optional[str]
    description: Optional[str]
    completed: Optional[bool]

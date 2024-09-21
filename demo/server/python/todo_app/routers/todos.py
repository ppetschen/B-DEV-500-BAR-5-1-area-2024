from typing import List, Dict, Union

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from todo_app.database import db
from todo_app.models import TodoItem
from todo_app.schemas import TodoItemSchema, UpdateTodoItemSchema

router = APIRouter(
    prefix="/todo",
    tags=["todos"],
    responses={404: {"description": "Not found"}},
)


# Helper function to format response
def format_response(data: Union[List, Dict]):
    return {"data": data}


# Retrieve all todo objects [GET] /todo
@router.get("/", response_model=Dict[str, List[TodoItem]])
async def list_todo_items():
    todos = await db["todos"].find().to_list(1000)
    for todo in todos:
        todo["id"] = str(todo["_id"])
    return format_response(todos)


# Retrieve one todo object based on the provided ID [GET] /todo/{id}
@router.get("/{id}", response_model=Dict[str, TodoItem])
async def get_todo_item(id: str):
    if (todo := await db["todos"].find_one({"_id": ObjectId(id)})) is not None:
        todo["id"] = str(todo["_id"])
        return format_response(todo)
    raise HTTPException(status_code=404, detail="Todo item not found")


# Creates a new todo object [POST] /todo
@router.post(
    "/", response_model=Dict[str, TodoItem], status_code=status.HTTP_201_CREATED
)
async def create_todo_item(todo: TodoItemSchema):
    new_todo = await db["todos"].insert_one(todo.model_dump())
    created_todo = await db["todos"].find_one({"_id": new_todo.inserted_id})
    if created_todo:
        created_todo["id"] = str(created_todo["_id"])
    return format_response(created_todo)


# Permanently deletes the todo object specified by its ID [DELETE] /todo/{id}
@router.delete("/{id}", response_model=dict)
async def delete_todo_item(id: str):
    delete_result = await db["todos"].delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Todo item deleted successfully"}
    raise HTTPException(status_code=404, detail="Todo item not found")


# Updates the entire object, replacing its current state [PUT] /todo/{id}
@router.put("/{id}", response_model=Dict[str, TodoItem])
async def update_todo_item(id: str, todo: TodoItemSchema):
    update_result = await db["todos"].replace_one({"_id": ObjectId(id)}, todo.dict())

    if update_result.modified_count == 1:
        updated_todo = await db["todos"].find_one({"_id": ObjectId(id)})
        if updated_todo:
            updated_todo["id"] = str(updated_todo["_id"])
        return format_response(updated_todo)

    raise HTTPException(status_code=404, detail="Todo item not found")


# Updates an object partially, modifying only fields specified in the body [PATCH] /todo/{id}
@router.patch("/{id}", response_model=Dict[str, TodoItem])
async def patch_todo_item(id: str, todo: UpdateTodoItemSchema):
    update_result = await db["todos"].update_one(
        {"_id": ObjectId(id)}, {"$set": todo.model_dump(exclude_unset=True)}
    )

    if update_result.modified_count == 1:
        updated_todo = await db["todos"].find_one({"_id": ObjectId(id)})
        if updated_todo:
            updated_todo["id"] = str(updated_todo["_id"])
        return format_response(updated_todo)

    raise HTTPException(status_code=404, detail="Todo item not found")

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "todo_app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )

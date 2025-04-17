from fastapi import APIRouter, HTTPException, WebSocket
from typing import List
import json
from databases import Record

from app.api.models import CastOut, CastIn, CastUpdate
from app.api import db_manager

casts = APIRouter()


@casts.post('/', response_model=CastOut, status_code=201)
async def create_cast(payload: CastIn):
    cast_id = await db_manager.add_cast(payload)

    response = {
        'id': cast_id,
        **payload.dict()
    }

    return response


@casts.get('/{id}/', response_model=CastOut)
async def get_cast(id: int):
    cast = await db_manager.get_cast(id)
    if not cast:
        raise HTTPException(status_code=404, detail="Cast not found")
    return cast


@casts.websocket("/ws/cast-info")
async def websocket_cast_info(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            cast_ids = json.loads(data)
            
            if not isinstance(cast_ids, list):
                await websocket.send_json({"error": "Input must be a list of cast IDs"})
                continue
                
            result = []
            for cast_id in cast_ids:
                cast = await db_manager.get_cast(cast_id)
                if cast:
                    # Преобразуем Record в словарь
                    if isinstance(cast, Record):
                        cast = dict(cast)
                    result.append(cast)
            
            await websocket.send_json(result)
    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
        await websocket.close()

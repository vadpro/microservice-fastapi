from fastapi import APIRouter, HTTPException, WebSocket
from typing import List
import json
from starlette.websockets import WebSocketDisconnect

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


@casts.get('/', response_model=List[CastOut])
async def get_casts():
    result = await db_manager.get_all_casts()
    valid_casts = []
    for item in result:
        cast_dict = dict(item) if not isinstance(item, dict) else item
        if cast_dict.get('name') and cast_dict.get('nationality'):
            valid_casts.append(cast_dict)
    return valid_casts


@casts.get('/{id}/', response_model=CastOut)
async def get_cast(id: int):
    cast = await db_manager.get_cast(id)
    if not cast:
        raise HTTPException(status_code=404, detail="Cast not found")
    if not isinstance(cast, dict):
        cast = dict(cast)
    
    # Check if cast has valid data
    if not cast.get('name') or not cast.get('nationality'):
        raise HTTPException(status_code=404, detail="Cast data is invalid")
    
    return cast


@casts.websocket("/ws/cast-info")
async def websocket_cast_info(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            try:
                data = await websocket.receive_text()
                cast_ids = json.loads(data)
                
                if not isinstance(cast_ids, list):
                    await websocket.send_json({"error": "Input must be a list of cast IDs"})
                    continue
                    
                result = []
                for cast_id in cast_ids:
                    cast = await db_manager.get_cast(cast_id)
                    if cast:
                        if not isinstance(cast, dict):
                            cast = dict(cast)
                        if cast.get('name') and cast.get('nationality'):
                            result.append(cast)
                
                await websocket.send_json(result)
            except WebSocketDisconnect:
                break
            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except Exception as e:
        print(f"Unexpected error in websocket_cast_info: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass

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


@casts.get('/{id}/', response_model=CastOut)
async def get_cast(id: int):
    cast = await db_manager.get_cast(id)
    if not cast:
        raise HTTPException(status_code=404, detail="Cast not found")
    # Преобразуем в словарь, если это не словарь
    if not isinstance(cast, dict):
        cast = dict(cast)
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
                        # Преобразуем в словарь, если это не словарь
                        if not isinstance(cast, dict):
                            cast = dict(cast)
                        result.append(cast)
                
                await websocket.send_json(result)
            except WebSocketDisconnect:
                # Если соединение закрыто клиентом, просто выходим из цикла
                break
            except Exception as e:
                # Для других ошибок отправляем сообщение об ошибке
                await websocket.send_json({"error": str(e)})
    except Exception as e:
        # Логируем неожиданные ошибки
        print(f"Unexpected error in websocket_cast_info: {e}")
    finally:
        # Закрываем соединение только если оно еще не закрыто
        try:
            await websocket.close()
        except:
            pass

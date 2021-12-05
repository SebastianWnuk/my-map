"use strict";
exports.__esModule = true;
exports.ProtobufUtils = void 0;
var messages_pb_1 = require("../../Messages/generated/messages_pb");
var Direction = messages_pb_1.PositionMessage.Direction;
var ProtobufUtils = /** @class */ (function () {
    function ProtobufUtils() {
    }
    ProtobufUtils.toPositionMessage = function (point) {
        var direction;
        switch (point.direction) {
            case 'up':
                direction = Direction.UP;
                break;
            case 'down':
                direction = Direction.DOWN;
                break;
            case 'left':
                direction = Direction.LEFT;
                break;
            case 'right':
                direction = Direction.RIGHT;
                break;
            default:
                throw new Error('unexpected direction');
        }
        var position = new messages_pb_1.PositionMessage();
        position.setX(point.x);
        position.setY(point.y);
        position.setMoving(point.moving);
        position.setDirection(direction);
        return position;
    };
    ProtobufUtils.toPointInterface = function (position) {
        var direction;
        switch (position.getDirection()) {
            case Direction.UP:
                direction = 'up';
                break;
            case Direction.DOWN:
                direction = 'down';
                break;
            case Direction.LEFT:
                direction = 'left';
                break;
            case Direction.RIGHT:
                direction = 'right';
                break;
            default:
                throw new Error("Unexpected direction");
        }
        // sending to all clients in room except sender
        return {
            x: position.getX(),
            y: position.getY(),
            direction: direction,
            moving: position.getMoving()
        };
    };
    ProtobufUtils.toPointMessage = function (point) {
        var position = new messages_pb_1.PointMessage();
        position.setX(Math.floor(point.x));
        position.setY(Math.floor(point.y));
        return position;
    };
    ProtobufUtils.toItemEvent = function (itemEventMessage) {
        return {
            itemId: itemEventMessage.getItemid(),
            event: itemEventMessage.getEvent(),
            parameters: JSON.parse(itemEventMessage.getParametersjson()),
            state: JSON.parse(itemEventMessage.getStatejson())
        };
    };
    ProtobufUtils.toItemEventProtobuf = function (itemEvent) {
        var itemEventMessage = new messages_pb_1.ItemEventMessage();
        itemEventMessage.setItemid(itemEvent.itemId);
        itemEventMessage.setEvent(itemEvent.event);
        itemEventMessage.setParametersjson(JSON.stringify(itemEvent.parameters));
        itemEventMessage.setStatejson(JSON.stringify(itemEvent.state));
        return itemEventMessage;
    };
    ProtobufUtils.toCharacterLayerMessages = function (characterLayers) {
        return characterLayers.map(function (characterLayer) {
            var message = new messages_pb_1.CharacterLayerMessage();
            message.setName(characterLayer.name);
            if (characterLayer.url) {
                message.setUrl(characterLayer.url);
            }
            return message;
        });
    };
    ProtobufUtils.toCharacterLayerObjects = function (characterLayers) {
        return characterLayers.map(function (characterLayer) {
            var url = characterLayer.getUrl();
            return {
                name: characterLayer.getName(),
                url: url ? url : undefined
            };
        });
    };
    return ProtobufUtils;
}());
exports.ProtobufUtils = ProtobufUtils;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const db_config_1 = __importDefault(require("../configs/db.config"));
class WebSocketService {
    constructor(io) {
        this.io = io;
        this.packetBuffer = [];
        this.isProcessing = false;
        this.handleConnection = (socket) => {
            console.log("WebSocket client connected");
            socket.on("userId", (userId) => {
                console.log(`Received userId: ${userId}`);
                if (userId) {
                    socket.join(userId);
                    console.log(`User ${socket.id} joined room ${userId}`);
                }
            });
            socket.on("newAccess", (movement) => {
                this.enqueuePacket({ event: "newAccess", movement });
                this.processNextPacket();
            });
        };
        this.io.on("connection", this.handleConnection);
    }
    enqueuePacket(packet) {
        this.packetBuffer.push(packet);
    }
    processNextPacket() {
        if (this.packetBuffer.length > 0 && !this.isProcessing) {
            this.isProcessing = true;
            const packet = this.packetBuffer.shift();
            this.handlePacket(packet);
        }
    }
    handlePacket(packet) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Processing packet:", packet);
            const { event, movement } = packet;
            console.log(`Processing ${event} with movement:`, movement);
            console.log("AA");
            //Save in BD
            try {
                console.log("A");
                if (movement === null || movement === void 0 ? void 0 : movement.exit_at) {
                    const rows = yield db_config_1.default.execute("SELECT * FROM access_key WHERE member_id = ? AND room_id = ? AND access_at = ?", [(_a = movement === null || movement === void 0 ? void 0 : movement.key_id) !== null && _a !== void 0 ? _a : null, (_b = movement === null || movement === void 0 ? void 0 : movement.room_id) !== null && _b !== void 0 ? _b : null, (_c = movement === null || movement === void 0 ? void 0 : movement.access_at) !== null && _c !== void 0 ? _c : null]);
                    if ([rows].length > 0) {
                        yield db_config_1.default.execute("UPDATE access_key SET exit_at = ? WHERE member_id = ? AND room_id = ? AND access_at = ?", [(_d = movement === null || movement === void 0 ? void 0 : movement.exit_at) !== null && _d !== void 0 ? _d : null, (_e = movement === null || movement === void 0 ? void 0 : movement.key_id) !== null && _e !== void 0 ? _e : null, (_f = movement === null || movement === void 0 ? void 0 : movement.room_id) !== null && _f !== void 0 ? _f : null, (_g = movement === null || movement === void 0 ? void 0 : movement.access_at) !== null && _g !== void 0 ? _g : null]);
                    }
                    else {
                        yield db_config_1.default.execute("INSERT INTO access_key (member_id, room_id, access_at, exit_at) VALUES (?, ?, ?, ?)", [(_h = movement === null || movement === void 0 ? void 0 : movement.key_id) !== null && _h !== void 0 ? _h : null, (_j = movement === null || movement === void 0 ? void 0 : movement.room_id) !== null && _j !== void 0 ? _j : null, (_k = movement === null || movement === void 0 ? void 0 : movement.access_at) !== null && _k !== void 0 ? _k : null, (_l = movement === null || movement === void 0 ? void 0 : movement.exit_at) !== null && _l !== void 0 ? _l : null]);
                    }
                }
                else {
                    yield db_config_1.default.execute("INSERT INTO access_key (member_id, room_id, access_at, exit_at) VALUES (?, ?, ?, null)", [(_m = movement === null || movement === void 0 ? void 0 : movement.key_id) !== null && _m !== void 0 ? _m : null, (_o = movement === null || movement === void 0 ? void 0 : movement.room_id) !== null && _o !== void 0 ? _o : null, (_p = movement === null || movement === void 0 ? void 0 : movement.access_at) !== null && _p !== void 0 ? _p : null]);
                }
            }
            catch (error) {
                console.log("B");
                console.error("Error handling packet:", error);
            }
            // Send movement to client
            console.log("C");
            if (movement === null || movement === void 0 ? void 0 : movement.room_id) {
                this.io.emit(event, movement);
                console.log("D");
            }
            else {
                console.log("E");
                console.log("Error finding users to send movement");
            }
            console.log("F");
            this.isProcessing = false;
            this.processNextPacket();
        });
    }
}
exports.WebSocketService = WebSocketService;

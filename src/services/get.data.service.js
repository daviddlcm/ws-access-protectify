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
const db_config_1 = __importDefault(require("../configs/db.config"));
const getAccessService = (created_by) => __awaiter(void 0, void 0, void 0, function* () {
    const rows = yield (yield db_config_1.default).execute('SELECT * FROM access JOIN access_keys ON access.key_id = access_keys.key_id WHERE access_keys.created_by = ?', [created_by]);
    const data = rows;
    return data.length > 0 ? data : [];
});
exports.default = getAccessService;

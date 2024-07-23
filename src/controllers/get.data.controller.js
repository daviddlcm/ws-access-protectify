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
exports.getData = void 0;
const get_data_service_1 = __importDefault(require("../services/get.data.service"));
const getData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const created_by = parseInt(req.params.id, 10);
        const data = yield (0, get_data_service_1.default)(created_by);
        if (data) {
            res.status(200).json(data);
        }
        else {
            res.status(404).json({ message: 'Data not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting data', error });
    }
});
exports.getData = getData;

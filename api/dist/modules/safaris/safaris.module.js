"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafarisModule = void 0;
const common_1 = require("@nestjs/common");
const safaris_service_1 = require("./safaris.service");
const safaris_controller_1 = require("./safaris.controller");
let SafarisModule = class SafarisModule {
};
exports.SafarisModule = SafarisModule;
exports.SafarisModule = SafarisModule = __decorate([
    (0, common_1.Module)({
        controllers: [safaris_controller_1.SafarisController],
        providers: [safaris_service_1.SafarisService],
        exports: [safaris_service_1.SafarisService],
    })
], SafarisModule);
//# sourceMappingURL=safaris.module.js.map
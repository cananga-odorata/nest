// src/common/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ดึง roles ที่ต้องการจาก @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ถ้า endpoint ไม่ได้ระบุ role ก็อนุญาตให้ผ่าน
    if (!requiredRoles) {
      return true;
    }

    // ดึงข้อมูล user ที่ถูกแนบมาจาก JwtAuthGuard
    const { user } = context.switchToHttp().getRequest();

    // ตรวจสอบว่า role ของ user ตรงกับที่ endpoint ต้องการหรือไม่
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAccessGuard } from './jwt-access.guard';
import { Role } from '@root/users/entities/role.enum';
import { RequestWithUser } from '@root/auth/interfaces /requestWithUser.interface';

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAccessGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const req = context.switchToHttp().getRequest<RequestWithUser>();
      const user = req.user;

      return user?.roles.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};

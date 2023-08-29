import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Provider } from '@root/users/entities/provider.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(Provider.LOCAL) {}

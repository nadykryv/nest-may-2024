import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SocketGateway } from './socket.gatewy';

@Module({
  imports: [AuthModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}

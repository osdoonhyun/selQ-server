import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HintsService } from '@hints/hints.service';
import { HintsController } from '@hints/hints.controller';
import { Hint } from '@hints/entities/hint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hint])],
  controllers: [HintsController],
  providers: [HintsService],
})
export class HintsModule {}

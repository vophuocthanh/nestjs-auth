import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// service: dùng để khởi tạo và dùng controller và model

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService], // những thằng dùng trong  servie thfi phải import hết vafo model. VD: PrismaService, JwtService
  // Những thằng được khơri tạo bằng phương thức contructor trong service thì phải import ơ providers trong model
})
export class AuthModule {}

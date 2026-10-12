import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: Role;
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        emailVerified: false,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ skip, take, where, orderBy }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total };
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    await this.findById(id); // throws if not found
    return this.prisma.user.update({ where: { id }, data });
  }

  async updatePassword(id: string, newPasswordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });
  }

  async verifyEmail(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { emailVerified: true },
    });
  }

  async deactivate(id: string) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activate(id: string) {
    await this.findById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.user.delete({ where: { id } });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.findById(userId);
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new ConflictException('Current password is incorrect');
    }
    const newHash = await bcrypt.hash(newPassword, 12);
    return this.updatePassword(userId, newHash);
  }
}
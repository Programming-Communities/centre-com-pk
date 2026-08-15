import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('tools')
  getTools() {
    return this.adminService.getTools();
  }

  @Get('blogs')
  getBlogs() {
    return this.adminService.getBlogs();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }
}
import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id/profile')
  getProfile(@Param('id') id: number) { return this.userService.getProfile(id); }

  @Put(':id/profile')
  updateProfile(@Param('id') id: number, @Body() body: any) { return this.userService.updateProfile(id, body); }

  @Get(':id/bookmarks')
  getBookmarks(@Param('id') id: number) { return this.userService.getBookmarks(id); }

  @Get(':id/ads')
  getAds(@Param('id') id: number) { return this.userService.getAds(id); }
}

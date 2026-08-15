import { Controller, Get, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  getPosts(@Query('limit') limit = 20, @Query('lang') lang?: string) {
    return this.blogService.getPosts(+limit, lang);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.blogService.getPostBySlug(slug);
  }
}
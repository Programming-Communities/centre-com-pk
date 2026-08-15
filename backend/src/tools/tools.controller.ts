import { Controller, Get, Param, Query } from '@nestjs/common';
import { ToolsService } from './tools.service';

@Controller('tools')
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @Get()
  getAll(@Query('category') category?: string) {
    return this.toolsService.getAllTools(category);
  }

  @Get('categories')
  getCategories() {
    return this.toolsService.getCategories();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.toolsService.getToolBySlug(slug);
  }
}
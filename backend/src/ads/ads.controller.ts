import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AdsService } from './ads.service';

@Controller('ads')
export class AdsController {
  constructor(private adsService: AdsService) {}

  @Get()
  getAll() { return this.adsService.getAllAds(); }

  @Get(':id')
  getById(@Param('id') id: number) { return this.adsService.getAdById(id); }

  @Post()
  create(@Body() body: any) { return this.adsService.createAd(body); }

  @Delete(':id')
  delete(@Param('id') id: number) { return this.adsService.deleteAd(id); }
}

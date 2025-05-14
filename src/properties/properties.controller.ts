import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  NotFoundException,
} from '@nestjs/common';
import {
  PropertiesService,
  Property,
  PaginatedPropertiesResult,
} from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async getAllProperties(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ): Promise<PaginatedPropertiesResult> {
    return this.propertiesService.getAll(page, limit);
  }

  @Get(':id')
  async getPropertyById(@Param('id') id: string): Promise<Property> {
    const property = await this.propertiesService.findOne(id);
    if (!property) {
      throw new NotFoundException(`Propiedad con ID "${id}" no encontrada.`);
    }
    return property;
  }
}

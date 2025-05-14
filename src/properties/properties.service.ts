import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

export type PropertyType = 'SALE' | 'RENT';

export interface Property {
  id: string;
  name: string;
  city: string;
  imageUrl: string;
  price: number;
  type: PropertyType;
  bathrooms: number;
  address: string;
  bedrooms: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedPropertiesResult {
  data: Property[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

const PROPERTIES_FILE_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  'src',
  'database',
  'properties.json',
);

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  private async loadProperties(): Promise<Property[]> {
    try {
      const fileData = await fs.readFile(PROPERTIES_FILE_PATH, 'utf-8');
      const propertiesFromFile: Property[] = JSON.parse(fileData) as Property[];

      return propertiesFromFile.map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    } catch (error: unknown) {
      this.logger.error(
        `Error al cargar o parsear properties.json desde ${PROPERTIES_FILE_PATH}`,
        error instanceof Error ? error.stack : 'No stack trace available',
      );
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new InternalServerErrorException(
          'Archivo de datos de propiedades no encontrado.',
        );
      }
      throw new InternalServerErrorException(
        'Error al leer los datos de propiedades.',
      );
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 5,
  ): Promise<PaginatedPropertiesResult> {
    const allProperties = await this.loadProperties();

    const totalItems = allProperties.length;
    const totalPages = Math.ceil(totalItems / limit);

    const currentPageClamped = Math.max(1, Math.min(page, totalPages || 1));

    const startIndex = (currentPageClamped - 1) * limit;
    const paginatedData = allProperties.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      totalItems,
      currentPage: currentPageClamped,
      pageSize: limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Property | undefined> {
    const allProperties = await this.loadProperties();
    const property = allProperties.find((p) => p.id === id);
    return property;
  }
}

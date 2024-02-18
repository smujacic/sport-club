import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { SportService } from './sport.service'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { CreateSportDto } from './dto/createSport.dto'
import { LoggedInUser } from '../auth/user.decorator'
import { LoggedInUserInterface } from '../auth/interface/loggedinUser.interface'
import { Multer } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/jwt-aut.guards'
import { SportEntity } from './entity/sport.entity'

@Controller('sport')
@UsePipes(new ValidationPipe({ transform: true }))
export class SportController {
  constructor(private readonly sportService: SportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Create new sport',
    tags: ['Sport'],
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        image: { type: 'string', format: 'binary' },
      },
      required: ['name', 'description'],
    },
    type: CreateSportDto,
  })
  async createSport(
    @LoggedInUser() user: LoggedInUserInterface,
    @Body() sportPayload: CreateSportDto,
    @UploadedFile() image?: Multer.File,
  ): Promise<SportEntity> {
    return await this.sportService.createSport(user, sportPayload, image)
  }

  @Get('')
  @ApiOperation({
    summary: 'Fetch sports or filter by name',
    tags: ['Sport'],
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Optional search string for filtering sports',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  async getSports(
    @Query('search') search: string = '',
    @Query('page') page?: number,
    @Query('size') size?: number,
  ): Promise<SportEntity[]> {
    if (search === ',') search = null

    return await this.sportService.getSports(search, page ? page : 1, size ? size : 10)
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get sport by ID',
    tags: ['Sport'],
  })
  async getSport(@Param('id') id: string): Promise<SportEntity> {
    return await this.sportService.getSport(id)
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete sport',
    tags: ['Sport'],
  })
  async deleteSport(@LoggedInUser() user: LoggedInUserInterface, @Param('id') id: string): Promise<void> {
    return await this.sportService.deleteSport(user, id)
  }
}

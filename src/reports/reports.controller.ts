import { CreateReportDto } from './dto/create-report.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@app/guards/auth.guard';
import { User } from '@app/users/decorators/user.decorator';
import { UserEntity } from '@app/users/user.entity';
import { Serialize } from '@app/interceptors/serialize.interceptor';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '@app/guards/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  create(@Body() dto: CreateReportDto, @User() user: UserEntity) {
    return this.reportsService.createReport(dto, user);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  changeApproval(@Param('id') id: string, @Body() dto: ApproveReportDto) {
    return this.reportsService.changeApproval(parseInt(id), dto);
  }
}

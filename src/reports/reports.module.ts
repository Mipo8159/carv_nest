import { Module } from '@nestjs/common';
import { ReportsService } from 'src/reports/reports.service';
import { ReportsController } from 'src/reports/reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from 'src/reports/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}

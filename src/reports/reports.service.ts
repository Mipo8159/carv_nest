import { UserEntity } from '@app/users/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApproveReportDto } from './dto/approve-report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetEstimateDto } from './dto/get-estimate.dto';
import { ReportEntity } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  createReport(dto: CreateReportDto, user: UserEntity) {
    const report = this.reportRepository.create(dto);
    report.user = user;
    return this.reportRepository.save(report);
  }

  async changeApproval(id: number, dto: ApproveReportDto) {
    const report = await this.reportRepository.findOne({
      where: { id },
    });
    if (!report) throw new NotFoundException('report not found');

    report.approved = dto.approved;
    return await this.reportRepository.save(report);
  }

  createEstimate({ make, model, lat, lng, year, mileage }: GetEstimateDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: make })
      .andWhere('model = :model', { model: model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage = :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}

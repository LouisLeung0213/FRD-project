import { Test, TestingModule } from '@nestjs/testing';
import { MainNoticeService } from './main-notice.service';

describe('MainNoticeService', () => {
  let service: MainNoticeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MainNoticeService],
    }).compile();

    service = module.get<MainNoticeService>(MainNoticeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

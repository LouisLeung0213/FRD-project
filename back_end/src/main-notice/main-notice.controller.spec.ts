import { Test, TestingModule } from '@nestjs/testing';
import { MainNoticeController } from './main-notice.controller';
import { MainNoticeService } from './main-notice.service';

describe('MainNoticeController', () => {
  let controller: MainNoticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MainNoticeController],
      providers: [MainNoticeService],
    }).compile();

    controller = module.get<MainNoticeController>(MainNoticeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

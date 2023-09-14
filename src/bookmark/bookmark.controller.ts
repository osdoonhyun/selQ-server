import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtAccessGuard } from '@root/auth/guards /jwt-access.guard';
import { RequestWithUser } from '@root/auth/interfaces /requestWithUser.interface';
import { Question } from '@questions/entities/question.entity';

@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  async createBookmark(
    @Req() req: RequestWithUser,
    @Body() question: Question,
  ) {
    const { user } = req;
    return await this.bookmarkService.registerBookmark({
      user,
      question,
    });
  }

  @Delete(':id')
  async deleteBookmark(
    @Req() req: RequestWithUser,
    @Param('id') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmark(req.user, bookmarkId);
  }

  @Get()
  async getBookmarks(@Req() req: RequestWithUser) {
    return this.bookmarkService.getBookmarksByUser(req.user);
  }
}

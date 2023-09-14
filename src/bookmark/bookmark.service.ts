import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '@root/bookmark/entities/bookmark.entity';
import { CreateBookmarkDto } from '@root/bookmark/dto/create-bookmark.dto';
import { User } from '@root/users/entities/user.entity';

@Injectable()
export class BookmarkService {
  @InjectRepository(Bookmark)
  private bookmarkRepository: Repository<Bookmark>;

  async registerBookmark(
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<Bookmark> {
    const newBookMark = await this.bookmarkRepository.create(createBookmarkDto);
    await this.bookmarkRepository.save(newBookMark);
    return newBookMark;
  }

  async deleteBookmark(user: User, bookmarkId: string): Promise<void> {
    return;
    // Implement the logic to delete a bookmark
  }

  // async getBookmarksByUser(user: User): Promise<Bookmark[]> {
  async getBookmarksByUser(user: User) {
    // Implement the logic to get bookmarks by user
  }
}

import { EntityRepository, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  async findOrInsert(tags: String[]): Promise<Tag[]> {
    let roomTags: Tag[] = [];

    for (const tag of tags) {
      const findTag = await this.findOne({
        name: tag.toString(),
      });

      if (findTag) {
        roomTags.push(findTag);
      } else {
        const insertTag = this.create({
          name: tag.toString(),
        });
        await this.save(insertTag);
        roomTags.push(insertTag);
      }
    }

    return roomTags;
  }
}

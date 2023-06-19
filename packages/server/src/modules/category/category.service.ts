import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  /**
   * 添加分類
   * @param Category
   */
  async create(Category: Partial<Category>): Promise<Category> {
    const { label } = Category;
    const existCategory = await this.categoryRepository.findOne({
      where: { label },
    });

    if (existCategory) {
      throw new HttpException('分類已存在', HttpStatus.BAD_REQUEST);
    }

    const newCategory = await this.categoryRepository.create(Category);
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  /**
   * 獲取所有分類
   */
  async findAll(queryParams): Promise<Category[]> {
    const { articleStatus } = queryParams;
    const qb = this.categoryRepository.createQueryBuilder('category').orderBy('category.createAt', 'ASC');

    if (articleStatus) {
      qb.leftJoinAndSelect('category.articles', 'articles', 'articles.status=:status', {
        status: articleStatus,
      });
    } else {
      qb.leftJoinAndSelect('category.articles', 'articles');
    }

    const data = await qb.getMany();

    data.forEach((d) => {
      Object.assign(d, { articleCount: d.articles.length });
      delete d.articles;
    });

    return data;

    // return this.categoryRepository.find({ order: { createAt: 'ASC' } });
  }

  /**
   * 獲取指定分類
   * @param id
   */
  async findById(id): Promise<Category> {
    const data = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id=:id')
      .orWhere('category.label=:id')
      .orWhere('category.value=:id')
      .setParameter('id', id)
      .getOne();

    return data;
  }

  async findByIds(ids): Promise<Array<Category>> {
    return this.categoryRepository.findByIds(ids);
  }

  /**
   * 更新分類
   * @param id
   * @param Category
   */
  async updateById(id, category: Partial<Category>): Promise<Category> {
    const oldCategory = await this.categoryRepository.findOne(id);
    const updatedCategory = await this.categoryRepository.merge(oldCategory, category);
    return this.categoryRepository.save(updatedCategory);
  }

  /**
   * 刪除分類
   * @param id
   */
  async deleteById(id) {
    try {
      const category = await this.categoryRepository.findOne(id);
      await this.categoryRepository.remove(category);
      return true;
    } catch (e) {
      throw new HttpException('刪除失敗，可能存在關聯文章', HttpStatus.BAD_REQUEST);
    }
  }
}

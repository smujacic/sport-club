import { Injectable } from '@nestjs/common'

@Injectable()
export class PaginationHelper {
  /**
   *
   * @param page
   * @param pageSize
   * @returns
   */
  pagination(page: number, pageSize: number): { skip: number; take: number } {
    const skip = (page - 1) * pageSize
    const take = pageSize

    return {
      skip,
      take,
    }
  }
}

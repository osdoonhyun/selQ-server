import { OrderConstant } from '@root/common/constants/order.constant';

export class PageOptionsDto {
  readonly order?: OrderConstant = OrderConstant.DESC;

  readonly page?: number = 1;

  readonly take?: number = 5;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}

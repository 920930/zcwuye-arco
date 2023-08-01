import type { ICompany } from '@/store/modules/company/types';

export interface IRoom {
  id: number;
  dong: number;
  qu: string;
  num: string;
  price: number;
  area: number;
}

export const ZM = 'ABCDEFGHIJKLMNOPQRST';
export const qutypeFn = (qu: number, type: number[], len = 0) => {
  const arr: { value: any; label: string }[] = [];
  type.forEach((item) => {
    switch (item) {
      case 1: // 数字区
        if (len) {
          for (let i = 0; i <= len; i += 1) {
            arr.push({ value: `${i}区`, label: `${i === 0 ? '无' : `${i}区`}` });
          }
        } else {
          for (let i = 0; i <= qu; i += 1) {
            arr.push({ value: `${i}区`, label: `${i === 0 ? '无' : `${i}区`}` });
          }
        }
        break;
      case 2: // 字母区
        if (len) {
          for (let i = 0; i < len; i += 1) {
            arr.push({ value: `${ZM[i]}区`, label: `${ZM[i]}区` });
          }
        } else {
          for (let i = 0; i < qu; i += 1) {
            arr.push({ value: `${ZM[i]}区`, label: `${ZM[i]}区` });
          }
        }
        break;
      case 3: // 字母数字区
        for (let i = 0; i < qu; i += 1) {
          for (let j = 1; j <= len; j += 1) {
            arr.push({ value: `${ZM[i]}${j}区`, label: `${ZM[i]}${j}区` });
          }
        }
        break;
      case 4: // 楼区
        if (len) {
          for (let i = 1; i <= len; i += 1) {
            arr.push({ value: `${i}楼`, label: `${i}楼` });
          }
        } else {
          for (let i = 1; i <= qu; i += 1) {
            arr.push({ value: `${i}楼`, label: `${i}楼` });
          }
        }
        break;
      case 5: // 特区
        for (let i = 1; i <= qu; i += 1) {
          arr.push({ value: `特${i}区`, label: `特${i}区` });
        }
        break;
      default:
        for (let i = 1; i <= qu; i += 1) {
          arr.push({ value: `特${i}区`, label: `${i}楼` });
        }
        break;
    }
  });
  return arr;
};

// 商铺列表页
export const roomToTree = (data: IRoom[], company: ICompany) => {
  const res: { [key: string]: IRoom[] } = {};
  if (company.dong) {
    for (let i = 1; i <= company.dong; i += 1) {
      const rooms = data.filter((item) => item.dong === i);
      if (rooms.length) res[`${i}栋`] = rooms;
    }
  }
  if (company.qu) {
    company.qutype?.forEach((t) => {
      switch (t) {
        // 数字区
        case 1:
          if (!company.dong) {
            for (let i = 0; i < (company.qu ?? 0); i += 1) {
              const rooms = data.filter((item) => item.qu === `${i}区`);
              if (rooms.length) res[`${i}区`] = rooms;
            }
          }
          break;
        // 字母
        case 2:
          for (let i = 0; i < (company.qu ?? 0); i += 1) {
            const rooms = data.filter((item) => item.qu === `${ZM[i]}区`);
            if (rooms.length) res[`${ZM[i]}区`] = rooms;
          }
          break;
        // 字母数字 A2
        case 3:
          for (let i = 0; i < (company.qu ?? 0); i += 1) {
            for (let j = 1; j <= (company.qulen ?? 1); j += 1) {
              const rooms = data.filter((item) => item.qu === `${ZM[i]}${j}区`);
              if (rooms.length) res[`${ZM[i]}${j}区`] = rooms;
            }
          }
          break;
        // 特区
        case 5:
          for (let i = 0; i < (company.qu ?? 0); i += 1) {
            const rooms = data.filter((item) => item.qu === `特${i}区`);
            if (rooms.length) res[`特${i}区`] = rooms;
          }
          break;
        default:
          break;
      }
    });
  }
  return res;
};

import { h, render } from 'vue';
import { IconSync } from '@arco-design/web-vue/es/icon';
import type { ICompany } from '@/store/modules/company/types';

export interface IRoom {
  id: number;
  dong: number;
  qu: string;
  num: string;
  price: number;
  area: number;
}

export interface ITrees {
  title: string;
  value: string;
  key: string;
  children?: ITrees[];
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
        for (let i = 0; i < qu; i += 1) {
          arr.push({ value: `${ZM[i]}区`, label: `${ZM[i]}区` });
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
          for (let i = 0; i <= len; i += 1) {
            arr.push({ value: `${i}楼`, label: `${i}楼` });
          }
        } else {
          for (let i = 0; i <= qu; i += 1) {
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
    const dset = new Set();
    data.forEach((item) => dset.add(item.dong));
    dset.forEach((d) => {
      res[`${d}栋`] = data.filter((item) => item.dong === d);
    });
  } else {
    const qset = new Set();
    data.forEach((item) => qset.add(item.qu));
    qset.forEach((q) => {
      res[`${q}`] = data.filter((item) => item.qu === q);
    });
  }
  return res;
};

// 合同页面 商铺tree
export const contractRoomToTree = (data: IRoom[], company: ICompany) => {
  const dongs: ITrees[] = [];

  if (company.dong) {
    const dset = new Set<number>();
    data.forEach((item) => dset.add(item.dong));
    dset.forEach((d) => {
      const ds = data.filter((item) => item.dong === d);
      const dval: ITrees = { title: `${d}栋`, value: `${d}栋`, key: Math.random().toString(16).slice(2), children: [] };
      const qset = new Set<string>();
      ds.forEach((item) => qset.add(item.qu));
      qset.forEach((q) => {
        const qval: ITrees = { title: q, value: q, key: Math.random().toString(16).slice(2), children: [] };
        const nums = ds.filter((item) => item.qu === q);
        if (q.startsWith('0')) {
          nums.forEach((item) => dval.children?.push({ title: `${dval.title}${item.num}`, value: `${dval.value}${item.num}`, key: `${item.id}` }));
        } else {
          nums.forEach((item) => qval.children?.push({ title: `${d === 0 ? '' : dval.title}${q}${item.num}`, value: `${dval.value}${q}${item.num}`, key: `${item.id}` }));
          dval.children?.push(qval);
        }
      });
      if (d === 0) {
        if (dval.children?.length) dongs.push(...dval.children);
      } else {
        dongs.push(dval);
      }
    });
    dset.clear();
  } else {
    const qset = new Set<string>();
    data.forEach((item) => qset.add(item.qu));
    qset.forEach((q) => {
      const qval: ITrees = { title: q, value: q, key: Math.random().toString(16).slice(2), children: [] };
      const nums = data.filter((item) => item.qu === q);
      nums.forEach((item) => qval.children?.push({ title: `${item.qu}${item.num}`, value: `${item.qu}${item.num}`, key: `${item.id}` }));
      dongs.push(qval);
    });
    qset.clear();
  }
  return dongs;
};

// 防抖
export const debounce = (fn: (val: any) => void, dafly = 800) => {
  let timer: NodeJS.Timeout | null = null;
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.left = '50%';
  div.style.top = '50%';
  div.style.zIndex = '1000000';
  const vm = h(IconSync, { spin: true, size: 30 });
  render(vm, div);
  return (...val: any) => {
    if (!document.body.contains(div)) {
      document.body.appendChild(div);
    }
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      document.body.removeChild(div);
      fn(val);
    }, dafly);
  };
};

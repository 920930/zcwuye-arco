import { h, render } from 'vue';
import { IconSync } from '@arco-design/web-vue/es/icon';
import type { ICompany } from '@/store/modules/user/types';

export interface IRoom {
  id: number;
  dong: number;
  qu: string;
  num: string;
  price: number;
  area: number;
  contract?: { id: number };
}

export interface ITrees {
  title: string;
  value: string;
  key: string;
  disabled?: boolean;
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
export const contractRoomToTree = (data: IRoom[], company: ICompany, rooms?: Set<string>) => {
  const dongs: ITrees[] = [];

  if (company.dong) {
    // 所有栋集合，剔除重复
    const dset = new Set<number>();
    data.forEach((item) => dset.add(item.dong));
    dset.forEach((d) => {
      // 当前栋的下的所有数据集合
      const ds = data.filter((item) => item.dong === d);
      const dval: ITrees = { title: `${d}栋`, value: `${d}栋`, key: Math.random().toString(16).slice(2), children: [] };
      // 当前栋下的所有区集合并去重
      const qset = new Set<string>();
      ds.forEach((item) => qset.add(item.qu));
      qset.forEach((q) => {
        const qval: ITrees = { title: q, value: q, key: Math.random().toString(16).slice(2), children: [] };
        const nums = ds.filter((item) => item.qu === q);
        // 0表示没有 没有区
        if (q.startsWith('0')) {
          nums.forEach((item) => {
            const disabled = rooms?.has(`${item.id}`) ? false : !!item.contract;
            dval.children?.push({
              title: `${dval.title}${item.num}`,
              value: `${dval.value}${item.num}`,
              key: `${item.id}`,
              disabled,
            });
          });
        } else {
          nums.forEach((item) => {
            const disabled = rooms?.has(`${item.id}`) ? false : !!item.contract;
            qval.children?.push({
              title: `${d === 0 ? '' : dval.title}${q}${item.num}`,
              value: `${dval.value}${q}${item.num}`,
              key: `${item.id}`,
              disabled,
            });
          });
          dval.children?.push(qval);
        }
      });
      // 表示没有栋
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
      nums.forEach((item) => {
        const disabled = rooms?.has(`${item.id}`) ? false : !!item.contract;
        qval.children?.push({
          title: `${item.qu}${item.num}`,
          value: `${item.qu}${item.num}`,
          key: `${item.id}`,
          disabled,
        });
      });
      dongs.push(qval);
    });
    qset.clear();
  }
  return dongs;
};

// 防抖
export const debounce = (fn: (val: any) => void, dafly = 800) => {
  let timer: any = null;
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

export const tinyCanvas = (blob: Blob, quality = 60, width = 1000): Promise<Blob> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    const img = new Image();
    reader.addEventListener('load', (e) => {
      img.src = e.target?.result as string;
    });
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      // 等比例高度
      canvas.height = (img.height * width) / img.width;
      // 将图片铺满等比例宽高的canvas
      ctx?.drawImage(img, 0, 0, width, canvas.height);
      // 输出为base64图片
      // canvas.toDataURL('jpg', quality / 100);
      // 输出为blob, quality为0-1区间
      canvas.toBlob((file) => resolve(file as Blob), blob.type, quality / 100);
    });
  });
};

import 'dotenv/config';

import { db } from './index';
import {
  categories,
  productSeries,
  products,
  adminSettings,
  user,
} from './schema';
import { eq } from 'drizzle-orm';
import { auth } from '~/server/better-auth';

// ─── Categories ───
const dcDcCategory = {
  id: 'cat-dc-dc',
  name: 'DC-DC 컨버터',
  nameEn: 'DC-DC Converter',
  slug: 'dc-dc',
  description:
    '직류 전압을 다른 직류 전압으로 변환하는 전력 변환 장치입니다. 산업용, 통신용, 전기차 등 다양한 응용 분야에서 사용됩니다.',
  descriptionEn:
    'Power conversion devices that convert DC voltage to another DC voltage. Used in industrial, telecom, EV, and various applications.',
  imageUrl: 'https://powerplaza.net/shop/image/dc01.jpg',
  sortOrder: 1,
};

const acDcCategory = {
  id: 'cat-ac-dc',
  name: 'AC-DC 컨버터',
  nameEn: 'AC-DC Converter',
  slug: 'ac-dc',
  description:
    '교류 전압을 직류 전압으로 변환하는 전력 공급 장치입니다. 고효율, 저소음, 다양한 출력 전력을 제공합니다.',
  descriptionEn:
    'Power supply units that convert AC voltage to DC voltage. Features high efficiency, low noise, and various output power options.',
  imageUrl: 'https://powerplaza.net/shop/image/ac01.jpg',
  sortOrder: 2,
};

const evCategory = {
  id: 'cat-ev',
  name: 'EV 부품',
  nameEn: 'EV Component',
  slug: 'ev-component',
  description:
    '전기차 핵심 부품으로 온보드 충전기, 전력 분배 장치, BMS, 배터리 모듈, LDC 등을 제공합니다.',
  descriptionEn:
    'Core EV components including On Board Charger, Power Distribution Unit, BMS, Battery Module, and LDC.',
  imageUrl: 'https://powerplaza.net/home/image/s223_s01_1.jpg',
  sortOrder: 3,
};

// ─── DC-DC Series ───
const dcDcSeriesList = [
  {
    id: 'ser-sp',
    name: 'SP-series',
    slug: 'sp',
    description:
      '초소형, 고효율 DC-DC 컨버터. 세라믹 캐패시터만을 적용하여 신뢰도 및 수명이 향상된 제품입니다.',
    descriptionEn:
      'Ultra-compact, high efficiency DC-DC converters. Uses only ceramic capacitors for improved reliability and lifespan.',
    imageUrl: 'https://powerplaza.net/shop/image/dc01.jpg',
    sortOrder: 1,
  },
  {
    id: 'ser-vps6',
    name: 'VPS6-series',
    slug: 'vps6',
    description: '4:1 광폭 입력 초소형 DC-DC 컨버터입니다.',
    descriptionEn: '4:1 wide input ultra-compact DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p01.jpg',
    sortOrder: 2,
  },
  {
    id: 'ser-lps6',
    name: 'LPS6-series',
    slug: 'lps6',
    description: '초저소음, 고효율 DC-DC 컨버터입니다.',
    descriptionEn: 'Ultra-low noise, high efficiency DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p02.jpg',
    sortOrder: 3,
  },
  {
    id: 'ser-p',
    name: 'P-series',
    slug: 'p',
    description: '범용 산업용 DC-DC 컨버터입니다.',
    descriptionEn: 'General purpose industrial DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p03.jpg',
    sortOrder: 4,
  },
  {
    id: 'ser-spt',
    name: 'SPT-series',
    slug: 'spt',
    description: '15W 산업용 표준 핀 DC-DC 컨버터입니다.',
    descriptionEn: '15W industrial standard pin DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p04.jpg',
    sortOrder: 5,
  },
  {
    id: 'ser-pt',
    name: 'PT-series',
    slug: 'pt',
    description: '25W 4:1 광폭 입력 DC-DC 컨버터입니다.',
    descriptionEn: '25W 4:1 wide input DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p05.jpg',
    sortOrder: 6,
  },
  {
    id: 'ser-pbr50',
    name: 'PBR50-series',
    slug: 'pbr50',
    description: '50W 레일 마운트 DC-DC 컨버터입니다.',
    descriptionEn: '50W rail mount DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p06.jpg',
    sortOrder: 7,
  },
  {
    id: 'ser-upm',
    name: 'UPM-series',
    slug: 'upm',
    description: '고전력 밀도 DC-DC 컨버터입니다.',
    descriptionEn: 'High power density DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p07.jpg',
    sortOrder: 8,
  },
  {
    id: 'ser-ypm600',
    name: 'YPM600-series',
    slug: 'ypm600',
    description: '600W 고전력 DC-DC 컨버터입니다.',
    descriptionEn: '600W high power DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p08.jpg',
    sortOrder: 9,
  },
  {
    id: 'ser-lpm600',
    name: 'LPM600-series',
    slug: 'lpm600',
    description: '600W 저소음 DC-DC 컨버터입니다.',
    descriptionEn: '600W low noise DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p09.jpg',
    sortOrder: 10,
  },
  {
    id: 'ser-sns',
    name: 'SNS-series',
    slug: 'sns',
    description:
      '비절연형 초소형 DC-DC 컨버터. 저전압/고전류 응용에 최적화되었습니다.',
    descriptionEn:
      'Non-isolated ultra-compact DC-DC converters. Optimized for low voltage/high current applications.',
    imageUrl: 'https://powerplaza.net/shop/image/dc09.jpg',
    sortOrder: 11,
  },
  {
    id: 'ser-78ns',
    name: '78NS-series',
    slug: '78ns',
    description: '비절연형 저전력 DC-DC 컨버터입니다.',
    descriptionEn: 'Non-isolated low power DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p10.jpg',
    sortOrder: 12,
  },
  {
    id: 'ser-qpc20a',
    name: 'QPC20A-series',
    slug: 'qpc20a',
    description: '20A 1/4 브릭 DC-DC 컨버터입니다.',
    descriptionEn: '20A 1/4 brick DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p11.jpg',
    sortOrder: 13,
  },
  {
    id: 'ser-nb600',
    name: 'NB600-series',
    slug: 'nb600',
    description: '600W 풀 브릭 DC-DC 컨버터입니다.',
    descriptionEn: '600W full brick DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_b01.jpg',
    sortOrder: 14,
  },
  {
    id: 'ser-nhs',
    name: 'NHS/HS-series',
    slug: 'nhs-hs',
    description: '하프 브릭 DC-DC 컨버터입니다.',
    descriptionEn: 'Half brick DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_b02.jpg',
    sortOrder: 15,
  },
  {
    id: 'ser-nhf',
    name: 'NHF/HF-series',
    slug: 'nhf-hf',
    description: '고주파 하프 브릭 DC-DC 컨버터입니다.',
    descriptionEn: 'High frequency half brick DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_b03.jpg',
    sortOrder: 16,
  },
  {
    id: 'ser-hrs50',
    name: 'HRS50-series',
    slug: 'hrs50',
    description: '50W 하프 브릭 DC-DC 컨버터입니다.',
    descriptionEn: '50W half brick DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_b04.jpg',
    sortOrder: 17,
  },
  {
    id: 'ser-nes50',
    name: 'NES50-series',
    slug: 'nes50',
    description: '50W 산업용 DC-DC 컨버터입니다.',
    descriptionEn: '50W industrial DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p12.jpg',
    sortOrder: 18,
  },
  {
    id: 'ser-ubc160',
    name: 'UBC160-series',
    slug: 'ubc160',
    description: '160A 버스 컨버터입니다.',
    descriptionEn: '160A bus converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p13.jpg',
    sortOrder: 19,
  },
  {
    id: 'ser-uqc18a',
    name: 'UQC18A-series',
    slug: 'uqc18a',
    description: '18A 1/4 브릭 DC-DC 컨버터입니다.',
    descriptionEn: '18A 1/4 brick DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p14.jpg',
    sortOrder: 20,
  },
  {
    id: 'ser-ypm100',
    name: 'YPM100-series',
    slug: 'ypm100',
    description: '100W 하프 브릭 DC-DC 컨버터입니다.',
    descriptionEn: '100W half brick DC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/dc_p15.jpg',
    sortOrder: 21,
  },
];

// ─── AC-DC Series ───
const acDcSeriesList = [
  {
    id: 'ser-vfs5',
    name: 'VFS5-series',
    slug: 'vfs5',
    description: '최신 AC-DC 컨버터 시리즈입니다.',
    descriptionEn: 'Latest AC-DC converter series.',
    imageUrl: 'https://powerplaza.net/shop/image/vfs5_main_pop_ko.png',
    sortOrder: 1,
  },
  {
    id: 'ser-sf',
    name: 'SF-series',
    slug: 'sf',
    description:
      '초소형 온보드 AC-DC 컨버터 모듈입니다. 대기 전력 0.3W 이하를 만족합니다.',
    descriptionEn:
      'Ultra-compact on-board AC-DC converter modules. No-load power consumption below 0.3W.',
    imageUrl: 'https://powerplaza.net/shop/image/ac01.jpg',
    sortOrder: 2,
  },
  {
    id: 'ser-cfs',
    name: 'CFS-series',
    slug: 'cfs',
    description: '내장 필터 AC-DC 컨버터입니다.',
    descriptionEn: 'Built-in filter AC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/ac_p02.jpg',
    sortOrder: 3,
  },
  {
    id: 'ser-fs',
    name: 'FS-series',
    slug: 'fs',
    description: '외장형 AC-DC 컨버터입니다.',
    descriptionEn: 'Enclosed AC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/ac_p03.jpg',
    sortOrder: 4,
  },
  {
    id: 'ser-nf',
    name: 'NF-series',
    slug: 'nf',
    description: '프레임리스 AC-DC 컨버터입니다.',
    descriptionEn: 'Frameless AC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/ac_o01.jpg',
    sortOrder: 5,
  },
  {
    id: 'ser-c',
    name: 'C-series',
    slug: 'c',
    description: '커버 타입 AC-DC 컨버터입니다.',
    descriptionEn: 'Cover type AC-DC converters.',
    imageUrl: 'https://powerplaza.net/shop/image/ac_u01.jpg',
    sortOrder: 6,
  },
  {
    id: 'ser-sf-chassis',
    name: 'SF/FS Chassis',
    slug: 'sf-fs-chassis',
    description: 'SF/FS 시리즈 전용 섀시입니다.',
    descriptionEn: 'Dedicated chassis for SF/FS series.',
    imageUrl: 'https://powerplaza.net/shop/image/ac_p05.jpg',
    sortOrder: 7,
  },
  {
    id: 'ser-accessory',
    name: 'Accessory',
    slug: 'accessory',
    description: 'AC-DC 컨버터 액세서리입니다.',
    descriptionEn: 'AC-DC converter accessories.',
    imageUrl: 'https://powerplaza.net/shop/image/ac_p06.jpg',
    sortOrder: 8,
  },
];

// ─── EV Component Series ───
const evSeriesList = [
  {
    id: 'ser-ev-obc',
    name: 'On Board Charger',
    slug: 'on-board-charger',
    description:
      '전기차 내부 장착용 충전기로 AC를 DC로 변환하여 배터리를 충전합니다.',
    descriptionEn:
      'On-board charger that converts AC to DC for battery charging in EVs.',
    imageUrl: 'https://powerplaza.net/home/image/s223_s01_1.jpg',
    sortOrder: 1,
  },
  {
    id: 'ser-ev-pdu',
    name: 'Power Distribution Unit',
    slug: 'pdu',
    description: '전기차 전력 분배 장치입니다.',
    descriptionEn: 'Power distribution unit for EVs.',
    imageUrl: 'https://powerplaza.net/home/image/s223_s01_2.jpg',
    sortOrder: 2,
  },
  {
    id: 'ser-ev-bms',
    name: 'BMS',
    slug: 'bms',
    description: '배터리 관리 시스템입니다.',
    descriptionEn: 'Battery Management System.',
    imageUrl: 'https://powerplaza.net/home/image/s223_s01_3.jpg',
    sortOrder: 3,
  },
  {
    id: 'ser-ev-battery',
    name: 'Battery Module',
    slug: 'battery-module',
    description: '전기차 배터리 모듈입니다.',
    descriptionEn: 'EV battery module.',
    imageUrl: 'https://powerplaza.net/home/image/s223_s01_4.jpg',
    sortOrder: 4,
  },
  {
    id: 'ser-ev-ldc',
    name: 'LDC',
    slug: 'ldc',
    description:
      '저전압 DC-DC 컨버터로 보조 배터리 충전 및 저전압 부하 공급용입니다.',
    descriptionEn:
      'Low voltage DC-DC converter for auxiliary battery charging and low voltage loads.',
    imageUrl: 'https://powerplaza.net/home/image/s223_s01_4.jpg',
    sortOrder: 5,
  },
];

// ─── Representative Products per series ───
function makeProducts(
  seriesId: string,
  seriesSlug: string,
  items: Array<{
    model: string;
    vin: string;
    vout: string;
    iout: string;
    type: string;
    price: number;
    priceNote?: string;
    certs?: string[];
    imageUrl?: string;
  }>,
) {
  return items.map((item, idx) => ({
    id: `prod-${seriesSlug}-${idx + 1}`,
    seriesId,
    modelName: item.model,
    slug: item.model.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    imageUrl: item.imageUrl ?? `https://powerplaza.net/shop/image/dc01.jpg`,
    inputVoltage: item.vin,
    outputVoltage: item.vout,
    outputCurrent: item.iout,
    outputType: item.type,
    price: item.price,
    priceNote: item.priceNote ?? null,
    datasheetUrl: null,
    certifications: item.certs ?? ['rohs'],
    status: 'active' as const,
    specs: {} as Record<string, string>,
    specsEn: {} as Record<string, string>,
  }));
}

const dcDcProducts: Array<typeof products.$inferInsert> = [
  // SP-series
  ...makeProducts('ser-sp', 'sp', [
    {
      model: 'SPS20-48-5',
      vin: '36 ~ 76V',
      vout: '5V',
      iout: '4.00A',
      type: 'single',
      price: 30400,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'SPS20-48-12',
      vin: '36 ~ 76V',
      vout: '12V',
      iout: '1.70A',
      type: 'single',
      price: 30400,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'SPS20-48-15',
      vin: '36 ~ 76V',
      vout: '15V',
      iout: '1.40A',
      type: 'single',
      price: 30400,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'SPS20-24-5',
      vin: '18 ~ 36V',
      vout: '5V',
      iout: '4.00A',
      type: 'single',
      price: 29800,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'SPS20-24-12',
      vin: '18 ~ 36V',
      vout: '12V',
      iout: '1.70A',
      type: 'single',
      price: 29800,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'SPD20-48-1212',
      vin: '36 ~ 76V',
      vout: '+12V / -12V',
      iout: '0.85A / 0.85A',
      type: 'dual',
      price: 27500,
      certs: ['rohs'],
    },
    {
      model: 'SPS10-48-5',
      vin: '36 ~ 76V',
      vout: '5V',
      iout: '2.00A',
      type: 'single',
      price: 19400,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'SPS10-24-3R3',
      vin: '18 ~ 36V',
      vout: '3.3V',
      iout: '2.00A',
      type: 'single',
      price: 19400,
      certs: ['ce', 'rohs'],
    },
  ]),
  // SNS-series
  ...makeProducts('ser-sns', 'sns', [
    {
      model: 'SNS15A-12-5R0',
      vin: '10 ~ 14V',
      vout: '5.0V',
      iout: '15.00A',
      type: 'single',
      price: 16700,
    },
    {
      model: 'SNS15A-12-3R3',
      vin: '10 ~ 14V',
      vout: '3.3V',
      iout: '15.00A',
      type: 'single',
      price: 16700,
    },
    {
      model: 'SNS15A-5-3R3',
      vin: '4.5 ~ 5.5V',
      vout: '3.3V',
      iout: '15.00A',
      type: 'single',
      price: 16100,
    },
    {
      model: 'SNS10A-12-5R0',
      vin: '10 ~ 14V',
      vout: '5.0V',
      iout: '10.00A',
      type: 'single',
      price: 15800,
    },
    {
      model: 'SNS10A-12-3R3',
      vin: '10 ~ 14V',
      vout: '3.3V',
      iout: '10.00A',
      type: 'single',
      price: 15800,
    },
  ]),
  // VPS6-series
  ...makeProducts('ser-vps6', 'vps6', [
    {
      model: 'VPS6-24-3R3',
      vin: '9 ~ 36V',
      vout: '3.3V',
      iout: '1.50A',
      type: 'single',
      price: 18500,
    },
    {
      model: 'VPS6-24-5',
      vin: '9 ~ 36V',
      vout: '5V',
      iout: '1.20A',
      type: 'single',
      price: 18500,
    },
    {
      model: 'VPS6-24-12',
      vin: '9 ~ 36V',
      vout: '12V',
      iout: '0.50A',
      type: 'single',
      price: 18500,
    },
    {
      model: 'VPS6-48-3R3',
      vin: '18 ~ 75V',
      vout: '3.3V',
      iout: '1.50A',
      type: 'single',
      price: 19500,
    },
    {
      model: 'VPS6-48-5',
      vin: '18 ~ 75V',
      vout: '5V',
      iout: '1.20A',
      type: 'single',
      price: 19500,
    },
  ]),
  // NB600-series
  ...makeProducts('ser-nb600', 'nb600', [
    {
      model: 'NB600-48-3R3',
      vin: '36 ~ 76V',
      vout: '3.3V',
      iout: '120A',
      type: 'single',
      price: 269000,
    },
    {
      model: 'NB600-48-5',
      vin: '36 ~ 76V',
      vout: '5V',
      iout: '120A',
      type: 'single',
      price: 269000,
    },
  ]),
  // NHS/HS-series
  ...makeProducts('ser-nhs', 'nhs', [
    {
      model: 'NHS50-24-5',
      vin: '18 ~ 36V',
      vout: '5V',
      iout: '10A',
      type: 'single',
      price: 52000,
    },
    {
      model: 'NHS50-48-5',
      vin: '36 ~ 76V',
      vout: '5V',
      iout: '10A',
      type: 'single',
      price: 52000,
    },
    {
      model: 'NHS50-24-12',
      vin: '18 ~ 36V',
      vout: '12V',
      iout: '4.16A',
      type: 'single',
      price: 52000,
    },
  ]),
  // HRS50-series
  ...makeProducts('ser-hrs50', 'hrs50', [
    {
      model: 'HRS50-24-5',
      vin: '18 ~ 36V',
      vout: '5V',
      iout: '10A',
      type: 'single',
      price: 48000,
    },
    {
      model: 'HRS50-48-5',
      vin: '36 ~ 76V',
      vout: '5V',
      iout: '10A',
      type: 'single',
      price: 48000,
    },
  ]),
  // QPC20A-series
  ...makeProducts('ser-qpc20a', 'qpc20a', [
    {
      model: 'QPC20A-48-3R3',
      vin: '36 ~ 76V',
      vout: '3.3V',
      iout: '20A',
      type: 'single',
      price: 45000,
    },
    {
      model: 'QPC20A-48-5',
      vin: '36 ~ 76V',
      vout: '5V',
      iout: '20A',
      type: 'single',
      price: 45000,
    },
  ]),
];

const acDcProducts: Array<typeof products.$inferInsert> = [
  // SF-series
  ...makeProducts('ser-sf', 'sf', [
    {
      model: 'SFS5-3R3',
      vin: '85 ~ 264V',
      vout: '3.3V',
      iout: '1.25A',
      type: 'single',
      price: 14200,
      certs: ['ce', 'cb', 'emc', 'rohs'],
    },
    {
      model: 'SFS5-5',
      vin: '85 ~ 264V',
      vout: '5V',
      iout: '1.00A',
      type: 'single',
      price: 14200,
      certs: ['ce', 'cb', 'emc', 'rohs'],
    },
    {
      model: 'SFS5-12',
      vin: '85 ~ 264V',
      vout: '12V',
      iout: '0.42A',
      type: 'single',
      price: 14200,
      certs: ['ce', 'cb', 'emc', 'rohs'],
    },
    {
      model: 'SFS10-5',
      vin: '85 ~ 264V',
      vout: '5V',
      iout: '2.00A',
      type: 'single',
      price: 17800,
      certs: ['ce', 'cb', 'emc', 'rohs'],
    },
    {
      model: 'SFS10-12',
      vin: '85 ~ 264V',
      vout: '12V',
      iout: '0.83A',
      type: 'single',
      price: 17800,
      certs: ['ce', 'cb', 'emc', 'rohs'],
    },
    {
      model: 'SFD10-1212',
      vin: '85 ~ 264V',
      vout: '+12V / -12V',
      iout: '0.45A / 0.45A',
      type: 'dual',
      price: 18400,
      certs: ['rohs'],
    },
  ]),
  // VFS5-series
  ...makeProducts('ser-vfs5', 'vfs5', [
    {
      model: 'VFS5-5',
      vin: '85 ~ 264V',
      vout: '5V',
      iout: '1.00A',
      type: 'single',
      price: 15000,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'VFS5-12',
      vin: '85 ~ 264V',
      vout: '12V',
      iout: '0.42A',
      type: 'single',
      price: 15000,
      certs: ['ce', 'rohs'],
    },
  ]),
  // NF-series
  ...makeProducts('ser-nf', 'nf', [
    {
      model: 'NF30-48',
      vin: '85 ~ 264V',
      vout: '48V',
      iout: '0.63A',
      type: 'single',
      price: 35000,
      certs: ['ce', 'rohs'],
    },
    {
      model: 'NF30-24',
      vin: '85 ~ 264V',
      vout: '24V',
      iout: '1.25A',
      type: 'single',
      price: 35000,
      certs: ['ce', 'rohs'],
    },
  ]),
  // C-series
  ...makeProducts('ser-c', 'c', [
    {
      model: 'C50-48',
      vin: '85 ~ 264V',
      vout: '48V',
      iout: '1.04A',
      type: 'single',
      price: 45000,
      certs: ['ce', 'ul', 'rohs'],
    },
    {
      model: 'C50-24',
      vin: '85 ~ 264V',
      vout: '24V',
      iout: '2.08A',
      type: 'single',
      price: 45000,
      certs: ['ce', 'ul', 'rohs'],
    },
  ]),
];

const evProducts: Array<typeof products.$inferInsert> = [
  ...makeProducts('ser-ev-obc', 'ev-obc', [
    {
      model: 'EPC2000',
      vin: 'AC 90~265V',
      vout: 'DC 50~100V',
      iout: 'Max 20A',
      type: 'single',
      price: 0,
      priceNote: '문의',
      certs: [],
    },
  ]),
  ...makeProducts('ser-ev-pdu', 'ev-pdu', [
    {
      model: 'PDU-400',
      vin: 'DC 300~420V',
      vout: 'DC 12V/24V',
      iout: 'Various',
      type: 'other',
      price: 0,
      priceNote: '문의',
      certs: [],
    },
  ]),
  ...makeProducts('ser-ev-bms', 'ev-bms', [
    {
      model: 'BMS-100',
      vin: 'DC 200~400V',
      vout: 'Various',
      iout: 'Various',
      type: 'other',
      price: 0,
      priceNote: '문의',
      certs: [],
    },
  ]),
];

async function seed() {
  console.log('🌱 Starting seed...');

  // Seed categories
  console.log('📦 Seeding categories...');
  await db
    .insert(categories)
    .values([dcDcCategory, acDcCategory, evCategory])
    .onConflictDoNothing();

  // Seed DC-DC series
  console.log('📦 Seeding DC-DC series...');
  const dcDcSeriesData = dcDcSeriesList.map((s) => ({
    ...s,
    categoryId: dcDcCategory.id,
  }));
  await db.insert(productSeries).values(dcDcSeriesData).onConflictDoNothing();

  // Seed AC-DC series
  console.log('📦 Seeding AC-DC series...');
  const acDcSeriesData = acDcSeriesList.map((s) => ({
    ...s,
    categoryId: acDcCategory.id,
  }));
  await db.insert(productSeries).values(acDcSeriesData).onConflictDoNothing();

  // Seed EV series
  console.log('📦 Seeding EV series...');
  const evSeriesData = evSeriesList.map((s) => ({
    ...s,
    categoryId: evCategory.id,
  }));
  await db.insert(productSeries).values(evSeriesData).onConflictDoNothing();

  // Seed products
  console.log('📦 Seeding products...');
  const allProducts = [...dcDcProducts, ...acDcProducts, ...evProducts];
  await db.insert(products).values(allProducts).onConflictDoNothing();

  // Seed admin settings
  console.log('⚙️ Seeding admin settings...');
  await db
    .insert(adminSettings)
    .values([
      { key: 'notificationEmail', value: 'admin@powerplaza.com' },
      { key: 'companyNameKo', value: '(주)파워프라자' },
      { key: 'companyNameEn', value: 'PowerPlaza Co., Ltd.' },
      {
        key: 'companyAddress',
        value: '서울 금천구 서부샛길 648, 대륭테크노타운6차 1401호',
      },
      { key: 'companyPhone', value: '02-855-4955' },
      { key: 'companyFax', value: '02-855-4954' },
      { key: 'companyEmail', value: 'info@powerplaza.co.kr' },
    ])
    .onConflictDoNothing();

  // Seed admin user
  console.log('👤 Seeding admin user...');
  const adminEmail = 'admin@powerplaza.com';
  const adminPassword = 'admin1234';

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, adminEmail));
  if (existing.length > 0) {
    await db
      .update(user)
      .set({ role: 'admin' })
      .where(eq(user.email, adminEmail));
    console.log('✓ Admin user already exists, role confirmed');
  } else {
    try {
      await auth.api.signUpEmail({
        body: { email: adminEmail, password: adminPassword, name: 'Admin' },
      });
      await db
        .update(user)
        .set({ role: 'admin' })
        .where(eq(user.email, adminEmail));
      console.log('✓ Admin user created');
      console.log(`  Email: ${adminEmail}`);
      console.log(`  Password: ${adminPassword}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('already') || msg.includes('unique')) {
        await db
          .update(user)
          .set({ role: 'admin' })
          .where(eq(user.email, adminEmail));
        console.log('✓ Admin user already exists, role confirmed');
      } else {
        throw error;
      }
    }
  }

  console.log('✅ Seed complete!');
  console.log(`  Categories: 3`);
  console.log(`  DC-DC Series: ${dcDcSeriesList.length}`);
  console.log(`  AC-DC Series: ${acDcSeriesList.length}`);
  console.log(`  EV Series: ${evSeriesList.length}`);
  console.log(`  Total Products: ${allProducts.length}`);
}

seed().catch(console.error);

import { ParcelCategory, ParcelCategoryConfig } from '../types';

export const PARCEL_CATEGORIES: Record<ParcelCategory, ParcelCategoryConfig> = {
  ELECTRONICS_FRAGILE: {
    id: 'ELECTRONICS_FRAGILE',
    name: 'Electronics & Breakable',
    nameHindi: 'इलेक्ट्रॉनिक्स और नाजुक सामान',
    colorName: 'Red',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    borderColor: 'border-red-300',
    slotBg: 'bg-red-50 text-red-700 border-red-300 hover:bg-red-600 hover:text-white',
    slotBorder: 'border-red-300',
    slotHoverBg: 'hover:bg-red-600 hover:text-white',
    slotText: 'text-red-700',
    dotColor: 'bg-red-500',
    ringColor: 'ring-red-400',
    icon: '🔴',
    tagColor: '#EF4444',
  },
  APPAREL_SKINCARE: {
    id: 'APPAREL_SKINCARE',
    name: 'Clothes & Skincare',
    nameHindi: 'कपड़े और स्किनकेयर उत्पाद',
    colorName: 'Yellow',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-300',
    slotBg: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-500 hover:text-black',
    slotBorder: 'border-amber-300',
    slotHoverBg: 'hover:bg-amber-500 hover:text-black',
    slotText: 'text-amber-800',
    dotColor: 'bg-amber-400',
    ringColor: 'ring-amber-400',
    icon: '🟡',
    tagColor: '#F59E0B',
  },
  BOOKS_DOCUMENTS: {
    id: 'BOOKS_DOCUMENTS',
    name: 'Books & Bank Docs',
    nameHindi: 'किताबें और बैंकिंग दस्तावेज',
    colorName: 'Blue',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    borderColor: 'border-sky-300',
    slotBg: 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-600 hover:text-white',
    slotBorder: 'border-sky-300',
    slotHoverBg: 'hover:bg-sky-600 hover:text-white',
    slotText: 'text-sky-800',
    dotColor: 'bg-sky-500',
    ringColor: 'ring-sky-400',
    icon: '🔵',
    tagColor: '#0284C7',
  },
  HOME_KITCHEN: {
    id: 'HOME_KITCHEN',
    name: 'Home & Kitchen',
    nameHindi: 'घर और रसोई उपकरण',
    colorName: 'Green',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    slotBg: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-600 hover:text-white',
    slotBorder: 'border-emerald-300',
    slotHoverBg: 'hover:bg-emerald-600 hover:text-white',
    slotText: 'text-emerald-800',
    dotColor: 'bg-emerald-500',
    ringColor: 'ring-emerald-400',
    icon: '🟢',
    tagColor: '#10B981',
  },
  HEALTH_BABY_ESSENTIALS: {
    id: 'HEALTH_BABY_ESSENTIALS',
    name: 'Health & Baby Care',
    nameHindi: 'स्वास्थ्य और शिशु देखभाल',
    colorName: 'Purple',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    borderColor: 'border-purple-300',
    slotBg: 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-600 hover:text-white',
    slotBorder: 'border-purple-300',
    slotHoverBg: 'hover:bg-purple-600 hover:text-white',
    slotText: 'text-purple-800',
    dotColor: 'bg-purple-500',
    ringColor: 'ring-purple-400',
    icon: '🟣',
    tagColor: '#8B5CF6',
  },
};

export function getParcelCategory(item: string = '', explicitCat?: ParcelCategory): ParcelCategory {
  if (explicitCat && PARCEL_CATEGORIES[explicitCat]) {
    return explicitCat;
  }
  const lower = item.toLowerCase();

  // 1. Electronics & Breakable (Red)
  if (
    lower.includes('earbud') ||
    lower.includes('airdopes') ||
    lower.includes('headphone') ||
    lower.includes('earphone') ||
    lower.includes('smartwatch') ||
    (lower.includes('watch') && !lower.includes('handwash')) ||
    lower.includes('mouse') ||
    lower.includes('keyboard') ||
    lower.includes('powerbank') ||
    lower.includes('power bank') ||
    lower.includes('speaker') ||
    lower.includes('soundbar') ||
    lower.includes('sounddrum') ||
    lower.includes('dryer') ||
    lower.includes('drive') ||
    lower.includes('sandisk') ||
    lower.includes('glass') ||
    lower.includes('borosil') ||
    lower.includes('breakable') ||
    lower.includes('fragile') ||
    lower.includes('plug') ||
    lower.includes('wifi') ||
    lower.includes('technic') ||
    lower.includes('electronic')
  ) {
    return 'ELECTRONICS_FRAGILE';
  }

  // 2. Clothes & Skincare (Yellow)
  if (
    lower.includes('shoe') ||
    lower.includes('running') ||
    lower.includes('sneaker') ||
    lower.includes('serum') ||
    lower.includes('lipstick') ||
    lower.includes('skincare') ||
    lower.includes('skin') ||
    lower.includes('cloth') ||
    lower.includes('apparel') ||
    lower.includes('shirt') ||
    lower.includes('dress') ||
    lower.includes('rucksack') ||
    lower.includes('trolley') ||
    lower.includes('bag') && !lower.includes('tea') ||
    lower.includes('hair care') ||
    lower.includes('nitro') ||
    lower.includes('puma') ||
    lower.includes('bata') ||
    lower.includes('campus') ||
    lower.includes('wildcraft') ||
    lower.includes('safari') ||
    lower.includes('fossil') ||
    lower.includes('mamaearth') ||
    lower.includes('nykaa')
  ) {
    return 'APPAREL_SKINCARE';
  }

  // 3. Books & Bank Documents (Blue)
  if (
    lower.includes('card') ||
    lower.includes('pen') ||
    lower.includes('octane') ||
    lower.includes('classmate') ||
    lower.includes('book') ||
    lower.includes('document') ||
    lower.includes('stationery') ||
    lower.includes('passbook') ||
    lower.includes('cheque')
  ) {
    return 'BOOKS_DOCUMENTS';
  }

  // 4. Home & Kitchen (Green)
  if (
    lower.includes('cooker') ||
    lower.includes('pigeon') ||
    lower.includes('fan') ||
    lower.includes('crompton') ||
    lower.includes('iron') ||
    lower.includes('bajaj') ||
    lower.includes('purifier') ||
    lower.includes('kent') ||
    lower.includes('wire') ||
    lower.includes('havells') ||
    lower.includes('switch') ||
    lower.includes('anchor') ||
    lower.includes('freshener') ||
    lower.includes('godrej') ||
    lower.includes('lunchbox') ||
    lower.includes('kitchen')
  ) {
    return 'HOME_KITCHEN';
  }

  // 5. Health & Baby Care (Purple)
  if (
    lower.includes('diaper') ||
    lower.includes('pampers') ||
    lower.includes('handwash') ||
    lower.includes('dettol') ||
    lower.includes('pharma') ||
    lower.includes('tablet') ||
    lower.includes('medicine') ||
    lower.includes('sanitizer') ||
    lower.includes('health') ||
    lower.includes('baby')
  ) {
    return 'HEALTH_BABY_ESSENTIALS';
  }

  return 'ELECTRONICS_FRAGILE';
}

export function getCategoryConfig(cat: ParcelCategory): ParcelCategoryConfig {
  return PARCEL_CATEGORIES[cat] || PARCEL_CATEGORIES.ELECTRONICS_FRAGILE;
}

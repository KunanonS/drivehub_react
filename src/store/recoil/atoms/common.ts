import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { CarInCart } from "../../../types/common";

const { persistAtom } = recoilPersist();

export const cartListState = atom<CarInCart[]>({
    key: 'CartListState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});

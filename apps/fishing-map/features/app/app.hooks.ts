import type { TypedUseSelectorHook} from 'react-redux';
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from 'reducers'
import type { AppDispatch } from 'store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

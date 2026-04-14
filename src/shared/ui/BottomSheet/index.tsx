import { forwardRef, type ReactNode, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import { radius } from '@/shared/theme/radius';
import { spacing } from '@/shared/theme/spacing';

interface BottomSheetProps {
  children: ReactNode;
  /** Snap points (проценты или пиксели) */
  snapPoints?: (string | number)[];
  /** Callback при закрытии */
  onClose?: () => void;
  /** Включить затемнение фона */
  enableBackdrop?: boolean;
}

/** Обёртка над @gorhom/bottom-sheet с дефолтными настройками */
export const BottomSheet = forwardRef<GorhomBottomSheet, BottomSheetProps>(
  function BottomSheet(
    { children, snapPoints: customSnapPoints, onClose, enableBackdrop = true },
    ref,
  ) {
    const snapPoints = useMemo(() => customSnapPoints ?? ['40%', '70%'], [customSnapPoints]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
      ),
      [],
    );

    return (
      <GorhomBottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        backdropComponent={enableBackdrop ? renderBackdrop : undefined}
        handleIndicatorStyle={styles.indicator}
        backgroundStyle={styles.background}
      >
        {children}
      </GorhomBottomSheet>
    );
  },
);

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: '#C4C4C4',
    width: 40,
  },
  background: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
  },
});
